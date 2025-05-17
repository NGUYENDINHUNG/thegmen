import {
  uploadSingleFile,
  uploadMultipleFiles,
} from "../../../services/fileService.js";

export const postUploadSingleFileApi = async (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No files were uploaded.");
  }
  let results = await uploadSingleFile(req.files.image);
  return res.status(200).json({
    EC: 0,
    data: results,
  });
};

export const postUploadMultipleFilesAPI = async (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No files were uploaded.");
  }
  console.log("req.files", req.files);
  if (Array.isArray(req.files.image)) {
    //upload multiple
    let result = await uploadMultipleFiles(req.files.image);
    return res.status(200).json({
      EC: 0,
      data: result,
    });
  } else {
    //upload single
    return await postUploadSingleFileApi(req, res);
  }
};
