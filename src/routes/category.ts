import { express, router } from "../app";
import {
  renderCategoryPage,
  renderCreateCategoryPage,
  createCategory,
} from "../handlers/category";

router.get("/:id", renderCategoryPage);
router.post("/:id", createCategory);
router.get("/create/:id", renderCreateCategoryPage);

module.exports = router;
