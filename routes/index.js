import express from "express";
import {
  registerController,
  loginControllers,
  userDetailsControllers,
} from "../controllers";
import auth from "../middlewares/auth";

const router = express.Router();

router.post(`/register`, registerController.register);
router.post(`/login`, loginControllers.login);
router.get(`/userdetails`, auth, userDetailsControllers.singleUserData);

export default router;
