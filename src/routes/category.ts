import express from "express";
import { router } from "../app";
import {
  renderShopCategoryPage,
  renderCreateCategoryPage,
  createShopCategory,
} from "../handlers/category";

router.get("/", renderShopCategoryPage);
router.post("/", createShopCategory);
router.get("/create/", renderCreateCategoryPage);

export default router;
