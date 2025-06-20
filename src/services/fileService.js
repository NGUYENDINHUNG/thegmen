import path from "path";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import s3Client from "#config/s3.js";

export const uploadSingleFile = async (file) => {
  if (!file) {
    throw new Error("No file uploaded");
  }
  let extName = path.extname(file.name);
  let baseName = path.basename(file.name, extName);
  let finalName = `${baseName}-${Date.now()}${extName}`;

  const params = {
    Bucket: process.env.AWS_S3_BUCKET,
    Key: `uploads/${finalName}`,
    Body: file.data,
    ContentType: file.mimetype,
    ACL: "public-read",
  };
  try {
    const command = new PutObjectCommand(params);
    await s3Client.send(command);
    const fileUrl = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/uploads/${finalName}`;

    return {
      status: "success",
      path: fileUrl,
      error: null,
    };
  } catch (error) {
    return {
      status: "failed",
      path: null,
      error: JSON.stringify(error),
    };
  }
};

export const uploadMultipleFiles = async (filesArr) => {
  try {
    let resultArr = [];
    for (let i = 0; i < filesArr.length; i++) {
      let extName = path.extname(filesArr[i].name);
      let baseName = path.basename(filesArr[i].name, extName);
      let finalName = `${baseName}-${Date.now()}${extName}`;

      const params = {
        Bucket: process.env.AWS_S3_BUCKET,
        Key: `uploads/${finalName}`,
        Body: filesArr[i].data,
        ContentType: filesArr[i].mimetype,
      };

      try {
        const command = new PutObjectCommand(params);
        await s3Client.send(command);

        const fileUrl = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/uploads/${finalName}`;

        resultArr.push({
          status: "success",
          path: fileUrl,
          fileName: filesArr[i].name,
          error: null,
        });
      } catch (err) {
        resultArr.push({
          status: "failed",
          path: null,
          fileName: filesArr[i].name,
          error: JSON.stringify(err),
        });
      }
    }
    return {
      detail: resultArr,
    };
  } catch (error) {
    console.log(error);
    return {
      detail: [],
      error: JSON.stringify(error),
    };
  }
};
