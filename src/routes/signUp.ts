import express from "express";
import {
  renderSignUpPage,
  checkPostedNewUser,
  signUp,
} from "../handlers/signUp";
const router = express.Router();

router.get("/", renderSignUpPage);
router.post("/", checkPostedNewUser, signUp);

export default router;
