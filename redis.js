var redis = require('redis');
const port = 6379
const host = 'localhost'
const password = "ddec437eeb1da25a146a24c432d1165bc646daa7fecc6aa14c636265c83caa14"
var redisClient = redis.createClient(port,host);
redisClient.auth(password, function (err) {
    if (err) throw err;
});
redisClient.on('error', function(err) {
    console.log('Redis error: ' + err);
}); 

module.exports = redisClient