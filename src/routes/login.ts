import express from "express";
const router = express.Router();

import { login, renderLoginPage } from "../handlers/login";

router.get("/", renderLoginPage);
router.post("/", login);

export default router;
