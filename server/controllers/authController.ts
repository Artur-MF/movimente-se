import { Request, Response } from "express";
import bcrypt from "bcrypt";
import Admin from "../models/Admin";
import { generateToken } from "../middleware/auth";
import { removeCPFMask } from "../../client/src/lib/cpf-utils";
import { logAction } from "../middleware/logger";
import type { AuthRequest } from "../middleware/auth";

export async function login(req: Request, res: Response) {
  try {
    const { cpf, senha } = req.body;

    if (!cpf || !senha) {
      return res.status(400).json({ message: "CPF e senha são obrigatórios" });
    }

    // Buscar admin pelo CPF (com ou sem máscara)
    const admin = await Admin.findOne({
      $or: [{ cpf: cpf }, { cpf: removeCPFMask(cpf) }],
    });

    if (!admin) {
      return res.status(401).json({ message: "CPF ou senha inválidos" });
    }

    if (!admin.ativo) {
      return res.status(403).json({ message: "Administrador desativado" });
    }

    const senhaValida = await bcrypt.compare(senha, admin.senha);

    if (!senhaValida) {
      return res.status(401).json({ message: "CPF ou senha inválidos" });
    }

    const token = generateToken({
      id: admin._id.toString(),
      cpf: admin.cpf,
      nome: admin.nome,
      email: admin.email,
      role: admin.role,
    });

    // Log de acesso
    await logAction(
      { ...req, admin: { id: admin._id.toString(), cpf: admin.cpf, nome: admin.nome, email: admin.email, role: admin.role } } as AuthRequest,
      "LOGIN",
      "Login realizado com sucesso"
    );

    res.json({
      token,
      admin: {
        id: admin._id,
        cpf: admin.cpf,
        nome: admin.nome,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error: any) {
    console.error("Erro no login:", error);
    res.status(500).json({ message: "Erro ao processar login" });
  }
}

export async function createAdmin(req: Request, res: Response) {
  try {
    const { cpf, nome, email, senha, role } = req.body;

    // Verificar se já existe admin com esse CPF ou email
    const existingAdmin = await Admin.findOne({
      $or: [{ cpf }, { email }],
    });

    if (existingAdmin) {
      return res
        .status(400)
        .json({ message: "CPF ou e-mail já cadastrado" });
    }

    // Hash da senha
    const senhaHash = await bcrypt.hash(senha, 10);

    const admin = await Admin.create({
      cpf,
      nome,
      email,
      senha: senhaHash,
      role: role || "admin",
      ativo: true,
    });

    res.status(201).json({
      id: admin._id,
      cpf: admin.cpf,
      nome: admin.nome,
      email: admin.email,
      role: admin.role,
    });
  } catch (error: any) {
    console.error("Erro ao criar admin:", error);
    res.status(500).json({ message: "Erro ao criar administrador" });
  }
}
