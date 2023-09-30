import express from "express";
import { checkAuthenticated } from "../handlers/checkAuthenticated";
import {
  renderCategoryPage,
  renderCreateCategoryPage,
  checkCreatingCategory,
  createCategory,
  renderDeleteCategoryPage,
  deleteCategory,
  getAllCategories,
} from "../handlers/category";

const router = express.Router();

router.get("/", checkAuthenticated, getAllCategories, renderCategoryPage);
router.get("/create", renderCreateCategoryPage);
router.post("/create", getAllCategories, checkCreatingCategory, createCategory);
router.get("/delete", renderDeleteCategoryPage);
router.post("/delete", deleteCategory);

export default router;
