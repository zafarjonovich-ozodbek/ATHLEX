import { ProductCollection } from "../libs/enums/product.enum";
import Errors, { HttpCode } from "../libs/Errors";
import { T } from "../libs/types/common";
import { ExtendedRequest } from "../libs/types/member";
import { ProductInquiry } from "../libs/types/product";
import ProductService from "../models/Product.service";

const productService = new ProductService();

const productController: T = {};

/** SPA */
productController.getProducts = async (req: Request, res: Response) => {
  try {
    console.log("getProducts"); //@ts-ignore
    const { order, page, limit, productCollection, search } = req.query;
    const inquiry: ProductInquiry = {
      // "QUERY"dan kelayotkan data typeni "SAVE" qiladi
      order: String(order),
      page: Number(page),
      limit: Number(limit),
    };
    if (productCollection) {
      inquiry.productCollection = productCollection as ProductCollection;
    }
    //@ts-ignore
    if (search) inquiry.search = String(search);

    const result = await productService.getProducts(inquiry); //@ts-ignore

    res.status(HttpCode.OK).json(result);
  } catch (err) {
    console.log("Error, getProducts:", err); //@ts-ignore
    if (err instanceof Errors)
      //@ts-ignore
      res.status(err.code).json(err); //@ts-ignore
    else res.status(Errors.standart.code).json(Errors.standart);
  }
};

productController.getProduct = async (req: ExtendedRequest, res: Response) => {
  try {
    console.log("getProduct");
    const { id } = req.params; // distrak
    const memberId = req.member?._id ?? null, //+token.id
      result = await productService.getProduct(memberId, id);

    //@ts-ignore
    res.status(HttpCode.OK).json(result);
  } catch (err) {
    console.log("Error, getProduct:", err); //@ts-ignore
    if (err instanceof Errors)
      //@ts-ignore
      res.status(err.code).json(err); //@ts-ignore
    else res.status(Errors.standart.code).json(Errors.standart);
  }
};

export default productController;
