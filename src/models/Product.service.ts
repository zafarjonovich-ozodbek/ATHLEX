import { Types } from "mongoose";
import { shapeIntoMongooseObjectId } from "../libs/config";
import { ProductStatus } from "../libs/enums/product.enum";
import { ViewGroup } from "../libs/enums/view.enum";
import Errors, { HttpCode, Message } from "../libs/Errors";
import { T } from "../libs/types/common";
import { Product, ProductInquiry } from "../libs/types/product";
import { ViewInput } from "../libs/types/view";
import ProductModel from "../schema/Product.model";
import ViewService from "./View.Service";

class ProductService {
  private readonly productModel;
  public viewService;

  constructor() {
    this.productModel = ProductModel;
    this.viewService = new ViewService();
  }

  /** SPA */
  public async getProducts(inquiry: ProductInquiry): Promise<Product[]> {
    const match: T = { productStatus: ProductStatus.PROCESS }; // PROCESS'dagi productlarnigina korsat

    if (inquiry.productCollection)
      match.productCollection = inquiry.productCollection;
    if (inquiry.search) {
      match.productName = { $regex: new RegExp(inquiry.search, "i") }; // "i" - FLEG
    }

    const sort: T =
      inquiry.order === "productPrice" // "dynamic key"ni xosil qilyapmiz
        ? { [inquiry.order]: 1 }
        : { [inquiry.order]: -1 }; // asending/desending

    const result = await this.productModel
      .aggregate([
        // pipeline'larni create
        { $match: match },
        { $sort: sort },
        { $skip: (inquiry.page * 1 - 1) * inquiry.limit }, // 'page va limit' ni "skip" qilb "pagination"ni create
        { $limit: inquiry.limit * 1 }, // osha page'dagi 'limit=3' productni olib beradi
      ])
      .exec();
    if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

    return result as Product[];
  }

  public async getProduct(
    memberId: Types.ObjectId | null,
    id: string,
  ): Promise<Product> {
    const productId = shapeIntoMongooseObjectId(id);

    let result = await this.productModel
      .findOne({ _id: productId, productStatus: ProductStatus.PROCESS })
      .exec();
    if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

    if (memberId) {
      // 1 - firts view?
      const input: ViewInput = {
        // @ts-ignore
        memberId: memberId,
        viewRefId: productId,
        viewGroup: ViewGroup.PRODUCT,
      };
      const existView = await this.viewService.checkViewExistence(input);

      // 2 - "DATABASE COLLECTION"ga qo'shadi
      console.log("EXIST:", !!existView);
      if (!existView) {
        await this.viewService.insertMemberView(input);

        // 3 - view log +1
        result = await this.productModel
          .findByIdAndUpdate(
            productId,
            { $inc: { productViews: +1 } },
            { new: true },
          )
          .exec();
      }
    }

    return result as Product;
  }
}

export default ProductService;
