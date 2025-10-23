import express from 'express';
import userRoute from './routes/user.routes.js';
import authRoute from './routes/auth.routes.js';
import path from 'node:path';
import cookieParser from 'cookie-parser';
import useAuth from './middlewares/auth.middleware.js';

const app = express();

app.set("views", path.join(import.meta.dirname, './views'));
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser());

app.use(useAuth);
app.use("/", userRoute);
app.use("/auth", authRoute);
export default app;