import { Response } from "express";
import User from "../models/User";
import Email from "../models/Email";
import AccessLog from "../models/AccessLog";
import type { AuthRequest } from "../middleware/auth";
import type { DashboardStats } from "@shared/schema";

export async function getDashboardStats(
  req: AuthRequest,
  res: Response
) {
  try {
    // Total de usuários
    const totalUsuarios = await User.countDocuments();

    // Novos usuários este mês
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const novosUsuariosMes = await User.countDocuments({
      criadoEm: { $gte: startOfMonth },
    });

    // Sessões ativas (baseado em logs recentes - últimas 24h)
    const last24Hours = new Date();
    last24Hours.setHours(last24Hours.getHours() - 24);

    const sessoesAtivas = await AccessLog.distinct("adminId", {
      timestamp: { $gte: last24Hours },
    }).then((ids) => ids.length);

    // E-mails enviados
    const emailsEnviados = await Email.countDocuments({
      status: "enviado",
    });

    // Crescimento mensal (últimos 6 meses)
    const crescimentoMensal = [];
    const meses = [
      "Jan",
      "Fev",
      "Mar",
      "Abr",
      "Mai",
      "Jun",
      "Jul",
      "Ago",
      "Set",
      "Out",
      "Nov",
      "Dez",
    ];

    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);

      const count = await User.countDocuments({
        criadoEm: { $gte: monthStart, $lte: monthEnd },
      });

      crescimentoMensal.push({
        mes: `${meses[date.getMonth()]}/${date.getFullYear().toString().slice(2)}`,
        usuarios: count,
      });
    }

    // Status dos usuários
    const statusUsuarios = await User.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const stats: DashboardStats = {
      totalUsuarios,
      novosUsuariosMes,
      sessoesAtivas,
      emailsEnviados,
      crescimentoMensal,
      statusUsuarios: statusUsuarios.map((s) => ({
        status: s._id,
        count: s.count,
      })),
    };

    res.json(stats);
  } catch (error) {
    console.error("Erro ao buscar estatísticas:", error);
    res.status(500).json({ message: "Erro ao buscar estatísticas" });
  }
}
