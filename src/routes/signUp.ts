import express from "express";
import { renderSignUpPage, signUp } from "../handlers/signUp";
const router = express.Router();

router.get("/", renderSignUpPage);
router.post("/", signUp);

export default router;
