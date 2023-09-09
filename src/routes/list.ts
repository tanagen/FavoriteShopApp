import express from "express";
import { checkAuthenticated } from "../handlers/checkAuthenticated";
import {
  getSelectedCategory,
  renderListPage,
  renderCreateListPage,
  checkPostedNewList,
  createList,
  deleteList,
  renderEditListPage,
  updateList,
  checkPostedUpdateList,
  getSelectedList,
} from "../handlers/list";

import {
  getShopCategories,
  getDBIdOfUpdateCategory,
  renderEditCategoryPage,
  checkUpdatedCategory,
  updateCategory,
} from "../handlers/category";

import { getAPIKey, showMap, saveCoordinate } from "../handlers/map";

const router = express.Router();

router.get("/:index", checkAuthenticated, getSelectedCategory, renderListPage);
router.post("/saveCoordinate", saveCoordinate);
router.get(
  "/:index/create",
  checkAuthenticated,
  getAPIKey,
  getSelectedCategory,
  renderCreateListPage
);
router.post(
  "/:index/create",
  getSelectedCategory,
  getAPIKey,
  checkPostedNewList,
  createList
);
router.get("/:index/edit", getSelectedCategory, renderEditCategoryPage);
router.post(
  "/:index/edit",
  getShopCategories,
  getSelectedCategory,
  getDBIdOfUpdateCategory,
  checkUpdatedCategory,
  updateCategory
);
router.post("/:index/:id", deleteList);
router.get(
  "/:index/edit/:id",
  checkAuthenticated,
  getSelectedCategory,
  renderEditListPage
);
router.post(
  "/:index/update/:id",
  getSelectedCategory,
  checkPostedUpdateList,
  updateList
);

router.get(
  "/:index/map/:id",
  checkAuthenticated,
  getSelectedCategory,
  getAPIKey,
  getSelectedList,
  showMap
);

export default router;
