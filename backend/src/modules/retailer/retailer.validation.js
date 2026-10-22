import Joi from "joi";

export const applyRetailerSchema = Joi.object({
  shopName: Joi.string().min(2).max(100).required(),
  shopAddress: Joi.string().min(7).max(500).required(),
  gstNumber: Joi.string()
    .pattern(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/)
    .required()
    .messages({
      "string.pattern.base": "Invalid GST number format"
    }),
  bankDetails: Joi.object({
    accountNumber: Joi.string().allow("").optional(),
    ifsc: Joi.string().allow("").optional(),
    bankName: Joi.string().allow("").optional(),
  }).optional(),
});
