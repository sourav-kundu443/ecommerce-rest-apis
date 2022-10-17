import express from "express";
import {
  registerController,
  loginControllers,
  userDetailsControllers,
  refreshControllers,
  logoutControllers,
  createProductControllers,
  updateProductControllers,
} from "../controllers";
import auth from "../middlewares/auth";
import admin from "../middlewares/admin";

const router = express.Router();

router.post(`/register`, registerController.register);
router.post(`/login`, loginControllers.login);
router.get(`/userdetails`, auth, userDetailsControllers.singleUserData);
router.post(`/refresh`, refreshControllers.refresh);
router.post(`/logout`, auth, logoutControllers.logout);

router.post(`/products`, [auth, admin], createProductControllers.create);
// router.put(`/products/`, updateProductControllers.updateProduct);

export default router;
