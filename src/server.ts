import dotenv from "dotenv";
dotenv.config();

console.log("PRT:", process.env.PORT);
console.log("MONGO:", process.env.MONGO_URL);
