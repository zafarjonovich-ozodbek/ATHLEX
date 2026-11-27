import express from "express";
import memberController from "./controller/member.controller";
const router = express.Router();

/** MEMBER */
router.get("/member/admin", memberController.getAdmin);
export default router;
