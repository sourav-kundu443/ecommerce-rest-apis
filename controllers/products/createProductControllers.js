import multer from "multer";
import path from "path";
import Joi from "joi";
import fs from "fs";
import { CreateProduct } from "../../models";
import CustomErrorHandler from "../../services/CustomErrorHandler";

// Multer is a node.js middleware for handling multipart/form-data
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${path.extname(file.originalname)}`;

    cb(null, uniqueName);
  },
});

const handleMultipartData = multer({
  storage,
  limits: { fileSize: 1000000 * 5 }, // 5MB
}).single("image");

const createProductControllers = {
  async create(req, res, next) {
    console.log("fff");
    handleMultipartData(req, res, async (err) => {
      console.log("req", req);
      if (err) {
        return next(CustomErrorHandler.serverError(err.message));
      }
      console.log(req.file);
      const filePath = req.file.path;

      // validate the request
      const productSchema = Joi.object({
        name: Joi.string().required(),
        price: Joi.number().required(),
        size: Joi.string().required(),
      });

      const { error } = productSchema.validate(req.body);
      if (error) {
        // delete the uploaded file
        fs.unlink(`${appRoot}/${filePath}`, (err) => {
          if (err) {
            return next(CustomErrorHandler.serverError(err.message));
          }
        });

        return next(error);
      }

      const { name, price, size } = req.body;
      let document;

      try {
        document = await CreateProduct.create({
          name,
          price,
          size,
          image: filePath,
        });
      } catch (err) {
        return next(err);
      }

      res.status(201).json(document);
    });
  },
};

export default createProductControllers;
