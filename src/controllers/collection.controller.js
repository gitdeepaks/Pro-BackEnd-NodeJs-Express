import Collection from "../models/collection.schema.js";
import asyncHandler from "../service/asyncHandler.js";
import CustomError from "../utils/CustomError";

/**********************************************************
 * @CREATE_COUPON
 * @route https://localhost:4000/api/coupon
 * @description Controller used for creating a new coupon
 * @description Only admin and Moderator can create the coupon
 * @returns Coupon Object with success message "Coupon Created SuccessFully"
 *********************************************************/

export const createCollection = asyncHandler(async (req, res) => {
  const { name } = req.body;

  if (!name) {
    throw new CustomError("Collection name is required", 400);
  }

  const collection = Collection.create({
    name,
  });

  req.status(200).json({
    success: true,
    message: "Collection was created Successfully",
    collection,
  });
});

export const updateCollection = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const { id: collectionId } = req.params;

  if (!name) {
    throw new CustomError("Collection name is required", 400);
  }

  let updateCollection = await Collection.findByIdAndUpdate(
    collectionId,
    {
      name,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updateCollection) {
    throw new CustomError("Collection not found", 400);
  }

  req.status(200).json({
    success: true,
    message: "Collection updated Successfully",
    updateCollection,
  });
});

export const deleteCollection = asyncHandler(async (req, res) => {
  const { id: collectionId } = req.params;

  const collectionToDelete = await Collection.findById(collectionId);

  const collections = await Collection.find();

  if (!collections) {
    throw new CustomError("Collections not found ", 400);
  }

  await collectionToDelete.remove();

  req.status(200).json({
    success: true,
    collections,
  });
});

export const getAllCollection = asyncHandler(async (req, res) => {
  if (!collectionToDelete) {
    throw new CustomError("Collection to be deleted not found ", 400);
  }

  req.status(200).json({
    success: true,
    message: "Collection delete Successfully",
  });
});
