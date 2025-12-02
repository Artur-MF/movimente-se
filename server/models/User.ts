import mongoose, { Schema, Document } from "mongoose";
import type { User as UserType } from "@shared/schema";

export interface IUser extends Omit<UserType, "_id">, Document {}

const UserSchema = new Schema<IUser>(
  {
    nome: {
      type: String,
      required: true,
      minlength: 3,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    cpf: {
      type: String,
      match: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
      sparse: true,
    },
    telefone: {
      type: String,
    },
    status: {
      type: String,
      enum: ["ativo", "inativo", "pendente"],
      default: "ativo",
    },
  },
  {
    timestamps: { createdAt: "criadoEm", updatedAt: "atualizadoEm" },
  }
);

export default mongoose.model<IUser>("User", UserSchema);
