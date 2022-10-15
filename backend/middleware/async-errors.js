export default ( asyncErrors ) => ( req, res, next ) => {
    Promise.resolve( asyncErrors( req, res, next ) ).catch( next )
}