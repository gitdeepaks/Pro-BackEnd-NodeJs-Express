import mongoose from "mongoose";
import app from "./src/app.js";

// create a method

(async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/ecomm");
    console.log("DB Connected !");

    app.on("error", (err) => {
      console.error("ERROR:", err);
    });

    const onListning = () => {
      console.log(`Listning on port 4000`);
    };
    app.listen(4000);
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
})();

// run a method
