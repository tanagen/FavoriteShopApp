import { express, router } from "../app";
import { renderTopPage } from "../handlers/top";

router.get("/", renderTopPage);
router.post("/");

module.exports = router;
