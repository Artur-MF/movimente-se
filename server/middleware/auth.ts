import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

export interface AuthRequest extends Request {
  admin?: {
    id: string;
    cpf: string;
    nome: string;
    email: string;
    role: string;
  };
}

export function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Token não fornecido" });
    }

    const token = authHeader.substring(7);

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      req.admin = decoded;
      next();
    } catch (error) {
      return res.status(401).json({ message: "Token inválido ou expirado" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Erro ao validar autenticação" });
  }
}

export function generateToken(admin: {
  id: string;
  cpf: string;
  nome: string;
  email: string;
  role: string;
}): string {
  return jwt.sign(admin, JWT_SECRET, { expiresIn: "7d" });
}
