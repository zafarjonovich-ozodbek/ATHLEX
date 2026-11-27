import type { Request, Response } from "express";
import Errors, { HttpCode } from "../libs/Errors";
import { T } from "../libs/types/common";
import MemberService from "../models/Member.Service";

const memberService = new MemberService();

/** REACT */
const memberController: T = {};
memberController.getAdmin = async (req: Request, res: Response) => {
  try {
    console.log("getAdmin");
    const result = await memberService.getAdmin();

    res.status(HttpCode.OK).json(result);
  } catch (err) {
    console.log("Error, getAdmin:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standart.code).json(Errors.standart);
  }
};

export default memberController;
