import { Product } from "../models/product-model.js";
import { Order } from "../models/order-model.js";
import ErrorHandler from "../utils/error-handler.js";
import asyncErrors from "../middleware/async-errors.js";

// create order
const newOrder = asyncErrors( async ( req, res, next ) => {
    const { shippingInfo, orderItems, paymentInfo, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body;

    const order = await Order.create(
        {
            shippingInfo,
            orderItems,
            paymentInfo,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
            paidAt: Date.now(),
            user: req.user._id
        }
    );

    res.status( 201 ).json( {
        success: true,
        order: order
    } );

} );

// get logged in single order
const getSingleOrder = asyncErrors( async ( req, res, next ) => {
    const order = await Order.findById( req.params.id ).populate( 'user', 'name email' );

    if ( !order ){
        return next( new ErrorHandler( 'Order not found with this id', 404 ) );
    }

    res.status( 200 ).json( {
        success: true,
        order: order
    } );
} );

// my all orders
const myOrders = asyncErrors( async ( req, res, next ) => {
    const orders = await Order.find( { user: req.user._id } );

    res.status( 200 ).json( {
        success: true,
        orders: orders
    } );
} );

// get all orders --admin
const getAllOrders = asyncErrors( async ( req, res, next ) => {
    const orders = await Order.find();

    let totalAmount = 0;

    orders.forEach( ( order ) => {
        totalAmount += order.totalPrice;
    } );

    res.status( 200 ).json( {
        success: true,
        totalAmount: totalAmount,
        orders: orders
    } );
} );


// get update order status --admin
const updateOrderStatus = asyncErrors( async ( req, res, next ) => {
    const order = await Order.findById( req.params.id );

    if ( !order ){
        return next( new ErrorHandler( 'Order not found with this id', 404 ) );
    }

    if ( order.orderStatus === 'Delivered' ){
        return next( new ErrorHandler( 'You have already delivered this order.', 400 ) );
    }

    order.orderItems.forEach( ( order ) => {
        updateStock( order.product, order.quantity );
    } );

    order.orderStatus = req.body.status;

    if ( req.body.status === 'Delivered' ){
        return order.deliveredAt = Date.now();
    }

    await order.save( { validateBeforeSave: false } );

    res.status( 200 ).json( {
        success: true,
    } );
} );

async function updateStock( id, quantity ){
    const product = await Product.findById( id );

    product.stock -= quantity;

    await product.save( { validateBeforeSave: false } );
}

// delete order --admin
const deleteOrder = asyncErrors( async ( req, res, next ) => {
    const order = await Order.findById( req.params.id );

    if ( !order ){
        return next( new ErrorHandler( 'Order not found with this id', 404 ) );
    }

    await order.remove();

    res.status( 200 ).json( {
        success: true,
    } );
} );

export { newOrder, getSingleOrder, myOrders, getAllOrders, updateOrderStatus, deleteOrder }