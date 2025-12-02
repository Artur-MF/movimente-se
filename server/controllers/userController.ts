import { Response } from "express";
import User from "../models/User";
import { logAction } from "../middleware/logger";
import type { AuthRequest } from "../middleware/auth";

export async function getUsers(req: AuthRequest, res: Response) {
  try {
    const users = await User.find().sort({ criadoEm: -1 });
    res.json(users);
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    res.status(500).json({ message: "Erro ao buscar usuários" });
  }
}

export async function createUser(req: AuthRequest, res: Response) {
  try {
    const { nome, email, cpf, telefone, status } = req.body;

    // Verificar se já existe usuário com esse email
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "E-mail já cadastrado" });
    }

    const user = await User.create({
      nome,
      email,
      cpf,
      telefone,
      status: status || "ativo",
    });

    await logAction(req, "CRIAR_USUARIO", `Usuário criado: ${nome}`);

    res.status(201).json(user);
  } catch (error: any) {
    console.error("Erro ao criar usuário:", error);
    res.status(500).json({ message: "Erro ao criar usuário" });
  }
}

export async function updateUser(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const updates = req.body;

    const user = await User.findByIdAndUpdate(
      id,
      { ...updates, atualizadoEm: new Date() },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    await logAction(req, "ATUALIZAR_USUARIO", `Usuário atualizado: ${user.nome}`);

    res.json(user);
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    res.status(500).json({ message: "Erro ao atualizar usuário" });
  }
}

export async function deleteUser(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    await logAction(req, "EXCLUIR_USUARIO", `Usuário excluído: ${user.nome}`);

    res.json({ message: "Usuário excluído com sucesso" });
  } catch (error) {
    console.error("Erro ao excluir usuário:", error);
    res.status(500).json({ message: "Erro ao excluir usuário" });
  }
}
