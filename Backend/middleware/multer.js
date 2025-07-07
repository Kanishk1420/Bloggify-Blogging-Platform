import multer from "multer";

// Use multer's memoryStorage instead of diskStorage
const upload = multer({ storage: multer.memoryStorage() });
export default upload;
