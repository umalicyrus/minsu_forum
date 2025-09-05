"use client";
import { useState, useEffect } from "react";

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [form, setForm] = useState({ name: "", description: "", price: "", stock: "", categoryId: ""});

  // Fetch products
  useEffect(() => {
    fetch("/api/products")
      .then(res => res.json())
      .then(data => setProducts(data));
  }, []);

  // Create product
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
      sellerId: 1,
      categoryId: Number(form.categoryId),
}),
    });
    location.reload(); // refresh after adding
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Products</h1>

      <form onSubmit={handleSubmit} className="my-4 space-y-2">
        <input
          placeholder="Name"
          className="border p-2"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
        />
        <input
          placeholder="Description"
          className="border p-2"
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
        />
        <input
          placeholder="Price"
          type="number"
          className="border p-2"
          value={form.price}
          onChange={e => setForm({ ...form, price: e.target.value })}
        />
        <input
          placeholder="Stock"
          type="number"
          className="border p-2"
          value={form.stock}
          onChange={e => setForm({ ...form, stock: e.target.value })}
        />
        <input
          placeholder="Category ID"
          type="number"
          className="border p-2"
          value={form.categoryId}
          onChange={e => setForm({ ...form, categoryId: e.target.value })}
        />     
        <button className="bg-blue-500 text-white px-4 py-2 rounded">Add</button>
      </form>

      <ul className="space-y-2">
        {products.map((p) => (
          <li key={p.id} className="border p-2 flex justify-between">
            <span>{p.name} - ₱{p.price}</span>
            <a href={`/products/${p.id}`} className="text-blue-600">Edit</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
