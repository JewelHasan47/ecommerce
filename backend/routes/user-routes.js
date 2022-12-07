import express from "express";
import { deleteUserProfile, forgotPassword, getAllUsers, getSingleUser, getUserDetails, loginUser, logout, registerUser, resetPassword, updateUserPassword, updateUserProfile, updateUserRole } from "../controllers/user-controller.js";
import { authorizedRoles, isAuthenticatedUser } from '../middleware/authentication.js';

const router = express.Router();

router
    .post( '/register', registerUser ) // create new user
    .post( '/login', loginUser ) // login user
    .get( '/me', isAuthenticatedUser, getUserDetails ) // get details
    .put( '/me/update', isAuthenticatedUser, updateUserProfile ) // get details
    .post( '/password/forgot', forgotPassword ) // forgot password
    .put( '/password/reset/:token', resetPassword ) // reset password
    .put( '/password/update', isAuthenticatedUser, updateUserPassword ) // update password
    .get( '/logout', logout )
    .get( '/admin/users', isAuthenticatedUser, authorizedRoles( 'admin' ), getAllUsers )
    .get( '/admin/user/:id', isAuthenticatedUser, authorizedRoles( 'admin' ), getSingleUser )
    .put( '/admin/user/:id', isAuthenticatedUser, authorizedRoles( 'admin' ), updateUserRole )
    .delete( '/admin/user/:id', isAuthenticatedUser, authorizedRoles( 'admin' ), deleteUserProfile )


export default router;