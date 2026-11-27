import type { Request, Response } from "express";
import Errors, { HttpCode } from "../libs/Errors";
import { T } from "../libs/types/common";
import MemberService from "../models/Member.Service";
import { MemberInput } from "../libs/types/member";
import { AUTH_TIMER } from "../libs/config";
import AuthService from "../models/Auth.Service";

const memberService = new MemberService();
const authService = new AuthService();

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

memberController.signup = async (req: Request, res: Response) => {
  try {
    const input: MemberInput = req.body,
      result = await memberService.signup(input);
    const token = await authService.createToken(result);

    res.cookie("accessToken", token, {
      maxAge: AUTH_TIMER * 3600 * 1000, //24h
      httpOnly: false,
    });
    res.status(HttpCode.CREATED).json({ member: result, accessToken: token });
  } catch (err) {
    console.log("Error, signup:", err);

    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standart.code).json(Errors.standart);
  }
};

export default memberController;
