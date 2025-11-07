import express from 'express';
import userRoute from './routes/user.routes.js';
import authRoute from './routes/auth.routes.js';
import appointmentRoute from './routes/appointment.routes.js';
import path from 'node:path';
import cookieParser from 'cookie-parser';
import useAuth from './middlewares/auth.middleware.js';
import userProfile from './middlewares/profile.middleware.js';
import clinicRoute from './routes/clinic.routes.js';

const app = express();

app.set("views", path.join(import.meta.dirname, './views'));
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.static(path.join(import.meta.dirname, "public")));
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser());

app.use(useAuth);
app.use("/", userRoute);
app.use("/auth", authRoute);
app.use("/", appointmentRoute);
app.use("/clinic", clinicRoute);
app.use(userProfile);
export default app;