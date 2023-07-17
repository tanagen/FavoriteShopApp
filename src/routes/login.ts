import { router } from "../app";
import { renderLoginPage } from "../handlers/login";

router.get("/", renderLoginPage);
router.post("/");

export default router;
