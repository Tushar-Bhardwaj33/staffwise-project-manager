import multer from "multer";

// Files land in memory as a Buffer (req.file.buffer) — nothing touches local disk,
// which keeps this safe to run on Render's ephemeral filesystem.
const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB — adjust to whatever your project doc types need

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE },
});
