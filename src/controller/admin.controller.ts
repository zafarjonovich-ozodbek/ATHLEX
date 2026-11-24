import { NextFunction, Request, Response } from "express";
import { T } from "../libs/types/common";
import { AdminRequest, LoginInput, MemberInput } from "../libs/types/member";
import Errors, { HttpCode, Message } from "../libs/Errors";
import { MemberType } from "../libs/enums/member.enum";
import MemberService from "../models/Member.Service";

const memberService = new MemberService();

const adminController: T = {};
adminController.goHome = (req: Request, res: Response) => {
  try {
    console.log("goHome");
    res.render("home");
  } catch (err) {
    console.log("Error, goHome:", err);
    res.redirect("/admin");
  }
};

adminController.getSignup = (req: Request, res: Response) => {
  try {
    console.log("getSignup");
    res.render("signup");
  } catch (err) {
    console.log("Error, getSignup:", err);
    res.redirect("/admin");
  }
};

adminController.getLogin = (req: Request, res: Response) => {
  try {
    console.log("getLogin");
    res.render("login");
  } catch (err) {
    console.log("Error, getLogin:", err);
    res.redirect("/admin");
  }
};

adminController.processSignup = async (req: AdminRequest, res: Response) => {
  try {
    console.log("processSignup");
    console.log("req.body:", req.body);
    const file = req.file;
    if (!file)
      throw new Errors(HttpCode.BAD_REQUEST, Message.SOMETHING_WENT_WRONG);

    const newMember: MemberInput = req.body; // 'frontend'dan kirib kelayotkan malumotni "newMember"ga tenglab, uning 'memberType'sini kiritdik
    newMember.memberImage = file?.path;
    newMember.memberType = MemberType.ADMIN; // bu 'singup' "RESTAURANT"ga tegishli ekanligini korsatdik
    const result = await memberService.processSignup(newMember); // "Ser.model"ning 'method'ni chaqirdik

    req.session.member = result; // COOKIE[sid] & DB.sessions.+member
    req.session.save(function () {
      res.redirect("/admin/product/all");
    });
  } catch (err) {
    console.log("Error, processSignup:", err);
    const message =
      err instanceof Errors ? err.message : Message.SOMETHING_WENT_WRONG;
    res.send(
      `<script> alert("${message}"); window.location.replace('/admin/signup') </script>`,
    );
  }
};

adminController.processLogin = async (req: AdminRequest, res: Response) => {
  try {
    console.log("process login");
    const input: LoginInput = req.body;

    const result = await memberService.processLogin(input); // Service Modeldan "Controller"ga qaytaryapmiz

    req.session.member = result;
    req.session.save(function () {
      res.redirect("/admin/product/all");
    });
  } catch (err) {
    console.log("Error, processLogin:", err);
    const message =
      err instanceof Errors ? err.message : Message.SOMETHING_WENT_WRONG;
    res.send(
      `<script> alert("${message}"); window.location.replace('/admin/login') </script>`,
    );
  }
};

adminController.logout = async (req: AdminRequest, res: Response) => {
  try {
    console.log("logout logout");
    req.session.destroy(function () {
      res.redirect("/admin");
    });
  } catch (err) {
    console.log("Error, logout:", err);
    res.redirect("/admin");
  }
};

export default adminController;
