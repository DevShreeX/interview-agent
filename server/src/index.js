import app from "./server.js";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`Interview Mirror AI Backend Intelligence Engine`);
  console.log(`Server listening on http://localhost:${PORT}`);
  console.log(`====================================================`);
});
