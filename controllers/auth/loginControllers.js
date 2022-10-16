import Joi from "joi";
import bcrypt from "bcrypt";
import { RefreshToken, User } from "../../models";
import CustomErrorHandler from "../../services/CustomErrorHandler";
import JwtService from "../../services/JwtService";
import { REFRESH_SECRET } from "../../config";

const loginControllers = {
  async login(req, res, next) {
    //validate
    const loginSchema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string()
        .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
        .required(),
    });

    const { error } = loginSchema.validate(req.body);
    if (error) {
      return next(error);
    }

    // check user detais present in DB
    let access_token;
    let refresh_token;
    try {
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        return next(CustomErrorHandler.wrongCredentials());
      }

      // compare the password
      const match = await bcrypt.compare(req.body.password, user.password);
      if (!match) {
        return next(CustomErrorHandler.wrongCredentials());
      }

      // Token
      access_token = JwtService.sign({ _id: user._id, role: user.role });
      refresh_token = JwtService.sign(
        { _id: user._id, role: user.role },
        "1y",
        REFRESH_SECRET
      );
      // database whitelist refresh token (store refresh token in DB)
      await RefreshToken.create({ refresh_token: refresh_token });
    } catch (err) {
      return next(err);
    }

    // send response
    res.json({ access_token, refresh_token });
  },
};

export default loginControllers;
