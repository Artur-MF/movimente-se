import type { Express } from "express";
import { createServer, type Server } from "http";
import { body, validationResult } from "express-validator";
import { authMiddleware } from "./middleware/auth";
import * as authController from "./controllers/authController";
import * as userController from "./controllers/userController";
import * as emailController from "./controllers/emailController";
import * as statsController from "./controllers/statsController";
import type { Request, Response, NextFunction } from "express";

// Middleware para validar erros
const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

export async function registerRoutes(app: Express): Promise<Server> {
  // ========== AUTH ROUTES ==========
  app.post(
    "/api/auth/login",
    [
      body("cpf").notEmpty().withMessage("CPF é obrigatório"),
      body("senha").notEmpty().withMessage("Senha é obrigatória"),
    ],
    validate,
    authController.login
  );

  app.post(
    "/api/auth/register-admin",
    [
      body("cpf").matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/).withMessage("CPF inválido"),
      body("nome").isLength({ min: 3 }).withMessage("Nome deve ter pelo menos 3 caracteres"),
      body("email").isEmail().withMessage("Email inválido"),
      body("senha").isLength({ min: 6 }).withMessage("Senha deve ter pelo menos 6 caracteres"),
    ],
    validate,
    authController.createAdmin
  );

  // ========== USER ROUTES (Protected) ==========
  app.get("/api/users", authMiddleware, userController.getUsers);

  app.post(
    "/api/users",
    authMiddleware,
    [
      body("nome").isLength({ min: 3 }).withMessage("Nome deve ter pelo menos 3 caracteres"),
      body("email").isEmail().withMessage("Email inválido"),
    ],
    validate,
    userController.createUser
  );

  app.patch("/api/users/:id", authMiddleware, userController.updateUser);

  app.delete("/api/users/:id", authMiddleware, userController.deleteUser);

  // ========== EMAIL ROUTES (Protected) ==========
  app.get("/api/emails", authMiddleware, emailController.getEmails);

  app.post(
    "/api/emails/send",
    authMiddleware,
    [
      body("destinatarios").isArray({ min: 1 }).withMessage("Pelo menos um destinatário é obrigatório"),
      body("assunto").notEmpty().withMessage("Assunto é obrigatório"),
      body("mensagem").notEmpty().withMessage("Mensagem é obrigatória"),
    ],
    validate,
    emailController.sendEmail
  );

  // ========== STATS ROUTES (Protected) ==========
  app.get("/api/stats/dashboard", authMiddleware, statsController.getDashboardStats);

  const httpServer = createServer(app);

  return httpServer;
}
