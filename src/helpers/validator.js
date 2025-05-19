// import Joi from 'joi';
// import ApiError from './apiError.js';

// /**
//  * Validate request data against schema
//  * @param {Object} schema - Joi validation schema
//  * @returns {function} Express middleware
//  */
// const validate = (schema) => (req, res, next) => {
//   const validSchema = pick(schema, ['params', 'query', 'body']);
//   const object = pick(req, Object.keys(validSchema));
  
//   const { value, error } = Joi.compile(validSchema)
//     .prefs({ errors: { label: 'key' }, abortEarly: false })
//     .validate(object);

//   if (error) {
//     const errorMessage = error.details
//       .map((detail) => detail.message)
//       .join(', ');
//     return next(new ApiError(400, errorMessage));
//   }
  
//   // Replace request data with validated data
//   Object.assign(req, value);
//   return next();
// };

// /**
//  * Create an object composed of the picked object properties
//  * @param {Object} object - Source object
//  * @param {string[]} keys - Keys to pick
//  * @returns {Object} Object with picked properties
//  */
// const pick = (object, keys) => {
//   return keys.reduce((obj, key) => {
//     if (object && Object.prototype.hasOwnProperty.call(object, key)) {
//       obj[key] = object[key];
//     }
//     return obj;
//   }, {});
// };

// export { validate, pick }; 