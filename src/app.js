import express from 'express';
import userRoute from './routes/user.routes.js';
import authRoute from './routes/auth.routes.js';
import path from 'node:path';

const app = express();

app.set("views", path.join(import.meta.dirname, './views'));
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.use("/", userRoute);
app.use("/auth", authRoute);
export default app;