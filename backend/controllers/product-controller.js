// create product
import { Product } from "../models/product-model.js";
import ErrorHandler from "../utils/error-handler.js";
import asyncErrors from "../middleware/async-errors.js";
import ApiFeatures from "../utils/api-features.js";

const createProduct = asyncErrors( async ( req, res, next ) => {
    req.body.user = req.user.id;

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

// create new review or update the review
const createProductReview = asyncErrors( async ( req, res, next ) => {
    const { rating, comment, productID } = req.body;

    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number( rating ),
        comment,
    };

    const product = await Product.findById( productID );

    const isReviewed = product.reviews.find(
        ( rev ) => rev.user.toString() === req.user._id.toString()
    );

    if ( isReviewed ) {
        product.reviews.forEach( ( rev ) => {
            if ( rev.user.toString() === req.user._id.toString() )
                ( rev.rating = rating ), ( rev.comment = comment );
        } );
    } else {
        product.reviews.push( review );
        product.numberOfReviews = product.reviews.length;
    }

    let avg = 0;

    product.reviews.forEach( ( rev ) => {
        avg += rev.rating;
    } );

    product.ratings = avg / product.reviews.length;

    await product.save( { validateBeforeSave: false } );

    res.status( 200 ).json( {
        success: true,
        review: review
    } );
} );


export {
    getAllProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    getProduct,
    createProductReview
};