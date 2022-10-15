// create product
import { Product } from "../models/product-model.js";
import ErrorHandler from "../utils/error-handler.js";
import asyncErrors from "../middleware/async-errors.js";
import ApiFeatures from "../utils/api-features.js";

const createProduct = asyncErrors( async ( req, res, next ) => {
    const product = await Product.create( req.body );
    res.status( 200 ).json( {
        success: true,
        product: product
    } );
} );

// get all product list
const getAllProducts = asyncErrors( async ( req, res, next ) => {
    const resultPerPage = 5;
    const productCount = await Product.countDocuments( resultPerPage );
    const apiFeatures = new ApiFeatures( Product.find(), req.query ).search().filter().pagination( productCount );
    const products = await apiFeatures.query;

    if ( !products ) {
        return next( new ErrorHandler( 'Product not found', 404 ) );
    }

    res.status( 200 ).json( {
        success: true,
        product: products,
        productCount: productCount
    } );
} );

// update product
const updateProduct = asyncErrors( async ( req, res, next ) => {
    let product = await Product.findById( req.params.id );

    if ( !product ) {
        return next( new ErrorHandler( 'Product not found', 404 ) );
    }

    product = await Product.findByIdAndUpdate( req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    } );

    res.status( 200 ).json( {
        success: true,
        product: product
    } );
} );

// delete product
const deleteProduct = asyncErrors( async ( req, res, next ) => {
    const product = await Product.findById( req.params.id );

    if ( !product ) {
        return next( new ErrorHandler( 'Product not found', 404 ) );
    }

    product.remove();

    res.status( 200 ).json( {
        success: true,
        message: 'Product deleted successfully.'
    } );
} );

// get product
const getProduct = asyncErrors( async ( req, res, next ) => {
    const product = await Product.findById( req.params.id );

    if ( !product ) {
        return next( new ErrorHandler( 'Product not found', 404 ) );
    }

    res.status( 200 ).json( {
        success: true,
        product: product
    } );
} );

export {
    getAllProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    getProduct
};