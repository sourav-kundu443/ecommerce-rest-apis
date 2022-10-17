import multer from "multer";
import path from "path";
import Joi from "joi";
import fs from "fs";
import { CreateProduct } from "../../models";
import CustomErrorHandler from "../../services/CustomErrorHandler";
import productSchema from "../../validators/productValidator";

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

const productControllers = {
  async create(req, res, next) {
    handleMultipartData(req, res, async (err) => {
      if (err) {
        return next(CustomErrorHandler.serverError(err.message));
      }
      const filePath = req.file.path;

      // validate the request
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
  async updateProduct(req, res, next) {
    handleMultipartData(req, res, async (err) => {
      if (err) {
        return next(CustomErrorHandler.serverError(err.message));
      }
      let filePath;
      if (req.file) {
        filePath = req.file.path;
      }

      // validate the request
      const { error } = productSchema.validate(req.body);
      if (error) {
        // delete the uploaded file
        if (req.file) {
          fs.unlink(`${appRoot}/${filePath}`, (err) => {
            if (err) {
              return next(CustomErrorHandler.serverError(err.message));
            }
          });
        }
        return next(error);
      }

      const { name, price, size } = req.body;
      let document;

      try {
        document = await CreateProduct.findOneAndUpdate(
          { _id: req.params.productId },
          {
            name,
            price,
            size,
            ...(req.file && { image: filePath }),
          },
          { new: true }
        );
      } catch (err) {
        return next(err);
      }

      res.status(201).json(document);
    });
  },
  async deleteProduct(req, res, next) {
    const document = await CreateProduct.findOneAndRemove({
      _id: req.params.productId,
    });
    if (!document) {
      return next(new Error("Nothing to delete!"));
    }

    const imagePath = document.image;
    fs.unlink(`${appRoot}/${imagePath}`, (err) => {
      if (err) {
        return next(CustomErrorHandler.serverError(err.message));
      }
    });
    res.json(document);
  },
};

export default productControllers;
