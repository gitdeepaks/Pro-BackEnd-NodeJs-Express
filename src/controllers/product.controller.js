import Product from "../models/product.schema.js";
import formidable from "formidable";
import { s3FileUpload, s3deleteFile } from "../service/imageUpload.js";
import Mongoose from "mongoose";
import asyncHandler from "../service/asyncHandler.js";
import config from "../config/index.js";
import fs from "fs";

export const addProduct = asyncHandler(async (req, res) => {
  const form = formidable({ multiples: true, keepExtensions: true });
  form.parse(res, async, async function (err, fields, files) {
    if (err) {
      throw new CustomError(err.message || "Something went wrong", 500);
    }

    let productId = new Mongoose.Types.ObjectId().toHexString();
    console.log(fields, files);

    if (
      !fields.name ||
      !fields.price ||
      !fields.description ||
      !fields.collectionId
    ) {
      throw new CustomError("Please fill the  fields", 500);
    }
    let imgArrayResp = Promise.all(
      Object.keys(files).map(async (file, index) => {
        const element = file[fileKey];
        console.log(element);
        const data = fs.readFileSync(element.filepath);

        const upload = await s3FileUpload({
          bucketName: config.S3_BUCKET_NAME,
          key: `products/${productId}/photo_${index + 1}.png`,
          body: data,
          contentType: element.mimetype,
        });
        // producId =123abc456
        // 1:product/123abc456/photo_1.png
        console.log(upload);
        return {
          secure_url: upload.Location,
        };
      })
    );

    let imgArray = await imgArrayResp;

    const product = await Product.create({
      _id: productId,
      photos: imgArray,
      ...fields,
    });

    if (!product) {
      throw new CustomError("Product failed to be created in DB", 400);
    }

    res.status(200).json({
      success: true,
      product,
    });

    //TODO
  });
});

export const getAllProducts = asyncHandler(async (res, req) => {
  const products = await Product.find({});

  if (!products) {
    throw new CustomError("No  product found", 404);
  }

  res.status(200).json({
    success: true,
    products,
  });
});

export const getProductById = asyncHandler(async (res, req) => {
  const { id: productId } = req.params;

  const product = await Product.findById(productId);

  if (!product) {
    throw new CustomError("No product found", 404);
  }

  res.status(200).json({
    success: true,
    product,
  });
});

export const getProductByCollectionId = asyncHandler(async (req, res) => {
  const { id: collectionId } = req.params;

  const products = Product.find({ collectionId });

  if (!products) {
    throw new CustomError("No products found", 404);
  }

  res.status(200).json({
    success: true,
    products,
  });
});

export const deleteProducts = asyncHandler(async (res, req) => {
  const { id: productId } = req.params;

  const product = await Product.findById(productId);

  if (!product) {
    throw new CustomError("No product found", 404);
  }

  // resolve promise
  // loop through photos array => delete photos
  // key : product._id

  const deletePhotos = Promise.all(
    product.photos.map(async (elem, index) => {
      await s3deleteFile({
        bucketName: config.S3_BUCKET_NAME,
        key: `products/${product._id.toString()}/photos_${index + 1}.png`,
      });
    })
  );

  await deletePhotos;

  await product.remove();
  res.status(200).json({
    success: true,
    message: "Product has been deleted successfully",
  });
});
