import express from "express";
import {
    createProduct, createProductReview, deleteProduct,
    getAllProducts, getProduct, updateProduct
} from "../controllers/product-controller.js";
import { authorizedRoles, isAuthenticatedUser } from '../middleware/authentication.js';

const router = express.Router();

router
    .post( '/admin/product/new', isAuthenticatedUser, authorizedRoles( 'admin' ), createProduct ) // create new product
    .get( '/products', isAuthenticatedUser, getAllProducts ) // get all products
    .put( '/admin/product/:id', isAuthenticatedUser, authorizedRoles( 'admin' ), updateProduct ) // update product
    .delete( '/admin/product/:id', isAuthenticatedUser, authorizedRoles( 'admin' ), deleteProduct ) // delete product
    .get( '/product/:id', getProduct ) // get product
    .put( '/review', isAuthenticatedUser, createProductReview );

export default router;