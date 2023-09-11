import express from "express";
import { checkAuthenticated } from "../handlers/checkAuthenticated";
import {
  getSelectedCategory,
  renderMemoPage,
  renderCreateMemoPage,
  checkCreatingMemo,
  createMemo,
  deleteMemo,
  renderEditMemoPage,
  updateMemo,
  checkUpdatingMemo,
  getInfoOfSelectedMemo,
} from "../handlers/memo";

import {
  getInfoOfCategories,
  getDBIdOfUpdateCategory,
  renderEditCategoryPage,
  checkUpdatingCategory,
  updateCategory,
} from "../handlers/category";

import { getAPIKey, showMap } from "../handlers/map";

const router = express.Router();

router.get("/:index", checkAuthenticated, getSelectedCategory, renderMemoPage);
// router.post("/saveCoordinate", saveCoordinate);
router.get(
  "/:index/create",
  checkAuthenticated,
  getAPIKey,
  getSelectedCategory,
  renderCreateMemoPage
);
router.post(
  "/:index/create",
  getSelectedCategory,
  getAPIKey,
  checkCreatingMemo,
  createMemo
);
router.get("/:index/edit", getSelectedCategory, renderEditCategoryPage);
router.post(
  "/:index/edit",
  getInfoOfCategories,
  getSelectedCategory,
  getDBIdOfUpdateCategory,
  checkUpdatingCategory,
  updateCategory
);
router.post("/:index/:id", deleteMemo);
router.get(
  "/:index/edit/:id",
  checkAuthenticated,
  getAPIKey,
  getSelectedCategory,
  renderEditMemoPage
);
router.post(
  "/:index/update/:id",
  getSelectedCategory,
  getAPIKey,
  checkUpdatingMemo,
  updateMemo
);

router.get(
  "/:index/map/:id",
  checkAuthenticated,
  getSelectedCategory,
  getAPIKey,
  getInfoOfSelectedMemo,
  showMap
);

export default router;
