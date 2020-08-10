/**
 * This function comment is parsed by doctrine
 * @route GET /
 * @group foo - Operations about user
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 */
/**
 * @typedef Product
 * @property {integer} id
 * @property {string} name.required - Some description for product
 * @property {Array.<Point>} Point
 */

/**
 * @typedef Point
 * @property {integer} x.required
 * @property {integer} y.required - Some description for point - eg: 1234
 * @property {string} color
 * @property {enum} status - Status values that need to be considered for filter - eg: available,pending
 */

/**
 * @typedef Error
 * @property {string} code.required
 */

/**
 * @typedef Response
 * @property {[integer]} code
 */


/**
 * This function comment is parsed by doctrine
 * sdfkjsldfkj
 * @route POST /users
 * @param {Point.model} point.body.required - the new point
 * @group foo - Operations about user
 * @param {string} email.query.required - username or email
 * @param {string} password.query.required - user's password.
 * @param {enum} status.query.required - Status values that need to be considered for filter - eg: available,pending
 * @operationId retrieveFooInfo
 * @produces application/json application/xml
 * @consumes application/json application/xml
 * @returns {Response.model} 200 - An array of user info
 * @returns {Product.model}  default - Unexpected error
 * @returns {Array.<Point>} Point - Some description for point
 * @headers {integer} 200.X-Rate-Limit - calls per hour allowed by the user
 * @headers {string} 200.X-Expires-After - 	date in UTC when token expires
 * @security JWT
 */
var express = require('express');
var router = express.Router();
import path from 'path'

/* GET home page. */
router.get('/', function(req, res, next) {
  if (process.env.NODE_ENV === 'production') {
    require('dotenv').config({ path: path.join(__dirname, '../.env.production') })
    res.send(require('dotenv').config({ path: path.join(__dirname, '../.env.production') }).parsed.DB_NAME)
  } else if (process.env.NODE_ENV === 'develop') {
    require('dotenv').config({ path: path.join(__dirname, '../.env.develop') })
    res.send(require('dotenv').config({ path: path.join(__dirname, '../.env.develop') }).parsed.DB_NAME)
  } else {
    res.send('개발중!11')
    // throw new Error('process.env.NODE_ENV를 설정하지 않았습니다!')
  }
});

module.exports = router;
