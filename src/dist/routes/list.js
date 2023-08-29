"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const checkAuthenticated_1 = require("../handlers/checkAuthenticated");
const list_1 = require("../handlers/list");
const category_1 = require("../handlers/category");
const router = express_1.default.Router();
router.get("/:index", checkAuthenticated_1.checkAuthenticated, list_1.getSelectedCategory, list_1.renderListPage);
router.post("/:index", list_1.getSelectedCategory, list_1.checkPostedNewList, list_1.createList);
router.get("/:index/create", checkAuthenticated_1.checkAuthenticated, list_1.getSelectedCategory, list_1.renderCreateListPage);
router.get("/:index/edit", list_1.getSelectedCategory, category_1.renderEditCategoryPage);
router.post("/:index/update", list_1.getSelectedCategory, category_1.getDBIdOfUpdateCategory, category_1.updateCategory);
router.post("/:index/:id", list_1.deleteList);
router.get("/:index/edit/:id", checkAuthenticated_1.checkAuthenticated, list_1.getSelectedCategory, list_1.renderEditListPage);
router.post("/:index/update/:id", list_1.getSelectedCategory, list_1.checkPostedUpdateList, list_1.updateList);
exports.default = router;
