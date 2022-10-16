import Joi from "joi";
import { RefreshToken } from "../../models";

const logoutControllers = {
  async logout(req, res, next) {
    // validate
    const refreshSchema = Joi.object({
      refresh_token: Joi.string().required(),
    });

    const { error } = refreshSchema.validate(req.body);
    if (error) {
      return next(error);
    }

    try {
      await RefreshToken.deleteOne({ refresh_token: req.user.refresh_token });
    } catch (err) {
      return next(new Error("Somthing went wrong!"));
    }
    res.json({ message: "logout successfully!" });
  },
};

export default logoutControllers;
