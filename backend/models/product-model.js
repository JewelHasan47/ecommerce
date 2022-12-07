import mongoose from "mongoose";

const productSchema = mongoose.Schema( {
    name: {
        type: String,
        required: [ true, 'Please enter a product name.' ],
        trim: true
    },
    description: {
        type: String,
        required: [ true, 'Please enter product description.' ]
    },
    price: {
        type: Number,
        required: [ true, 'Please enter product price.' ],
        maxLength: [ 6, 'Price can not exceed 6 characters.' ]
    },
    ratings: {
        type: Number,
        default: 0
    },
    images: [
        {
            public_id: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            },
        }
    ],
    category: {
        type: String,
        required: [ true, 'Please enter a product category.' ],
    },
    stock: {
        type: Number,
        required: [ true, 'Please enter product stock.' ],
        maxLength: [ 4, 'Price can not exceed 4 characters.' ],
        default: 1
    },
    numberOfReviews: {
        type: Number,
        default: 0
    },
    reviews: [
        {
            user: {
                type: mongoose.Schema.ObjectId,
                ref: 'User',
                required: true
            },
            name: {
                type: String,
                required: true
            },
            rating: {
                type: Number,
                required: true
            },
            comment: {
                type: String,
                required: true
            },
        }
    ],
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true } );

const Product = mongoose.model( 'Product', productSchema );

export {
    Product
};