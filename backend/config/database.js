import mongoose from "mongoose";

const databaseConnection = () => {
    mongoose.connect( process.env.MONGODB_URI )
        .then( () => console.log( 'Database Connected Successfully...' ) );
    // .catch( e => console.log( `Error: ${ e.message }` ) );
};

export { databaseConnection };