import express from 'express';
import dotenv from 'dotenv';
import productRoutes from "./routes/product-routes.js";
import userRoutes from "./routes/user-routes.js";
import orderRoutes from "./routes/order-routes.js";
import { databaseConnection } from "./config/database.js";
import error from "./middleware/error.js";
import cookieParser from 'cookie-parser';

// main app
const app = express();

// dotenv config
dotenv.config( { path: 'backend/config/config.env' } );

// body parser
app.use( express.json() );
app.use( cookieParser() );

// database connection
databaseConnection();

// handle uncaught exception
process.on( 'uncaughtException', ( err ) => {
    console.log( `Error: ${ err.message }` );
    console.log( `Shutting down the server due to Uncaught Exception` );
    process.exit( 1 );
} );

// all routes
app.use( '/api/v1', productRoutes );
app.use( '/api/v1', userRoutes );
app.use( '/api/v1', orderRoutes );

// error handler
app.use( error );

// PORT
const PORT = process.env.PORT || 5000;

// server start
const server = app.listen( PORT, () => {
    console.log( `Server running on http://localhost:${ PORT }` );
} );

// unhandled promise rejection
process.on( 'unhandledRejection', ( err ) => {
    console.log( `Error: ${ err.message }` );
    console.log( `Shutting down the server due to Unhandled Promise Rejection` );
    server.close( () => {
        process.exit( 1 );
    } );
} );