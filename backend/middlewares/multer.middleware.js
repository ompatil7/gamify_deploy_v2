import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Resolve __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure the directory exists
const tempDir = path.join(__dirname, "../public/temp");
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, tempDir);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

export { upload };

// import multer from "multer";

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "./public/temp");
//   },
//   filename: function (req, file, cb) {
//     // const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     // cb(null, file.fieldname + "-" + uniqueSuffix);
//     cb(null, file.originalname);
//   },
// });

// export const upload = multer({
//   storage,
// });
