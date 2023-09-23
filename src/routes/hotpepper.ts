import express from "express";
import { searchFromHotPepper } from "../handlers/hotpepper";
const router = express.Router();

router.post("/", searchFromHotPepper);

export default router;
