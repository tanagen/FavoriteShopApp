"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const hotpepper_1 = require("../handlers/hotpepper");
const router = express_1.default.Router();
router.post("/", hotpepper_1.searchFromHotPepper);
exports.default = router;
