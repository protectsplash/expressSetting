global.__appbase = __dirname.split('\\').join('/');

var express           = require('express');
var app               = express();
var createError       = require('http-errors');
var path              = require('path');
var cookieParser      = require('cookie-parser');
const session         = require('express-session');
var redisClient       = require('./redis.js');
const RedisStore      = require('connect-redis')(session);
var logger            = require('morgan');
var bodyParser        = require('body-parser')
var cors              = require('cors');
var fallback          = require('connect-history-api-fallback');
const helmet          = require('helmet');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  limit: '150mb',
  extended: false,
}));


var allowed_origins = require('./config/allowed_origins');
app.use(helmet());
app.disable('x-powered-by')
// cors 설정
app.use(cors({
  origin: function(origin, callback) {
    if (! origin) return callback(null, true);
    if (allowed_origins.indexOf(origin) === -1) {
      var msg = 'The CORS policy for this site does not ' +
        'allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));
const store =  new RedisStore({
                  logErrors: true,
                  client: redisClient,
                  prefix : "session:::",
                  ttl: 86400,
                  db: 0
               })
// 세션 설정
app.use(session({
  key: 'accessToekn',
  secret: 'protectmasterkey',
  resave: false,
  saveUninitialized: false,
  cookie: {
    path: '/', httpOnly: true,
    maxAge: 24000 * 60 * 60 // 쿠키 유효기간 24시간
  },
  store,
}))

//권한 설정
app.use(function(req, res, next) {
  const sessionURLGET = ['/user', '/logout']
  const sessionURLPOST = ['/user', '/logout']
  const sessionURLPUT = ['/user', '/logout']
  if(req.method === 'GET'){
    if(sessionURLGET.indexOf('/'+req.url.split('/')[1]) > -1){
      if(req.session.user === undefined){
        return res.status(403).json({ error: '권한이 없습니다.' })
      }
    }
  }
  if(req.method === 'POST'){
    if(sessionURLPOST.indexOf('/'+req.url.split('/')[1]) > -1){
      if(req.session.user === undefined){
        return res.status(403).json({ error: '권한이 없습니다.' })
      }
    }
  }
  if(req.method === 'PUT'){
    if(sessionURLPUT.indexOf('/'+req.url.split('/')[1]) > -1){
      if(req.session.user === undefined){
        return res.status(403).json({ error: '권한이 없습니다.' })
      }
    }
  }
  next()
});

// 환경변수를 위한 dotenv 설치
require('dotenv').config();

// 스웨거 설정 - swagger 접속 url- '/api-docs'
const expressSwagger = require('express-swagger-generator')(app);
let options = {
  swaggerDefinition: {
      info: {
          description: 'express 셋팅 API',
          title: 'Splash의 API 셋팅',
          version: '0.1',
      },
      host: 'localhost:3000',
      basePath: '/',
      produces: [
          "application/json",
          "application/xml"
      ],
      schemes: ['http', 'https'],
      securityDefinitions: {
          JWT: {
              type: 'apiKey',
              in: 'header',
              name: 'Authorization',
              description: "",
          }
      }
  },
  basedir: __dirname, //app absolute path
  files: ['./routes/*.js'] //Path to the API handle folder
};
if(process.env.NODE_ENV !== 'production'){
  expressSwagger(options)
}





// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var indexRouter     = require('./routes/index');
var usersRouter     = require('./routes/users');
var noticeRouter     = require('./routes/users');
const { script } = require('./redis.js');

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/notice', noticeRouter);

app.use(fallback(
  // {
  //   index: '/index.html', // Override the index (default /index.html)
  //   rewrites: [
  //     { from: /^\/api\/.*$/, to: function(context) {
  //         return `${context.parsedUrl.pathname.split('api/')[1]}`;
  //       }
  //     }
  //   ],
  //   verbose: false,
  // }
));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
