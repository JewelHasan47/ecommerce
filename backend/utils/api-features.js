class ApiFeatures {
    // main constructor
    constructor( query, queryString ) {
        this.query = query;
        this.queryString = queryString;
    }

    // search in backend
    search = () => {
        const keyword = this.queryString.keyword ? {
            name: {
                $regex: this.queryString.keyword,
                $options: 'i'
            }
        } : {};
        this.query = this.query.find( { ...keyword } );
        return this;
    };

    // filter in backend
    filter = () => {
        // copy the Query String
        const copyQuery = { ...this.queryString };

        // removing some fields for category
        const removeFields = [ 'keyword', 'page', 'limit' ];
        removeFields.forEach( key => delete copyQuery[ key ] );

        // filter for price and rating
        let queryString = JSON.stringify( copyQuery );
        queryString = queryString.replace( /\b(gt|gte|lt|lte)\b/g, key => `$${ key }` );
        this.query = this.query.find( JSON.parse( queryString ) );
        return this;
    };

    // pagination
    pagination = ( resultPerPage ) => {
        const currentPage = Number( this.queryString.page ) || 1;
        const skip = resultPerPage * ( currentPage - 1 );
        this.query = this.query.limit( resultPerPage ).skip( skip );
        return this;
    };
}

export default ApiFeatures;