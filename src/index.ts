import express from "express";
import dotenv from "dotenv";
import router from "./routes/router";
import { errorHandler } from "./middleware/error.middleware";

dotenv.config();

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET غير معرف في ملف .env — لا يمكن تشغيل التطبيق بدونه");
}

const app = express();

app.use(express.json());
app.use("/api", router);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
