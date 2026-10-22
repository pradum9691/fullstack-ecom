import { asyncHandler } from "../../utils/asyncHandler.js";
import { Address } from "./address.model.js";

export const getMyAddresses = asyncHandler(async (req, res) => {
  const addresses = await Address.find({ user: req.user._id }).sort({
    createdAt: -1,
  });

  res.json({ success: true, data: addresses });
});

export const addAddress = asyncHandler(async (req, res) => {
  const address = await Address.create({
    ...req.body,
    user: req.user._id,
  });

  res.status(201).json({ success: true, data: address });
});

export const deleteAddress = asyncHandler(async (req, res) => {
  await Address.deleteOne({
    _id: req.params.id,
    user: req.user._id,
  });

  res.json({ success: true });
});
