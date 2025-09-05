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
