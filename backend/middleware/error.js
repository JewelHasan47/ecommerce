import ErrorHandler from "../utils/error-handler.js";

const error = ( err, req, res, next ) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || 'Internal Server Error';

    // mongodb id error
    if ( err.name === 'CastError' ) {
        const message = `Resource not found. Invalid: ${ err.path }`;
        err = new ErrorHandler( message, 400 );
    }

    // mongoose duplicate key error
    if ( err.code === 11000 ) {
        const message = `Duplicate ${ Object.keys( err.keyValue ) } Entered`;
        err = new ErrorHandler( message, 400 );
    }

    // jwt error
    if ( err.name === 'JsonWebTokenError' ) {
        const message = `Json Web Token is invalid, try again.`;
        err = new ErrorHandler( message, 400 );
    }

    // jwt expire error
    if ( err.name === 'TokenExpiredError' ) {
        const message = `Json Web Token is expired, try again.`;
        err = new ErrorHandler( message, 400 );
    }

    console.log( err );

    res.status( err.statusCode ).json( {
        success: false,
        message: err.message
    } );
};

export default error;