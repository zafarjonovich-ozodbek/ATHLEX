import cors from "cors";
import express from "express";
import path from "path";
import routerAdmin from "./router-admin";
import morgan from "morgan";
import { MORGAN_FORMAT } from "./libs/config";
import cookieParser from "cookie-parser"; // "req.cookie" larni oqaolish uchun(TOKEN)

// TCP2 (with session)
import session from "express-session";
import ConnectMongoDB from "connect-mongodb-session";
import { T } from "./libs/types/common";
import router from "./router";

const MongoDBStore = ConnectMongoDB(session);
const store = new MongoDBStore({
  uri: String(process.env.MONGO_URL),
  collection: "sessions",
});

/* 1-ENTERANCE(kirish) */
const app = express();
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static("./uploads"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: true,
  }),
);
app.use(cookieParser());
app.use(morgan(MORGAN_FORMAT));

/* 2-SESSION (TAMG'A) */

// LOGIN: req.+session | OTHER REQ: req.session.+member
// COOKIE[SID] > DATABASE > req.session.member
app.use(
  session({
    secret: String(process.env.SESSION_SECRET),
    cookie: {
      maxAge: 1000 * 3600 * 3, // 3hr
    },
    store: store,
    resave: true,
    saveUninitialized: true,
  }),
);
app.use(function (req, res, next) {
  //   const sessionInstance = req.session as T;
  //   res.locals.member = sessionInstance.member;
  next();
});

/* 3-VIEWS */
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

/* 4-ROUTERS  */
app.use("/admin", routerAdmin); // admin uchun (BSSR: EJS)
app.use("/", router); // userlar uchun (SPA: REACT)

export default app;
