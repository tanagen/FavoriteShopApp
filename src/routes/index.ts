import { router } from "../app";

/* GET home page. */
router.get("/", function (req: any, res: any, next: any) {
  res.render("index", { title: "Express" });
});

export default router;
