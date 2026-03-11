const express = require("express");
const multer = require("multer");
const { parseFile } = require("../services/parser");
const { generateSummary } = require("../services/groq");
const { sendEmail } = require("../services/mailer");

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ext = file.originalname.split(".").pop().toLowerCase();
    if (["csv", "xlsx", "xls"].includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error("Only .csv and .xlsx files are allowed."));
    }
  },
});

/**
 * @swagger
 * /api/upload:
 *   post:
 *     summary: Upload sales file and receive AI summary via email
 *     tags: [Upload]
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *               - email
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: CSV or XLSX sales file (max 5MB)
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Recipient email address
 *     responses:
 *       200:
 *         description: Summary generated and sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Summary generated and sent to exec@rabbitt.ai
 *                 summary:
 *                   type: string
 *                   example: Q1 2026 showed strong performance in Electronics...
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized - Invalid API Key
 *       429:
 *         description: Rate limit exceeded
 *       500:
 *         description: Server error
 */
router.post("/upload", upload.single("file"), async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: "A valid recipient email is required." });
    }

    if (!req.file) {
      return res.status(400).json({ error: "A CSV or XLSX file is required." });
    }

    const parsedData = parseFile(req.file);
    const summary = await generateSummary(parsedData);
    await sendEmail(email, summary);

    res.json({
      message: `Summary generated and sent to ${email}`,
      summary,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
