import mongoose from "mongoose";

const collectionScema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: ["true", "Please provide a product or a collection name"],
      trim: true,
      maxLength: [120, "Collection name should not be more than 120 chars"],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Collection", collectionScema);

// collections
