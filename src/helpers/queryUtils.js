// import aqp from 'api-query-params';

// /**
//  * Apply pagination to a mongoose query
//  * @param {Object} query - Mongoose query object
//  * @param {Object} options - Pagination options
//  * @returns {Object} Modified query and pagination metadata
//  */
// const paginate = (query, options = {}) => {
//   const page = parseInt(options.page, 10) || 1;
//   const limit = parseInt(options.limit, 10) || 10;
//   const skip = (page - 1) * limit;

//   query = query.skip(skip).limit(limit);

//   return {
//     query,
//     pagination: {
//       page,
//       limit,
//     },
//   };
// };

// /**
//  * Parse API query parameters for filtering, sorting, pagination
//  * @param {Object} req - Express request object
//  * @param {Object} options - Additional options
//  * @returns {Object} Parsed query parameters
//  */
// const parseQueryParams = (req, options = {}) => {
//   const { 
//     filter = {}, 
//     skip = 0, 
//     limit = 10, 
//     sort = {}, 
//     projection = {}, 
//     population = [] 
//   } = aqp(req.query, options);

//   // Handle default pagination
//   const page = Math.floor(skip / limit) + 1;
  
//   return {
//     filter,
//     pagination: {
//       page,
//       limit,
//     },
//     sort,
//     projection,
//     population
//   };
// };

// /**
//  * Format response with pagination metadata
//  * @param {Array} data - Data array
//  * @param {Object} pagination - Pagination options
//  * @param {number} totalCount - Total count of documents
//  * @returns {Object} Response with data and pagination metadata
//  */
// const formatPaginatedResponse = (data, pagination, totalCount) => {
//   const { page, limit } = pagination;
//   const totalPages = Math.ceil(totalCount / limit);
  
//   return {
//     data,
//     pagination: {
//       page,
//       limit,
//       totalCount,
//       totalPages,
//       hasNextPage: page < totalPages,
//       hasPrevPage: page > 1,
//     },
//   };
// };

// export { paginate, parseQueryParams, formatPaginatedResponse }; 