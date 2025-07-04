import express from "express";
import {
  postUploadSingleFileApi,
  postUploadMultipleFilesAPI,
} from "../../../controllers/fileController.js";
const FileRouter = express.Router();

FileRouter.post("/upload-single", postUploadSingleFileApi);
FileRouter.post("/upload-multiple", postUploadMultipleFilesAPI);

export default FileRouter;
