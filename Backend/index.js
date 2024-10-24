import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRoute from "./routes/user.routes.js";
import fileUpload from "express-fileupload";
const app = express();
dotenv.config();
const port = process.env.PORT;
const MongodbUlr = process.env.MONGODB_URL;

// middleware
app.use(express.json());
// fileupload
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/temp/",
  })
);
// db connection
try {
  mongoose.connect(MongodbUlr);
  console.log("Database Connected Sucessfully");
} catch (error) {
  console.log("Database Connection Faild ::", error);
}
app.get("/", (req, res) => {
  res.send("Now We Can Start");
});

// define Route

app.use("/api/users", userRoute);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
