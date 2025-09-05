"use client";
import { useEffect, useState } from "react";

type Product = {
  id: number;
  name: string;
  price: number;
  image?: string | null;
};

type Order = {
  id: number;
  createdAt: string;
  product: Product;
};

export default function MyOrders() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const res = await fetch("/api/orders");
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      } else {
        const error = await res.json();
        alert(error.error);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">My Purchases</h1>
      {orders.length === 0 ? (
        <p>No purchases yet.</p>
      ) : (
        <ul className="space-y-2">
          {orders.map((order) => (
            <li key={order.id} className="p-4 border rounded-lg shadow">
              <p>
                <strong>{order.product.name}</strong> — ₱{order.product.price}
              </p>
              <p className="text-sm text-gray-500">
                Bought on {new Date(order.createdAt).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
