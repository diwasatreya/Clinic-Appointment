import multer from 'multer';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = path.join(__dirname, '..', 'public', 'uploads', 'clinic-verification');

// Ensure upload directory exists
try {
    fs.mkdirSync(uploadDir, { recursive: true });
} catch (err) {
    console.error('Could not create upload dir:', err);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        const clinicId = req.user?.id?.toString() || 'unknown';
        const safeName = (file.originalname || 'file').replace(/[^a-zA-Z0-9.-]/g, '_');
        const name = `${clinicId}-${Date.now()}-${safeName}`;
        cb(null, name);
    }
});

const uploadClinicVerification = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
    fileFilter: (req, file, cb) => {
        const allowed = /\.(jpg|jpeg|png|gif|webp|pdf)$/i.test(file.originalname || '');
        if (allowed) cb(null, true);
        else cb(new Error('Only images (jpg, png, gif, webp) and PDF are allowed.'));
    }
}).single('verificationDocument');

export { uploadClinicVerification };
