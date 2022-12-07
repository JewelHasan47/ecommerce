import ErrorHandler from "../utils/error-handler.js";
import asyncErrors from "../middleware/async-errors.js";
import { User } from "../models/user-model.js";
import { sendToken } from '../utils/jwt-token.js';
import { sendEmail } from '../utils/send-email.js';
import crypto from 'crypto';

// user registration
const registerUser = asyncErrors( async ( req, res, next ) => {
    const { name, email, password } = req.body;

    const user = await User.create( {
        name,
        email,
        password,
        avatar: {
            public_id: 'this is sample id',
            url: 'profilePicUrl'
        }
    } );

    sendToken( user, 201, res );
} );

// user login
const loginUser = asyncErrors( async ( req, res, next ) => {
    const { email, password } = req.body;

    // checking if user has given email and password both
    if ( !email || !password ) {
        return next( new ErrorHandler( 'Please Enter Your Email & Password', 400 ) );
    }

    const user = await User.findOne( { email } ).select( '+password' );

    if ( !user ) {
        return next( new ErrorHandler( 'Invalid Email or Password', 401 ) );
    }

    const isPasswordMatched = await user.comparePassword( password );

    if ( !isPasswordMatched ) {
        return next( new ErrorHandler( 'Invalid Email or Password', 401 ) );
    }

    sendToken( user, 200, res );
} );

// user logout
const logout = asyncErrors( async ( req, res, next ) => {
    res.cookie( 'token', null, {
        expires: new Date( Date.now() ),
        httpOnly: true
    } );

    res.status( 200 ).json( {
        success: true,
        message: 'Logout.'
    } );
} );

// user forgot password
const forgotPassword = asyncErrors( async ( req, res, next ) => {
    const user = await User.findOne( { email: req.body.email } );
    if ( !user ) {
        return next( new ErrorHandler( 'User Not Found.', 404 ) );
    }
    // get reset password token
    const resetToken = user.getResetPasswordToken();

    await user.save( { validateBeforeSave: false } );

    const resetPasswordUrl = `${ req.protocol }://${ req.get( 'host' ) }/api/v1/password/reset/${ resetToken }`;

    const message = `Your password reset token is :- \n\n  ${ resetPasswordUrl } \n\n If you have not requested this email, then ignore it.`;

    try {
        await sendEmail( {
            email: user.email,
            subject: 'Ecommerce Password Recovery.',
            message: message
        } );

        res.status( 200 ).json( {
            success: true,
            message: `Email sent to ${ user.email } successfully.`
        } );
    } catch ( error ) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save( { validateBeforeSave: false } );
        return next( new ErrorHandler( error.message, 500 ) );
    }
} );

// user reset password
const resetPassword = asyncErrors( async ( req, res, next ) => {
    const resetPasswordToken = crypto
        .createHash( 'sha256' )
        .update( req.params.token )
        .digest( 'hex' );

    const user = await User.findOne( {
        resetPasswordToken,
        resetPasswordExpire: {
            $gt: Date.now()
        }
    } );

    if ( !user ) {
        return next( new ErrorHandler( 'Reset Password token is invalid or has been expired', 400 ) );
    }

    if ( req.body.password !== req.body.confirmPassword ) {
        return next( new ErrorHandler( 'Password does not match', 400 ) );
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendToken( user, 200, res );
} );

// user details
const getUserDetails = asyncErrors( async ( req, res, next ) => {
    const user = await User.findById( req.user.id );

    res.status( 200 ).json( {
        success: true,
        user: user
    } );
} );

// user update password
const updateUserPassword = asyncErrors( async ( req, res, next ) => {
    const user = await User.findById( req.user.id ).select( '+password' );

    const isPasswordMatched = await user.comparePassword( req.body.oldPassword );

    if ( !isPasswordMatched ) {
        return next( new ErrorHandler( 'Old Password is incorrect', 401 ) );
    }

    if ( req.body.newPassword !== req.body.confirmPassword ) {
        return next( new ErrorHandler( 'Password does not match', 400 ) );
    }

    user.password = req.body.newPassword;

    await user.save();

    sendToken( user, 200, res );
} );

// user update profile
const updateUserProfile = asyncErrors( async ( req, res, next ) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email
    };

    const user = await User.findByIdAndUpdate( req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    } );

    res.status( 200 ).json( {
        success: true,
        user: user
    } );
} );

// all user list --Admin
const getAllUsers = asyncErrors( async ( req, res, next ) => {
    const users = await User.find();

    res.status( 200 ).json( {
        success: true,
        users: users
    } );
} );

// all user list --Admin
const getSingleUser = asyncErrors( async ( req, res, next ) => {
    const user = await User.findById( req.params.id );

    if ( !user ) {
        return next( new ErrorHandler( `User does not exist with Id: ${ req.params.id }` ) );
    }

    res.status( 200 ).json( {
        success: true,
        user: user
    } );
} );

// user update role --Admin
const updateUserRole = asyncErrors( async ( req, res, next ) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
    };

    const user = await User.findByIdAndUpdate( req.params.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    } );

    res.status( 200 ).json( {
        success: true,
        user: user
    } );
} );

// user profile delete
const deleteUserProfile = asyncErrors( async ( req, res, next ) => {
    const user = await User.findById( req.params.id );

    if ( !user ) {
        return next( new ErrorHandler( `User does not exist with Id: ${ req.params.id }` ) );
    }

    await user.remove();

    res.status( 200 ).json( {
        success: true,
        message: 'User Deleted Successfully.'
    } );
} );

export {
    registerUser,
    loginUser,
    forgotPassword,
    resetPassword,
    getUserDetails,
    updateUserPassword,
    updateUserProfile,
    logout,
    getAllUsers,
    getSingleUser,
    updateUserRole,
    deleteUserProfile
};