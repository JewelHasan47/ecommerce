import express from "express";
import { isAuthenticatedUser, authorizedRoles } from "../middleware/authentication.js";
import { deleteOrder, getAllOrders, getSingleOrder, myOrders, newOrder, updateOrderStatus } from "../controllers/order-controller.js";

const router = express.Router();

router
    .post( '/order/new', isAuthenticatedUser, newOrder )
    .get( '/order/:id', isAuthenticatedUser, getSingleOrder )
    .get( '/orders/me', isAuthenticatedUser, myOrders )
    .get( '/admin/orders/', isAuthenticatedUser, authorizedRoles( 'admin' ), getAllOrders )
    .put( '/admin/order/:id', isAuthenticatedUser, authorizedRoles( 'admin' ), updateOrderStatus )
    .delete( '/admin/order/:id', isAuthenticatedUser, authorizedRoles( 'admin' ), deleteOrder )

export default router;