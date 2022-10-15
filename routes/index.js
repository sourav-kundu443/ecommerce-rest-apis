import express from "express";
import { registerController, loginControllers } from "../controllers";

const router = express.Router();

router.post(`/register`, registerController.register);
router.post(`/login`, loginControllers.login);

export default router;
