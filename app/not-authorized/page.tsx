"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NotAuthorizedPage() {
  const router = useRouter();

  useEffect(() => {
    alert("You are not authorized to access this page.");
    router.push("/"); // redirect back home after alert
  }, [router]);

  return null; // no UI needed
}
