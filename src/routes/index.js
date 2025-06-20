import express from "express";
import router from "#routes/v1/index.js";

const Apirouter = express.Router();

Apirouter.use("/v1/api", router);

export default Apirouter;
