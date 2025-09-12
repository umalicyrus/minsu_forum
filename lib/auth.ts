import jwt, { JwtPayload } from 'jsonwebtoken';


export function signToken(payload: object): string {
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '7d' });
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    return typeof decoded === 'object' ? decoded as JwtPayload : null;
  } catch (err) {
    return null;
  }
}

export function getUserFromRequest(req: Request) {
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
