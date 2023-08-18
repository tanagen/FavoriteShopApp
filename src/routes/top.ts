import express from "express";
import { renderTopPage } from "../handlers/top";
const router = express.Router();

router.get("/", renderTopPage);

export default router;
