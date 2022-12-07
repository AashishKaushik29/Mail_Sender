const mongoose = require("mongoose");

const connectDB = async () => {
  mongoose
    .connect(
      "mongodb://127.0.0.1:27017/localleave",

      (err) => {
        if (err) {
          return console.log("🔩[DATABASE]: Connection issue", err.message);
        }
        console.log("🔩[DATABASE]: Connection successful");
      }
    )
   
};
module.exports = connectDB;
