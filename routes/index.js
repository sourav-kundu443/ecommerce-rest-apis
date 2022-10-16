import express from "express";
import {
  registerController,
  loginControllers,
  userDetailsControllers,
  refreshControllers,
  logoutControllers,
} from "../controllers";
import auth from "../middlewares/auth";

const router = express.Router();

router.post(`/register`, registerController.register);
router.post(`/login`, loginControllers.login);
router.get(`/userdetails`, auth, userDetailsControllers.singleUserData);
router.post(`/refresh`, refreshControllers.refresh);
router.post(`/logout`, auth, logoutControllers.logout);
export default router;
