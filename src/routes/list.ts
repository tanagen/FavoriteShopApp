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
} from "../handlers/list";

const router = express.Router();

router.get("/:index", checkAuthenticated, getSelectedCategory, renderListPage);
router.post("/:index", getSelectedCategory, checkPostedNewList, createList);
router.get(
  "/:index/create",
  checkAuthenticated,
  getSelectedCategory,
  renderCreateListPage
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

export default router;
