  import express from "express";
  import { authMiddleware } from "../../middlewares/auth.middleware.js";
  import { roleMiddleware } from "../../middlewares/role.middleware.js";
  import { getAdminProducts} from "./admin.product.controller.js";
  import { approveProduct, rejectProduct } from "./admin.controller.js";

  const router = express.Router();

  router.get(
    "/",
    authMiddleware,
    roleMiddleware("ADMIN"),
    getAdminProducts
  );

  router.patch(
    "/products/:id/approve",
    authMiddleware,
    roleMiddleware("ADMIN"),
    approveProduct,
  );

  router.patch(
    "/products/:id/reject",
    authMiddleware,
    roleMiddleware("ADMIN"),
    rejectProduct
  );

  export default router;
