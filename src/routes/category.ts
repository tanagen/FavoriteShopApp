import express from "express";
import { checkAuthenticated } from "../handlers/checkAuthenticated";
import {
  renderCategoryPage,
  renderCreateCategoryPage,
  checkCreatingCategory,
  createCategory,
  renderDeleteCategoryPage,
  deleteCategory,
  getInfoOfCategories,
} from "../handlers/category";

const router = express.Router();

router.get("/", checkAuthenticated, getInfoOfCategories, renderCategoryPage);
router.get("/create", renderCreateCategoryPage);
router.post(
  "/create",
  getInfoOfCategories,
  checkCreatingCategory,
  createCategory
);
router.get("/delete", renderDeleteCategoryPage);
router.post("/delete", deleteCategory);

export default router;
