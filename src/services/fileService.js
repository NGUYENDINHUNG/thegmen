import path from "path";
import s3 from "../config/s3.js";

export const uploadSingleFile = async (fileObject) => {
  let extName = path.extname(fileObject.name);
  let baseName = path.basename(fileObject.name, extName);
  let finalName = `${baseName}-${Date.now()}${extName}`;

  const params = {
    Bucket: process.env.AWS_S3_BUCKET,
    Key: `uploads/${finalName}`,
    Body: fileObject.data,
    ContentType: fileObject.mimetype,
  };

  try {
    const data = await s3.upload(params).promise();
    return {
      status: "success",
      path: data.Location,
      error: null,
    };
  } catch (error) {
    return {
      status: "failled",
      path: null,
      error: JSON.stringify(error),
    };
  }
};
export const uploadMultipleFiles = async (filesArr) => {
  try {
    let resultArr = [];
    for (let i = 0; i < filesArr.length; i++) {
      console.log("check i = ", i);
      //get image extension
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
        const data = await s3.upload(params).promise();
        resultArr.push({
          status: "success",
          path: data.Location,
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
  }
};
