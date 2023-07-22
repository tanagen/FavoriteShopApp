"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const signUp_1 = require("../handlers/signUp");
const router = express_1.default.Router();
router.get("/", signUp_1.renderSignUpPage);
router.post("/", signUp_1.signUp);
exports.default = router;
