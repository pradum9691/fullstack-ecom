import Joi from "joi";

export const addToCartSchema = Joi.object({
  productId: Joi.string()
    .required()
    .pattern(/^[0-9a-fA-F]{24}$/),  
  quantity: Joi.number().integer().min(1).max(100).default(1),
});

export const updateCartItemSchema = Joi.object({
  quantity: Joi.number().integer().min(1).max(100).required(),
});
