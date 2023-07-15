import { express, router } from "../app";
import {
  getSelectedCategory,
  renderListPage,
  renderCreateListPage,
} from "../handlers/list";

router.get("/:index", getSelectedCategory, renderListPage);
router.post("/:index");
router.get("/:index/create", getSelectedCategory, renderCreateListPage);

module.exports = router;
