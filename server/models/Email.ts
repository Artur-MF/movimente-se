import mongoose, { Schema, Document } from "mongoose";
import type { Email as EmailType } from "@shared/schema";

export interface IEmail extends Omit<EmailType, "_id">, Document {}

const EmailSchema = new Schema<IEmail>(
  {
    destinatarios: {
      type: [String],
      required: true,
    },
    assunto: {
      type: String,
      required: true,
    },
    mensagem: {
      type: String,
      required: true,
    },
    remetente: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["enviado", "falha", "pendente"],
      default: "pendente",
    },
  },
  {
    timestamps: { createdAt: "enviadoEm", updatedAt: false },
  }
);

export default mongoose.model<IEmail>("Email", EmailSchema);
