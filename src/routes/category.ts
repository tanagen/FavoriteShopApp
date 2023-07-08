import { express, router } from "../app";
import { renderCategoryPage } from "../handlers/category";

router.get("/", renderCategoryPage);
router.post("/");

module.exports = router;
