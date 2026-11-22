# And4Web

### Original Ready-Made Software & Full-Stack Source Code

And4Web is a software brand operated by **Divine Flame IT Solutions**. It offers original, ready-made full-stack software applications and source-code solutions developed and owned by the business.

The platform helps developers, entrepreneurs, startups, and businesses access practical software solutions that they can purchase, customize, learn from, and deploy.

🌐 **Website:** https://www.and4web.co.in

---

## About the Project

And4Web is an online software store focused on making ready-made web applications and their source code accessible to customers worldwide.

The software collection includes solutions such as:

- E-commerce applications
- Real-time chat and messaging applications
- Booking and appointment systems
- Blog and content management applications
- Administrative dashboards
- Productivity applications
- Other full-stack web application solutions

Customers can purchase the source code and deploy it independently on their preferred hosting infrastructure. An additional deployment service may also be available for customers who want assistance deploying their purchased software.

All products are developed and owned by Divine Flame IT Solutions. And4Web does not operate as a multi-vendor marketplace and does not onboard third-party sellers.

## Key Features

### Customer Experience

- Responsive homepage and website navigation
- Software product catalogue
- Individual product detail pages
- Product search and category filtering
- Product pricing and feature information
- Live product demonstration links, where available
- Customer registration and secure sign-in
- Persistent shopping cart
- Multi-product checkout
- Customer account dashboard
- Order history and order status tracking

### Shopping and Checkout

- Account-backed persistent cart
- Add and remove products
- Prevent duplicate products in the cart
- Server-side product availability validation
- Server-side price calculation
- Customer billing information collection
- Country-based tax calculation
- Combined checkout for multiple products
- Individual line items stored in orders

### Order Management

- Pending order creation
- Idempotency protection for order requests
- Combined multi-product orders
- Customer order history
- Administrative order listing
- Order payment status tracking

### Digital Product Delivery

- Private Backblaze B2 object storage
- ZIP source-code package uploads
- ZIP file validation
- Product-specific storage keys
- Secure authenticated download endpoints
- Customer ownership verification
- Paid-order verification before downloads
- Short-lived signed download URLs

### Invoice Management

- Automated invoice generation
- Unique financial-year-based invoice numbers
- GST-aware invoice calculations
- Domestic and international tax information
- Multi-product invoice line items
- Seller and customer information
- PDF invoice generation
- Private invoice PDF storage
- Invoice status tracking
- Development-only invoice testing tools

### Administration

- Protected administrator dashboard
- Product creation and management
- Product updates and deletion
- Product status management
- Product image management
- Source-code ZIP package management
- Order monitoring
- Invoice monitoring

---

## Technology Stack

| Technology | Purpose |
|---|---|
| Next.js App Router | Full-stack application framework |
| React | User interface |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| shadcn/ui | UI components |
| Node.js | JavaScript runtime |
| MongoDB Atlas | Database |
| Mongoose | Database modelling and queries |
| Better Auth | Authentication |
| Backblaze B2 | Private digital file storage |
| @react-pdf/renderer | PDF invoice generation |
| Netlify | Website hosting |

## Project Architecture

And4Web uses the Next.js App Router architecture.

The application contains:

- Public website pages
- Customer account pages
- Protected administrative pages
- Next.js API route handlers
- Mongoose database models
- Authentication utilities
- Invoice generation utilities
- Private digital file storage utilities

The application uses Next.js server-side functionality and API route handlers rather than maintaining a separate Express backend.

## Project Structure

```text
app/
├── about/
├── account/
├── admin/
├── api/
│   ├── admin/
│   ├── cart/
│   ├── checkout/
│   ├── orders/
│   └── ...
├── contact/
├── lib/
│   ├── invoices/
│   ├── models/
│   ├── auth.ts
│   ├── auth-client.ts
│   ├── mongodb.ts
│   └── ...
├── privacy/
├── projects/
│   └── [slug]/
├── refund/
├── sign-in/
├── sign-up/
├── terms/
├── layout.tsx
└── page.tsx

public/
├── images/
└── ...

next.config.ts
package.json
README.md
```

*The structure above is representative; individual files and folders may evolve as the project develops.*

---

## Getting Started

### Requirements

Before running the project locally, install:

- Node.js (version 22 or compatible)
- npm
- Git
- MongoDB Atlas account or a compatible MongoDB deployment

### 1. Clone the Repository

```bash
git clone YOUR_REPOSITORY_URL
cd YOUR_PROJECT_DIRECTORY
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the project root.

Configure the required environment variables using your own credentials:

```env
MONGODB_URI=

BETTER_AUTH_SECRET=

BETTER_AUTH_URL=

# Private object storage
B2_ENDPOINT=
B2_REGION=
B2_BUCKET_NAME=
B2_ACCESS_KEY_ID=
B2_SECRET_ACCESS_KEY=
```

Additional environment variables may be required for email delivery, file storage, hosting, and other integrations depending on the enabled features.

**Important:** Never commit `.env.local`, API keys, database credentials, authentication secrets, or private storage credentials to GitHub.

### 4. Start the Development Server

```bash
npm run dev
```

Open:

http://localhost:3000

### 5. Create a Production Build

```bash
npm run build
```

To run the production build locally:

```bash
npm run start
```

---

## Security

Security is an important part of the And4Web architecture.

The application includes:

- Protected customer and administrator routes
- Server-side authentication checks
- Administrator authorization
- Server-side product price validation
- Server-side product availability validation
- Order idempotency protection
- Private source-code storage
- ZIP file validation
- Customer ownership checks for downloads
- Paid-order verification before source-code delivery
- Short-lived signed download URLs
- Environment-based secret management

Sensitive credentials and private source-code files are not intended to be exposed through the public repository.

## Payments and Order Processing

The checkout and order-management infrastructure is implemented.

**Triple-A payment integration is pending KYB approval.**

The intended payment model uses USDT payments through Triple-A, subject to provider approval and final integration requirements.

Until the payment integration and verified payment webhook are implemented, newly created orders remain pending. An order must not be marked as paid without verified payment confirmation.

## Hosting and Deployment

The production website is hosted on Netlify and uses MongoDB Atlas for database services.

The application is designed around Next.js deployment requirements.

Individual software products may also have separate live demonstration deployments. These demonstrations allow potential customers to explore sample applications before purchasing their source code.

---

## Business Information

**Software Brand:** And4Web  
**Business:** Divine Flame IT Solutions  
**Website:** https://www.and4web.co.in

And4Web is independently developed and operated by Divine Flame IT Solutions.

All software products offered through the website are developed and owned by the business.

## Development Status

And4Web's primary website, product catalogue, authentication, administration, cart, checkout, order management, secure digital delivery infrastructure, and invoice generation have been implemented.

The production build currently completes successfully.

Remaining work includes:

- Triple-A KYB approval
- Payment integration
- Verified payment webhook implementation
- End-to-end payment and delivery testing
- Final production readiness checks

## License

This repository and its contents are proprietary unless a specific component or file states otherwise.

The presence of this repository on GitHub does not grant permission to copy, redistribute, resell, or commercially exploit the software or its source code.

For licensing and usage rights, refer to the applicable terms published on the official website.

---

**And4Web — Original Software. Practical Solutions. Built for Developers.**

Website: https://www.and4web.co.in