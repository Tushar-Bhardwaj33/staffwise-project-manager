import multer from "multer";

// Files land in memory as a Buffer (req.file.buffer) — nothing touches local disk,
// which keeps this safe to run on Render's ephemeral filesystem.
const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB — adjust to whatever your project doc types need

const ALLOWED_MIME = new Set(['application/pdf', 'image/png', 'image/jpeg']);

export const upload = multer({
 storage: multer.memoryStorage(),
 fileFilter: (_req, file, cb) => {
 if (ALLOWED_MIME.has(file.mimetype)) return cb(null, true);
 cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', file.fieldname));
 },
 limits: { fileSize: MAX_FILE_SIZE, files: 5, fields: 20, parts: 50 },
});
