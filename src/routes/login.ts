import express from "express";
import { checkAuthenticated } from "../handlers/checkAuthenticated";
import { login, renderLoginPage } from "../handlers/login";

const router = express.Router();

router.get("/", checkAuthenticated, renderLoginPage);
router.post("/", login);

export default router;
