import { createHmac } from "node:crypto";
import { Resend } from "resend";
import { NextResponse } from "next/server";

import dbConnect from "@/app/lib/mongodb";
import ContactRateLimit from "@/app/lib/models/ContactRateLimit";

const MAX_REQUEST_SIZE = 16 * 1024;
const RATE_LIMIT = 5;
const WINDOW_MINUTES = 15;
const WINDOW_MS = WINDOW_MINUTES * 60 * 1000;

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return entities[character];
  });
}

function getClientIp(request: Request): string {
  // Prefer the IP supplied by the hosting platform.
  const realIp = request.headers.get("x-real-ip")?.trim();

  if (realIp) {
    return realIp;
  }

  // Fallback for platforms using x-forwarded-for.
  const forwardedFor = request.headers.get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  return "unknown";
}

async function checkRateLimit(ip: string, secret: string) {
  await dbConnect();

  // Store a keyed hash rather than the raw IP address.
  const identifier = createHmac("sha256", secret).update(ip).digest("hex");

  const now = new Date();
  const windowStart = new Date(now.getTime() - WINDOW_MS);

  // Atomic MongoDB update: increment the existing window
  // or start a fresh window when the previous one expires.
  const updatePipeline = [
    {
      $set: {
        isActiveWindow: {
          $gt: [{ $ifNull: ["$windowStartedAt", new Date(0)] }, windowStart],
        },
      },
    },
    {
      $set: {
        count: {
          $cond: [
            "$isActiveWindow",
            { $add: [{ $ifNull: ["$count", 0] }, 1] },
            1,
          ],
        },
        windowStartedAt: {
          $cond: ["$isActiveWindow", "$windowStartedAt", now],
        },
        expiresAt: {
          $dateAdd: {
            startDate: {
              $cond: ["$isActiveWindow", "$windowStartedAt", now],
            },
            unit: "minute",
            amount: WINDOW_MINUTES,
          },
        },
      },
    },
    { $unset: "isActiveWindow" },
  ] as never;

  const record = await ContactRateLimit.findOneAndUpdate(
    { _id: identifier },
    updatePipeline,
    {
      upsert: true,
      new: true,
      updatePipeline: true,
    },
  ).lean();

  if (!record) {
    throw new Error("Unable to check contact rate limit.");
  }

  const allowed = record.count <= RATE_LIMIT;

  const resetAt = record.windowStartedAt.getTime() + WINDOW_MS;

  const retryAfter = Math.max(1, Math.ceil((resetAt - now.getTime()) / 1000));

  return { allowed, retryAfter };
}

export async function POST(request: Request) {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    const toEmail = process.env.CONTACT_TO_EMAIL;
    const fromEmail = process.env.CONTACT_FROM_EMAIL;
    const rateLimitSecret = process.env.BETTER_AUTH_SECRET;

    if (!apiKey || !toEmail || !fromEmail || !rateLimitSecret) {
      console.error("Contact API environment variables are missing.");

      return NextResponse.json(
        {
          success: false,
          message: "Email service is not configured.",
        },
        { status: 500 },
      );
    }

    // Reject obviously oversized requests.
    const contentLength = Number(request.headers.get("content-length") || 0);

    if (contentLength > MAX_REQUEST_SIZE) {
      return NextResponse.json(
        { success: false, message: "Request is too large." },
        { status: 413 },
      );
    }

    // Read and validate the actual request size.
    const rawBody = await request.text();

    if (new TextEncoder().encode(rawBody).length > MAX_REQUEST_SIZE) {
      return NextResponse.json(
        { success: false, message: "Request is too large." },
        { status: 413 },
      );
    }

    let body: unknown;

    try {
      body = JSON.parse(rawBody);
    } catch {
      return NextResponse.json(
        { success: false, message: "Invalid request data." },
        { status: 400 },
      );
    }

    if (typeof body !== "object" || body === null || Array.isArray(body)) {
      return NextResponse.json(
        { success: false, message: "Invalid request data." },
        { status: 400 },
      );
    }

    const payload = body as Record<string, unknown>;

    const name = typeof payload.name === "string" ? payload.name.trim() : "";

    const email = typeof payload.email === "string" ? payload.email.trim() : "";

    const subject =
      typeof payload.subject === "string" ? payload.subject.trim() : "";

    const message =
      typeof payload.message === "string" ? payload.message.trim() : "";

    // Basic bot protection.
    const website =
      typeof payload.website === "string" ? payload.website.trim() : "";

    if (website) {
      return NextResponse.json({
        success: true,
        message: "Your message has been received.",
      });
    }

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        {
          success: false,
          message: "Please fill in all required fields.",
        },
        { status: 400 },
      );
    }

    if (
      name.length > 100 ||
      email.length > 254 ||
      subject.length > 150 ||
      message.length > 5000
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "One or more fields are too long.",
        },
        { status: 400 },
      );
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter a valid email address.",
        },
        { status: 400 },
      );
    }

    // Prevent newline injection into the email subject.
    if (/[\r\n]/.test(subject)) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter a valid subject.",
        },
        { status: 400 },
      );
    }

    // Apply rate limiting only after basic validation.
    const clientIp = getClientIp(request);

    const { allowed, retryAfter } = await checkRateLimit(
      clientIp,
      rateLimitSecret,
    );

    if (!allowed) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Too many messages have been submitted. Please try again later.",
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(retryAfter),
          },
        },
      );
    }

    const resend = new Resend(apiKey);

    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeSubject = escapeHtml(subject);
    const safeMessage = escapeHtml(message).replace(/\r?\n/g, "<br>");

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [toEmail],
      replyTo: email,
      subject: `Nexora Contact: ${subject}`,
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        `Subject: ${subject}`,
        "",
        "Message:",
        message,
      ].join("\n"),
      html: `
        <h2>New Contact Enquiry - Nexora</h2>
        <p><strong>Name:</strong> ${safeName}</p>
        <p><strong>Email:</strong> ${safeEmail}</p>
        <p><strong>Subject:</strong> ${safeSubject}</p>
        <p><strong>Message:</strong></p>
        <p>${safeMessage}</p>
      `,
    });

    if (error) {
      console.error("Resend email error:", error);

      return NextResponse.json(
        {
          success: false,
          message:
            "Unable to send your message right now. Please try again later.",
        },
        { status: 502 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Your message has been sent successfully.",
      id: data?.id,
    });
  } catch (error) {
    console.error("Contact API error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong. Please try again later.",
      },
      { status: 500 },
    );
  }
}
