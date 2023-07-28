import express from "express";
import { checkAuthenticated } from "../handlers/checkAuthenticated";
import {
  renderShopCategoryPage,
  renderCreateCategoryPage,
  checkPostedNewCategory,
  createShopCategory,
  renderDeleteCategoryPage,
  deleteCategory,
  getShopCategories,
} from "../handlers/category";
const router = express.Router();

router.get("/", checkAuthenticated, getShopCategories, renderShopCategoryPage);
router.post("/", getShopCategories, checkPostedNewCategory, createShopCategory);
router.get("/create", renderCreateCategoryPage);
router.get("/delete", renderDeleteCategoryPage);
router.post("/delete", deleteCategory);

export default router;
