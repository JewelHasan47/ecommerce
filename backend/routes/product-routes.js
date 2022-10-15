import express from "express";
import { createProduct, deleteProduct, getAllProducts, getProduct, updateProduct } from "../controllers/product-controller.js";

const router = express.Router();

router
    .post( '/product/new', createProduct ) // create new product
    .get( '/products', getAllProducts ) // get all products
    .put( '/product/:id', updateProduct ) // update product
    .delete( '/product/:id', deleteProduct ) // delete product
    .get( '/product/:id', getProduct ); // get product

export default router;