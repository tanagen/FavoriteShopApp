import express from "express";
const router = express.Router();

import {
  renderShopCategoryPage,
  renderCreateCategoryPage,
  createShopCategory,
} from "../handlers/category";

router.get("/", renderShopCategoryPage);
router.post("/", createShopCategory);
router.get("/create/", renderCreateCategoryPage);

export default router;
