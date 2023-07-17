"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const list_1 = require("../handlers/list");
router.get("/:index", list_1.getSelectedCategory, list_1.renderListPage);
router.post("/:index", list_1.getSelectedCategory, list_1.checkPostedNewList, list_1.createList);
router.get("/:index/create", list_1.getSelectedCategory, list_1.renderCreateListPage);
router.post("/:index/:id", list_1.deleteList);
router.get("/:index/edit/:id", list_1.getSelectedCategory, list_1.renderEditListPage);
router.post("/:index/update/:id", list_1.getSelectedCategory, list_1.checkPostedUpdateList, list_1.updateList);
exports.default = router;
