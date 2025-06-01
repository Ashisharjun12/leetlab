import ImageKit from "imagekit";
import logger from "../utils/logger.js";
import { _config } from "../config/config.js";

export const imagekit = new ImageKit({
  publicKey:_config.IMAGEKIT_PUBLIC_KEY,
  privateKey:_config.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint:_config.IMAGEKIT_ENDPOINT,
});

export const uploadFile = async (req, res) => {
  try {
    logger.info("hitting upload file route...");

    // For GET request, return authentication parameters
    if (req.method === 'GET') {
      const filename = req.query.fileName;
      const result = await imagekit.getAuthenticationParameters();
      console.log("url of image", result);
      const urlEndpoint =_config.IMAGEKIT_ENDPOINT;
      const previewUrl = `${urlEndpoint}/${filename}`;

      return res.json({
        ...result,
        filename,
        uploadEndpoint: "https://upload.imagekit.io/api/v2/files/upload",
        previewUrl
      });
    }

    // For POST request, handle file upload
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded"
      });
    }

    const filename = `company_logo_${Date.now()}_${req.file.originalname}`;

    // Upload file to ImageKit
    const result = await imagekit.upload({
      file: req.file.buffer,
      fileName: filename,
      folder: "/company_logos"
    });

    console.log("Upload result:", result);

    res.json({
      success: true,
      url: result.url,
      fileId: result.fileId
    });
  } catch (error) {
    logger.error("error in uploading file", error);
    res.status(500).json({
      success: false,
      message: "Error uploading file",
      error: error.message
    });
  }
};
