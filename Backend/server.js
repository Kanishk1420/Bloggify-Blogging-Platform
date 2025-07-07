import { app } from "./app.js";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log("Cloudinary connected");

app.listen(process.env.PORT, () => {
  console.log(
    `Server is running on port ${process.env.PORT} ${process.env.NODE_ENV}`
  );
});
