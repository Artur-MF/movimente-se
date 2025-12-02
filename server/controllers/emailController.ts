import { Response } from "express";
import nodemailer from "nodemailer";
import Email from "../models/Email";
import { logAction } from "../middleware/logger";
import type { AuthRequest } from "../middleware/auth";

// Configurar transporter do Nodemailer
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function getEmails(req: AuthRequest, res: Response) {
  try {
    const emails = await Email.find().sort({ enviadoEm: -1 }).limit(50);
    res.json(emails);
  } catch (error) {
    console.error("Erro ao buscar e-mails:", error);
    res.status(500).json({ message: "Erro ao buscar e-mails" });
  }
}

export async function sendEmail(req: AuthRequest, res: Response) {
  try {
    const { destinatarios, assunto, mensagem, remetente } = req.body;

    if (!destinatarios || destinatarios.length === 0) {
      return res
        .status(400)
        .json({ message: "Pelo menos um destinatário é obrigatório" });
    }

    // Criar registro do email
    const email = await Email.create({
      destinatarios,
      assunto,
      mensagem,
      remetente,
      status: "pendente",
    });

    try {
      // Tentar enviar o email
      if (process.env.SMTP_USER && process.env.SMTP_PASS) {
        await transporter.sendMail({
          from: `"Admin System" <${remetente}>`,
          to: destinatarios.join(", "),
          subject: assunto,
          text: mensagem,
          html: `<div style="font-family: Arial, sans-serif;">${mensagem.replace(
            /\n/g,
            "<br>"
          )}</div>`,
        });

        email.status = "enviado";
        await email.save();

        await logAction(
          req,
          "ENVIAR_EMAIL",
          `E-mail enviado para ${destinatarios.length} destinatário(s)`
        );

        res.json({ ...email.toObject(), message: "E-mail enviado com sucesso" });
      } else {
        // Simulação de envio se não houver configuração SMTP
        console.log("📧 E-mail simulado (SMTP não configurado):");
        console.log(`Para: ${destinatarios.join(", ")}`);
        console.log(`Assunto: ${assunto}`);
        console.log(`Mensagem: ${mensagem}`);

        email.status = "enviado";
        await email.save();

        await logAction(
          req,
          "ENVIAR_EMAIL_SIMULADO",
          `E-mail simulado para ${destinatarios.length} destinatário(s)`
        );

        res.json({
          ...email.toObject(),
          message:
            "E-mail registrado (modo simulação - configure SMTP para envio real)",
        });
      }
    } catch (emailError: any) {
      console.error("Erro ao enviar e-mail:", emailError);
      email.status = "falha";
      await email.save();

      return res.status(500).json({
        message: "Erro ao enviar e-mail",
        error: emailError.message,
      });
    }
  } catch (error: any) {
    console.error("Erro ao processar e-mail:", error);
    res.status(500).json({ message: "Erro ao processar e-mail" });
  }
}
