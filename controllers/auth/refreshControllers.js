import Joi from "joi";
import { REFRESH_SECRET } from "../../config";
import { RefreshToken, User } from "../../models";
import CustomErrorHandler from "../../services/CustomErrorHandler";
import JwtService from "../../services/JwtService";

const refreshControllers = {
  async refresh(req, res, next) {
    // validate
    const refreshSchema = Joi.object({
      refresh_token: Joi.string().required(),
    });

    const { error } = refreshSchema.validate(req.body);
    if (error) {
      return next(error);
    }

    // check in  database
    let refresh_token;
    try {
      refresh_token = await RefreshToken.findOne({
        refresh_token: req.body.refresh_token,
      });
      if (!refresh_token) {
        return next(CustomErrorHandler.unAuthorized("Invalid refresh token!"));
      }

      let userId;
      try {
        const { _id } = JwtService.verify(
          req.body.refresh_token,
          REFRESH_SECRET
        );
        userId = _id;
      } catch (err) {
        return next(CustomErrorHandler.unAuthorized("Invalid refresh token!"));
      }

      // is user present in DB
      const user = User.findOne({ _id: userId });
      if (!user) {
        return next(CustomErrorHandler.unAuthorized("No user found!"));
      }

      // Token
      const access_token = JwtService.sign({ _id: user._id, role: user.role });
      const refresh_token_new = JwtService.sign(
        { _id: user._id, role: user.role },
        "1y",
        REFRESH_SECRET
      );
      // database whitelist refresh token (store refresh token in DB)
      await RefreshToken.create({ refresh_token: refresh_token_new });

      // send response
      res.json({ access_token, refresh_token: refresh_token_new });
    } catch (err) {
      return next(new Error("Something went wrong! " + err.message));
    }
  },
};

export default refreshControllers;
