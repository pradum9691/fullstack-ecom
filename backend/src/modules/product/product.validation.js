import Joi from "joi";

export const createProductSchema = Joi.object({
  name: Joi.string().min(2).max(200).required(),
  description: Joi.string().min(10).required(),
  price: Joi.number().positive().required(),
  stock: Joi.number().integer().min(0).required(),
  category: Joi.string().min(2).max(100).required(),
  images: Joi.array().items(Joi.string().uri()).optional(),
});
