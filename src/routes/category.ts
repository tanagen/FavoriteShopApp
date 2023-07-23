import express from "express";
import { checkAuthenticated } from "../handlers/checkAuthenticated";
import {
  renderShopCategoryPage,
  renderCreateCategoryPage,
  checkPostedNewCategory,
  createShopCategory,
} from "../handlers/category";
const router = express.Router();

router.get("/", checkAuthenticated, renderShopCategoryPage);
router.post("/", checkPostedNewCategory, createShopCategory);
router.get("/create/", renderCreateCategoryPage);

export default router;
