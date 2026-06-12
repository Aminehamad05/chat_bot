import express from "express";
import cors from "cors";
import helmet from "helmet";

import { env } from "./config/env";
import { errorHandler } from "./middleware/errorHandler";
import { apiLimiter } from "./middleware/rateLimiter";
import { requestLogger } from "./middleware/requestLogger";
import authRoutes from './routes/auth.routes';
const app = express();

/* ─────────────────────────────────────────────
   1. Security middleware (always first)
───────────────────────────────────────────── */
app.use(helmet());

app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  })
);

/* ─────────────────────────────────────────────
   2. Body parsing middleware
───────────────────────────────────────────── */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ─────────────────────────────────────────────
   3. Logging (after parsing so body is available)
───────────────────────────────────────────── */
if (env.NODE_ENV === "development") {
  app.use(requestLogger);
}

/* ─────────────────────────────────────────────
   4. Rate limiting (apply to APIs only)
───────────────────────────────────────────── */
app.use("/api", apiLimiter);

/* ─────────────────────────────────────────────
   5. Routes
───────────────────────────────────────────── */
app.use('/api/auth', authRoutes);
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});   


/* ─────────────────────────────────────────────
   6. Error handler (MUST be last)
───────────────────────────────────────────── */
app.use(errorHandler);

/* ─────────────────────────────────────────────
   7. Start server
───────────────────────────────────────────── */
app.listen(env.PORT, () => {
  console.log(`\x1b[36m✓ Server running on http://localhost:${env.PORT}\x1b[0m`);
  console.log(`\x1b[90m  Environment: ${env.NODE_ENV}\x1b[0m`);
});

export default app;