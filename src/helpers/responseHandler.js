// /**
//  * Standard API response format
//  */
// class ResponseHandler {
//   /**
//    * Success response
//    * @param {object} res - Express response object
//    * @param {number} statusCode - HTTP status code
//    * @param {string} message - Success message
//    * @param {*} data - Response data
//    * @returns {object} Response
//    */
//   static success(res, statusCode = 200, message = 'Success', data = {}) {
//     return res.status(statusCode).json({
//       success: true,
//       code: statusCode,
//       message,
//       data
//     });
//   }

//   /**
//    * Error response
//    * @param {object} res - Express response object
//    * @param {number} statusCode - HTTP status code
//    * @param {string} message - Error message
//    * @param {*} errors - Error details
//    * @returns {object} Response
//    */
//   static error(res, statusCode = 500, message = 'Internal Server Error', errors = null) {
//     return res.status(statusCode).json({
//       success: false,
//       code: statusCode,
//       message,
//       errors
//     });
//   }
// }

// export default ResponseHandler; 