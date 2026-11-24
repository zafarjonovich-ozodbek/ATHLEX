// import Errors, { HttpCode, Message } from "../libs/errors";
import { shapeIntoMongooseObjectId } from "../libs/config";
import { MemberStatus, MemberType } from "../libs/enums/member.enum";
import Errors, { HttpCode, Message } from "../libs/Errors";
import {
  LoginInput,
  Member,
  MemberInput,
  MemberUpdateInput,
} from "../libs/types/member";
import MemberModel from "../schema/Member.model";
import * as bcrypt from "bcryptjs";

class MemberService {
  private readonly memberModel; // 'SCHEMA"ni 'call' qilib variablega tengladik

  constructor() {
    this.memberModel = MemberModel;
  }

  public async processSignup(input: MemberInput): Promise<Member> {
    const exist = await this.memberModel // "exist" - agar 1ta "RES" bolsa va yana boshqa "RES" kiritsak, 1-"RES" haqida malumot qaytaradi
      .findOne({ memberType: MemberType.ADMIN })
      .exec();
    if (exist)
      throw new Errors(HttpCode.BAD_REQUEST, Message.SOMETHING_WENT_WRONG); // agar "exist(2ta RES)" bolsa shu "error" ishga tushadi

    const salt = await bcrypt.genSalt(); // "user" 'signup'bolganda uning "password" hash bolib qaytishi uchun
    input.memberPassword = await bcrypt.hash(input.memberPassword, salt); // va qaysi 'input' malumot nima orqali (solt) 'hash' bolishini kirityapmiz

    try {
      const result = await this.memberModel.create(input);
      result.memberPassword = "";
      //@ts-ignore
      return result as Member;
    } catch (err) {
      throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
    }
  }
}

export default MemberService;
