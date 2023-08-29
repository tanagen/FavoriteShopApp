import express from "express";
import { checkAuthenticated } from "../handlers/checkAuthenticated";
import {
  renderShopCategoryPage,
  renderCreateCategoryPage,
  checkPostedCategory,
  createShopCategory,
  renderDeleteCategoryPage,
  deleteCategory,
  getShopCategories,
} from "../handlers/category";

const router = express.Router();

router.get("/", checkAuthenticated, getShopCategories, renderShopCategoryPage);
router.post("/", getShopCategories, checkPostedCategory, createShopCategory);
router.get("/create", renderCreateCategoryPage);
router.get("/delete", renderDeleteCategoryPage);
router.post("/delete", deleteCategory);

export default router;
