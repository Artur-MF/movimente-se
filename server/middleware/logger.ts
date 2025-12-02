import AccessLog from "../models/AccessLog";
import type { AuthRequest } from "./auth";

export async function logAction(
  req: AuthRequest,
  acao: string,
  detalhes?: string
) {
  try {
    if (req.admin) {
      await AccessLog.create({
        adminId: req.admin.id,
        adminNome: req.admin.nome,
        acao,
        detalhes,
        ip: req.ip || req.connection.remoteAddress,
        userAgent: req.headers["user-agent"],
      });
    }
  } catch (error) {
    console.error("Erro ao registrar log:", error);
  }
}
