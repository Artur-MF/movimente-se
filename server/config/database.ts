import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/admin-system";

export async function connectDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Conexão com o MongoDB estabelecida com sucesso!");
  } catch (error) {
    console.error("❌ Houve um erro de conexão:", error);
    process.exit(1);
  }
}

export async function disconnectDatabase() {
  try {
    await mongoose.disconnect();
    console.log("✅ Conexão com o MongoDB encerrada com sucesso!");
  } catch (error) {
    console.error("❌ Houve um erro ao encerrar a conexão com o MongoDB:", error);
  }
}
