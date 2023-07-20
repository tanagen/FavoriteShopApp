import express from "express";
import { checkAuthenticated } from "../handlers/checkAuthenticated";
import {
  renderShopCategoryPage,
  renderCreateCategoryPage,
  createShopCategory,
} from "../handlers/category";
const router = express.Router();

router.get("/", checkAuthenticated, renderShopCategoryPage);
router.post("/", createShopCategory);
router.get("/create/", renderCreateCategoryPage);

export default router;
