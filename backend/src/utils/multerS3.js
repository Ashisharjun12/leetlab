
import multerS3 from "multer-s3"
import { s3Client } from "../services/awsS3.js"
import { _config } from "../config/config.js";
import logger from "./logger.js";

export const multerS3 = multerS3({
    s3:s3Client,
    bucket: _config.AWS_S3_BUCKET,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: (req, file, cb) => {
        cb(null, { fieldName: file.fieldname, mimetype: file.mimetype });
    },
    key: (req, file, cb) => {
        cb(null, file.originalname);

         // Generate unique filename with original extension
    const originalExt = path.extname(file.originalname);
    const ext = originalExt 
    
    const filename = `${folder}${crypto.randomUUID()}${ext}`;
    
    logger.info(`Uploading file to S3: ${filename} (${file.mimetype})`);
    cb(null, filename);
    },
});

