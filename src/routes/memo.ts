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
  getSelectedMemo,
} from "../handlers/memo";

import {
  getAllCategories,
  getDBIdOfUpdatingCategory,
  renderEditCategoryPage,
  checkUpdatingCategory,
  updateCategory,
} from "../handlers/category";

import { getGoogleMapsApiKey, showMap } from "../handlers/map";
import { getHotPepperApiKey } from "../handlers/hotpepper";

const router = express.Router();

router.get("/:index", checkAuthenticated, getSelectedCategory, renderMemoPage);
// router.post("/saveCoordinate", saveCoordinate);
router.get(
  "/:index/create",
  checkAuthenticated,
  getGoogleMapsApiKey,
  getHotPepperApiKey,
  getSelectedCategory,
  renderCreateMemoPage
);
router.post(
  "/:index/create",
  getSelectedCategory,
  getGoogleMapsApiKey,
  getHotPepperApiKey,
  checkCreatingMemo,
  createMemo
);
router.get("/:index/edit", getSelectedCategory, renderEditCategoryPage);
router.post(
  "/:index/edit",
  getAllCategories,
  getSelectedCategory,
  getDBIdOfUpdatingCategory,
  checkUpdatingCategory,
  updateCategory
);
router.post("/:index/:id", deleteMemo);
router.get(
  "/:index/edit/:id",
  checkAuthenticated,
  getGoogleMapsApiKey,
  getHotPepperApiKey,
  getSelectedCategory,
  renderEditMemoPage
);
router.post(
  "/:index/update/:id",
  getSelectedCategory,
  getGoogleMapsApiKey,
  getHotPepperApiKey,
  checkUpdatingMemo,
  updateMemo
);

router.get(
  "/:index/map/:id",
  checkAuthenticated,
  getSelectedCategory,
  getGoogleMapsApiKey,
  getHotPepperApiKey,
  getSelectedMemo,
  showMap
);

export default router;
