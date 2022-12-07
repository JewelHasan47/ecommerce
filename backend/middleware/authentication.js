import ErrorHandler from '../utils/error-handler.js';
import asyncErrors from './async-errors.js';
import jwt from 'jsonwebtoken';
import { User } from '../models/user-model.js';

const isAuthenticatedUser = asyncErrors( async ( req, res, next ) => {
    const { access_token } = req.cookies;

    if ( !access_token ) {
        return next( new ErrorHandler( 'Please login to access this resources.', 401 ) );
    }

    const decodedData = jwt.verify( access_token, process.env.JWT_SECRET );
    req.user = await User.findById( decodedData.id );
    next();
} );

const authorizedRoles = ( ...roles ) => {
    return ( req, res, next ) => {
        if ( !roles.includes( req.user.role ) ) {
            return next( new ErrorHandler( `Role: ${ req.user.role } is not allowed to access this resource`, 403 ) );
        }

        next();
    }; 
};

export { isAuthenticatedUser, authorizedRoles };