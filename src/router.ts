import express from "express";
import memberController from "./controller/member.controller";
const router = express.Router();

/** MEMBER */
router.get("/member/admin", memberController.getAdmin);

router.post("/member/signup", memberController.signup);

router.post("/member/login", memberController.login);

router.post(
  "/member/logout",
  memberController.verifyAuth,
  memberController.logout,
);

export default router;
