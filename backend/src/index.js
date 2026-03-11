require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const uploadRouter = require("./routes/upload");

const app = express();
const PORT = process.env.PORT || 5000;

// ── Security ────────────────────────────────────────────────────
app.use(helmet());

app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        process.env.FRONTEND_URL || "http://localhost:3000",
        "https://sales-insight-automator-sooty.vercel.app",
      ];
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "x-api-key"],
  })
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: "Too many requests, please try again later." },
});
app.use("/api/", limiter);

app.use(express.json({ limit: "1mb" }));

// ── API Key Middleware ───────────────────────────────────────────
const apiKeyAuth = (req, res, next) => {
  const apiKey = req.headers["x-api-key"];
  if (!apiKey || apiKey !== process.env.API_SECRET_KEY) {
    return res.status(401).json({ error: "Unauthorized - Invalid API Key" });
  }
  next();
};

// ── Swagger ─────────────────────────────────────────────────────
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Rabbitt AI — Sales Insight Automator API",
      version: "1.0.0",
      description:
        "Upload sales CSV/Excel files and receive AI-generated summaries via email.",
    },
    servers: [
      {
        url: process.env.BACKEND_URL || `http://localhost:${PORT}`,
        description: "API Server",
      },
    ],
    components: {
      securitySchemes: {
        ApiKeyAuth: {
          type: "apiKey",
          in: "header",
          name: "x-api-key",
        },
      },
    },
    security: [{ ApiKeyAuth: [] }],
  },
  apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ── Routes ───────────────────────────────────────────────────────
app.get("/health", (req, res) => res.json({ status: "ok", service: "Rabbitt AI Backend" }));
app.use("/api", apiKeyAuth, uploadRouter);

// ── Error Handler ────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || "Internal Server Error" });
});

app.listen(PORT, () => {
  console.log(`🐇 Rabbitt AI Backend running on port ${PORT}`);
  console.log(`📄 Swagger docs at http://localhost:${PORT}/docs`);
});
