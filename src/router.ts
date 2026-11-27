import express from "express";
import memberController from "./controller/member.controller";
const router = express.Router();

/** MEMBER */
router.get("/member/admin", memberController.getAdmin);

router.post("/member/signup", memberController.signup);

export default router;
