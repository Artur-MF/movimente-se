import mongoose from "mongoose";
import bcrypt from "bcrypt";
import Admin from "../models/Admin";
import { connectDatabase, disconnectDatabase } from "../config/database";

async function createInitialAdmin() {
  try {
    await connectDatabase();

    // Verificar se já existe algum admin
    const existingAdmins = await Admin.countDocuments();

    if (existingAdmins > 0) {
      console.log("⚠️  Já existem administradores cadastrados.");
      console.log(`Total: ${existingAdmins} administrador(es)`);
      await disconnectDatabase();
      return;
    }

    // Dados do admin inicial
    const adminData = {
      cpf: "123.456.789-00",
      nome: "Administrador Principal",
      email: "admin@sistema.com",
      senha: "admin123",
      role: "superadmin" as const,
      ativo: true,
    };

    // Hash da senha
    const senhaHash = await bcrypt.hash(adminData.senha, 10);

    // Criar admin
    const admin = await Admin.create({
      ...adminData,
      senha: senhaHash,
    });

    console.log("✅ Administrador inicial criado com sucesso!");
    console.log("\n📋 Dados de acesso:");
    console.log(`CPF: ${adminData.cpf}`);
    console.log(`Senha: ${adminData.senha}`);
    console.log(`Email: ${adminData.email}`);
    console.log(`Role: ${adminData.role}`);
    console.log("\n⚠️  IMPORTANTE: Altere a senha após o primeiro login!");

    await disconnectDatabase();
  } catch (error) {
    console.error("❌ Erro ao criar administrador:", error);
    await disconnectDatabase();
    process.exit(1);
  }
}

createInitialAdmin();
