import express from "express";
import { login, renderLoginPage } from "../handlers/login";

const router = express.Router();

router.get("/", renderLoginPage);
router.post("/", login);

export default router;
