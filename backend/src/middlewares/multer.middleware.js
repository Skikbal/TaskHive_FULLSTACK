import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join("public", "images"));
  },
  filename: function (req, file, cb) {
    const extension = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, extension);
    const uniqueName = `${baseName}-${Date.now()}${extension}`;
    cb(null, uniqueName);
  },
});

export const upload = multer({
  storage: storage,
  limits: {
    fieldSize: 5 * 1024 * 1024, //5MB
  },
});
