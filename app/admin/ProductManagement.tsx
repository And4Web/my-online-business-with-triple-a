
"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

type Product = {
  id: string;
  slug: string;
  title: string;
  category: string;
  description: string;
  technologies: string[];
  price: number;
  color: string;
  features: string[];
  imageUrl?: string;
  status: "draft" | "coming-soon" | "active";
};

type ProductManagementProps = {
  initialProducts: Product[];
};

type ProductForm = {
  slug: string;
  title: string;
  category: string;
  description: string;
  technologies: string;
  price: string;
  color: string;
  features: string;
  imageUrl: string;
  status: "draft" | "coming-soon" | "active";
};

const emptyForm: ProductForm = {
  slug: "",
  title: "",
  category: "",
  description: "",
  technologies: "",
  price: "19",
  color: "blue",
  features: "",
  imageUrl: "",
  status: "draft",
};

const statusStyles: Record<string, string> = {
  active: "bg-emerald-500/10 text-emerald-400",
  "coming-soon": "bg-blue-500/10 text-blue-400",
  draft: "bg-slate-700 text-slate-300",
};

export default function ProductManagement({
  initialProducts,
}: ProductManagementProps) {
  const [products, setProducts] = useState(initialProducts);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const router = useRouter();

  const categories = Array.from(
  new Set(products.map((product) => product.category))
).sort();

const filteredProducts = products.filter((product) => {
  const search = searchTerm.trim().toLowerCase();

  const matchesSearch =
    product.title.toLowerCase().includes(search) ||
    product.slug.toLowerCase().includes(search);

  const matchesCategory =
    selectedCategory === "all" ||
    product.category === selectedCategory;

  const matchesStatus =
    selectedStatus === "all" ||
    product.status === selectedStatus;

  return matchesSearch && matchesCategory && matchesStatus;
});
  
  function openNewForm() {
    setForm(emptyForm);
    setEditingId(null);
    setMessage("");
    setError("");
    setFormOpen(true);
  }

  function openEditForm(product: Product) {
    setForm({
      slug: product.slug,
      title: product.title,
      category: product.category,
      description: product.description,
      technologies: product.technologies.join(", "),
      price: String(product.price),
      color: product.color,
      features: product.features.join("\n"),
      imageUrl: product.imageUrl || "",
      status: product.status,
    });

    setEditingId(product.id);
    setMessage("");
    setError("");
    setFormOpen(true);
  }

  function closeForm() {
    setFormOpen(false);
    setEditingId(null);
    setForm(emptyForm);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setError("");
    setMessage("");

    const payload = {
      slug: form.slug.trim().toLowerCase(),
      title: form.title.trim(),
      category: form.category.trim(),
      description: form.description.trim(),
      technologies: form.technologies
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      price: Number(form.price),
      color: form.color.trim(),
      features: form.features
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean),
      imageUrl: form.imageUrl.trim(),
      status: form.status,
    };

    try {
      const url = editingId
        ? `/api/admin/products/${editingId}`
        : "/api/admin/products";

      const response = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to save product.");
      }

      if (editingId) {
        setProducts((current) =>
          current.map((product) =>
            product.id === editingId
              ? { ...product, ...payload }
              : product
          )
        );

        setMessage("Product saved successfully.");
        router.refresh();
      } else {
        const listResponse = await fetch("/api/admin/products");
        const listData = await listResponse.json();

        if (!listResponse.ok) {
          throw new Error(
            listData.message || "Product created, but the list could not refresh."
          );
        }

        setProducts(listData.products.map((product: Product & { _id?: string }) => ({
          ...product,
          id: product.id || product._id || "",
        })));

        setMessage("Product created successfully.");
      }

      closeForm();
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(product: Product) {
    const confirmed = window.confirm(
      `Are you sure you want to permanently delete "${product.title}"?`
    );

    if (!confirmed) return;

    setError("");
    setMessage("");

    try {
      const response = await fetch(
        `/api/admin/products/${product.id}`,
        { method: "DELETE" }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to delete product.");
      }

      setProducts((current) =>
        current.filter((item) => item.id !== product.id)
      );

      setMessage("Product deleted successfully.");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    }
  }

  return (
    <section className="mt-10 rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-semibold">Product Management</h2>
          <p className="mt-1 text-sm text-slate-400">
            Create, edit and manage your marketplace products.
          </p>
        </div>

        <button
          type="button"
          onClick={openNewForm}
          className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
        >
          + Add New Product
        </button>
      </div>

      {message && (
        <p
          role="status"
          className="mb-5 rounded-xl border border-emerald-800 bg-emerald-950/30 p-4 text-sm text-emerald-300"
        >
          {message}
        </p>
      )}

      {error && (
        <p
          role="alert"
          className="mb-5 rounded-xl border border-red-900 bg-red-950/30 p-4 text-sm text-red-300"
        >
          {error}
        </p>
      )}

      {formOpen && (
        <form
          onSubmit={handleSubmit}
          className="mb-8 rounded-xl border border-slate-700 bg-slate-950 p-5"
        >
          <h3 className="mb-5 text-lg font-semibold">
            {editingId ? "Edit Product" : "Add New Product"}
          </h3>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm text-slate-300">
                Product Title
              </label>
              <input
                required
                maxLength={150}
                value={form.title}
                onChange={(event) =>
                  setForm({ ...form, title: event.target.value })
                }
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-300">
                Product Slug
              </label>
              <input
                required
                maxLength={100}
                pattern="[a-z0-9]+(-[a-z0-9]+)*"
                title="Use lowercase letters, numbers and hyphens only."
                value={form.slug}
                onChange={(event) =>
                  setForm({ ...form, slug: event.target.value.toLowerCase() })
                }
                placeholder="e-commerce-platform"
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-300">
                Category
              </label>
              <input
                required
                maxLength={80}
                value={form.category}
                onChange={(event) =>
                  setForm({ ...form, category: event.target.value })
                }
                placeholder="E-commerce"
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-300">
                Price (USD)
              </label>
              <input
                required
                type="number"
                min="1"
                max="49"
                step="0.01"
                value={form.price}
                onChange={(event) =>
                  setForm({ ...form, price: event.target.value })
                }
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-blue-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm text-slate-300">
                Description
              </label>
              <textarea
                required
                maxLength={2000}
                rows={4}
                value={form.description}
                onChange={(event) =>
                  setForm({ ...form, description: event.target.value })
                }
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-blue-500"
              />
            </div>

            <div className="sm:col-span-2">
  <label className="mb-2 block text-sm text-slate-300">
    Product Preview Image URL
  </label>

  <input
    type="url"
    maxLength={2048}
    value={form.imageUrl}
    onChange={(event) =>
      setForm({ ...form, imageUrl: event.target.value })
    }
    placeholder="https://example.com/my-project-preview.jpg"
    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-blue-500"
  />

  <p className="mt-2 text-xs text-slate-500">
    Optional. Add a publicly accessible HTTPS image URL.
  </p>
</div>

            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm text-slate-300">
                Technologies (separate with commas)
              </label>
              <input
                required
                value={form.technologies}
                onChange={(event) =>
                  setForm({ ...form, technologies: event.target.value })
                }
                placeholder="Next.js, MongoDB, TypeScript"
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-blue-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm text-slate-300">
                Features (one feature per line)
              </label>
              <textarea
                rows={4}
                value={form.features}
                onChange={(event) =>
                  setForm({ ...form, features: event.target.value })
                }
                placeholder={"User authentication\nAdmin dashboard\nResponsive design"}
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-300">
                Color
              </label>
              <input
                required
                maxLength={30}
                pattern="[a-zA-Z0-9-]+"
                value={form.color}
                onChange={(event) =>
                  setForm({ ...form, color: event.target.value })
                }
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-300">
                Status
              </label>
              <select
                value={form.status}
                onChange={(event) =>
                  setForm({
                    ...form,
                    status: event.target.value as ProductForm["status"],
                  })
                }
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-blue-500"
              >
                <option value="draft">Draft</option>
                <option value="coming-soon">Coming Soon</option>
                <option value="active">Active</option>
              </select>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Saving..."
                : editingId
                  ? "Save Changes"
                  : "Create Product"}
            </button>

            <button
              type="button"
              onClick={closeForm}
              disabled={loading}
              className="rounded-lg border border-slate-700 px-5 py-3 text-sm text-slate-300 transition hover:bg-slate-800"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
  <input
    type="search"
    value={searchTerm}
    onChange={(event) => setSearchTerm(event.target.value)}
    placeholder="Search by project title or slug..."
    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
  />

  <select
    value={selectedCategory}
    onChange={(event) => setSelectedCategory(event.target.value)}
    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
  >
    <option value="all">All Categories</option>
    {categories.map((category) => (
      <option key={category} value={category}>
        {category}
      </option>
    ))}
  </select>

  <select
    value={selectedStatus}
    onChange={(event) => setSelectedStatus(event.target.value)}
    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
  >
    <option value="all">All Statuses</option>
    <option value="active">Active</option>
    <option value="coming-soon">Coming Soon</option>
    <option value="draft">Draft</option>
  </select>

  <button
    type="button"
    onClick={() => {
      setSearchTerm("");
      setSelectedCategory("all");
      setSelectedStatus("all");
    }}
    className="rounded-lg border border-slate-700 px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-slate-800"
  >
    Clear Filters
  </button>
</div>

<div className="overflow-x-auto">
  <table className="w-full min-w-175 text-left text-sm">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400">
              <th className="px-4 py-4 font-medium">Project</th>
              <th className="px-4 py-4 font-medium">Category</th>
              <th className="px-4 py-4 font-medium">Price</th>
              <th className="px-4 py-4 font-medium">Status</th>
              <th className="px-4 py-4 font-medium">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredProducts.map((product) => (
              <tr
                key={product.id}
                className="border-b border-slate-800 last:border-0"
              >
                <td className="px-4 py-4 font-medium text-white">
                  {product.title}
                </td>

                <td className="px-4 py-4 text-slate-400">
                  {product.category}
                </td>

                <td className="px-4 py-4 text-slate-300">
                  ${product.price.toFixed(2)}
                </td>

                <td className="px-4 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      statusStyles[product.status]
                    }`}
                  >
                    {product.status}
                  </span>
                </td>

                <td className="px-4 py-4">
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => openEditForm(product)}
                      className="font-medium text-blue-400 hover:text-blue-300"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(product)}
                      className="font-medium text-red-400 hover:text-red-300"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {filteredProducts.length === 0 && (
  <tr>
    <td
      colSpan={5}
      className="px-4 py-12 text-center text-slate-400"
    >
      {products.length === 0
        ? "No products found. Create your first product above."
        : "No products match your search or selected filters."}
    </td>
  </tr>
)}
          </tbody>
        </table>
      </div>

    

    

      <p className="mt-4 text-sm text-slate-500">
  Showing {filteredProducts.length} of {products.length} products.
</p>
    </section>
  );
}
