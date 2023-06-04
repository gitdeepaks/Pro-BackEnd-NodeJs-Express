import mongoose from "mongoose";
import app from "./src/app.js";
import config from "./src/config/index.js";

// create a method
// run a method

(async () => {
  try {
    await mongoose.connect(config.MONGODB_URL);
    console.log("DB Connected !");
    // onListning();

    app.on("error", (err) => {
      console.error("ERROR:", err);
    });

    const onListning = () => {
      console.log(`Listning on port ${config.PORT}`);
    };
    app.listen(config.PORT, onListning);
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
})();
