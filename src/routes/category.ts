import { express, router } from "../app";
import {
  renderShopCategoryPage,
  renderCreateCategoryPage,
  createShopCategory,
} from "../handlers/category";

router.get("/:id", renderShopCategoryPage);
router.post("/:id", createShopCategory);
router.get("/create/:id", renderCreateCategoryPage);

module.exports = router;
