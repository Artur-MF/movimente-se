import mongoose, { Schema, Document } from "mongoose";
import type { AccessLog as AccessLogType } from "@shared/schema";

export interface IAccessLog extends Omit<AccessLogType, "_id">, Document {}

const AccessLogSchema = new Schema<IAccessLog>(
  {
    adminId: {
      type: String,
      required: true,
    },
    adminNome: {
      type: String,
      required: true,
    },
    acao: {
      type: String,
      required: true,
    },
    detalhes: {
      type: String,
    },
    ip: {
      type: String,
    },
    userAgent: {
      type: String,
    },
  },
  {
    timestamps: { createdAt: "timestamp", updatedAt: false },
  }
);

export default mongoose.model<IAccessLog>("AccessLog", AccessLogSchema);
