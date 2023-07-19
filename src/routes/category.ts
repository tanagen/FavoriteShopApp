import express from "express";
const router = express.Router();

import { authMiddleware } from "../app";

import {
  renderShopCategoryPage,
  renderCreateCategoryPage,
  createShopCategory,
} from "../handlers/category";

router.get("/", authMiddleware, renderShopCategoryPage);
router.post("/", createShopCategory);
router.get("/create/", renderCreateCategoryPage);

export default router;
