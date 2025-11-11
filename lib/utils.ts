// utils.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import jwt, { JwtPayload } from "jsonwebtoken";

// Tailwind class merge utility
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Define a type for the authenticated user
export interface AuthUser {
  id: number;
  role: string;
}

// JWT signing utility
export function signToken(payload: object): string {
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '7d' });
}

// JWT token verification
export function verifyToken(token: string): JwtPayload | null {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    return typeof decoded === 'object' ? decoded as JwtPayload : null;
  } catch {
    return null;
  }
}

// Get user info from request cookies (server-side only)
export function getUserFromRequest(req: Request): AuthUser | null {
  try {
    const cookieHeader = req.headers.get("cookie") ?? "";
    const cookies = Object.fromEntries(
      cookieHeader.split("; ").map((c) => c.split("="))
    );
    const token = cookies["token"];
    if (!token) return null;

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    return { id: decoded.id as number, role: decoded.role as string };
  } catch {
    return null;
  }
}
