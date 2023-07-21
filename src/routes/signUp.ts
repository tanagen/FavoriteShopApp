import express from "express";
import { renderSignUpPage } from "../handlers/signUp";
const router = express.Router();

router.get("/", renderSignUpPage);

export default router;
