import mongoose, { Schema, Document } from "mongoose";
import type { Admin as AdminType } from "@shared/schema";

export interface IAdmin extends Omit<AdminType, "_id">, Document {}

const AdminSchema = new Schema<IAdmin>(
  {
    cpf: {
      type: String,
      required: true,
      unique: true,
      match: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
    },
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
    senha: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["admin", "superadmin"],
      default: "admin",
    },
    ativo: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: { createdAt: "criadoEm", updatedAt: false },
  }
);

export default mongoose.model<IAdmin>("Admin", AdminSchema);
