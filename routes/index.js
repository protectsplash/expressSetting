/**
 * This function comment is parsed by doctrine
 * @route GET /
 * @group foo - Operations about user
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - 에러발생
 */
var express = require('express');
var router = express.Router();
var models = require('../models')
var crypto = require('crypto')

/* GET home page. */

router.get('/user', async function(req, res, next) {
  var ip = req.headers['x-forwarded-for'] ||
           req.connection.remoteAddress ||
           req.socket.remoteAddress ||
           req.connection.socket.remoteAddress;
  try {
    const user = await models.users.findAll({offset:Number(req.query.offset), limit:Number(req.query.limit)});
    const userCount = await models.users.count();
    return res.status(200).json({
        user,
        count: userCount
    });
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
});
router.get('/user/:id', async function(req, res, next) {
  try {
    const id = req.params.id
    const user = await models.users.findOne({ where: { id } });
    return res.status(200).json({
        user,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
});

router.post('/signin', async function(req, res, next) {
  try {
    let result = await models.users.findOne({
      where: {
        userId : req.body.userId
      }
    });
    let dbPassword = result.dataValues.password;
    let inputPassword = req.body.password;
    let salt = result.dataValues.salt;
    let hashPassword = crypto.createHash("sha512").update(inputPassword + salt).digest("hex");
    if(dbPassword === hashPassword){
      req.session.user = req.body.userId;
      req.sessionStore.all((_, session)=>{
        session.forEach(e =>{
          if (e.user && e.user === req.body.userId && e.id !== req.sessionID) {
            req.sessionStore.destroy(e.id, error=> {/* redis 오류로 인한 에러 핸들링 */});
          }
        })
      })
      //20.08.13. 현재 전체 store를 서치해서 각각에 데이터를 체크하여 session 중복로그인을 처리하고 있다..
      // 후에 데이터가 많아 졌을때 부하가 많아 질것으로 예상된다. 그것을 어떻게 처리할지 고민해야한다.
      
      // req.sessionStore.prefix = req.body.userId+':::'
      // var key = '*'+req.body.userId+'*';
      // redisClient.keys(key, function(err,keyData){
      //      if(err){
      //         console.log(err);
      //         res.send("error "+err);
      //         return;
      //      }else if(keyData){
      //       keyData.forEach(e =>{
      //         redisClient.get(e, function(err, data){
      //           if(err){
      //             console.log(err);
      //             res.send("error "+err);
      //             return;
      //           }else{
      //             if(JSON.parse(data).user && JSON.parse(data).user === req.body.userId && e.split(':::')[1] !== req.sessionID){
      //               redisClient.del(e)
      //             }
      //           }
      //         })
      //        })
      //      }
      // });
      return res.status(200).json({ info: '로그인 되었습니다!' })
    }else{
      return res.status(400).json({ error: '아이디 혹은 비밀번호가 일치하지 않습니다.' })
    }
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
});
router.post('/', async function(req, res, next) {
  try {
    let body = req.body
    let inputPassword = body.password;
    let salt = Math.round((new Date().valueOf() * Math.random())) + "";
    let hashPassword = crypto.createHash("sha512").update(inputPassword + salt).digest("hex");
    body.password = hashPassword
    body.salt = salt
    const user = await models.users.create(body);
    return res.status(200).json({
        user,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
});
router.put('/', async function(req, res, next) {
  try {
    const body = req.body
    const userId = req.body.id
    const user = await models.users.update(body, {where:{ id:userId }});
    return res.status(200).json({
        user,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
});
router.put('/reset-password', async function(req, res, next) {
  try {
    const body = req.body
    const userId = req.body.id
    const userSearch = await models.users.findOne({ where: { id:userId } });
    const inputPassword = req.body.password
    let hashPassword = crypto.createHash("sha512").update(inputPassword + userSearch.dataValues.salt).digest("hex");
    body.password = hashPassword
    const user = await models.users.update(body, {where:{ id:userId }});
    return res.status(200).json({
        user,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
});
router.delete('/:id', async function(req, res, next) {
  try {
    const id = req.params.id
    const user = await models.users.destroy({where:{ id }});
    return res.status(200).json({
        user,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
});

router.get("/logout", function(req,res,next){
  req.sessionStore.destroy(req.sessionID, error=> {/* redis 오류로 인한 에러 핸들링 */});
  req.session.destroy();
  res.clearCookie('accessToekn');
  return res.status(200).json({ info: '로그아웃 되었습니다.' });
})
// router.get('/', function(req, res, next) {
//   if (process.env.NODE_ENV === 'production') {
//     // dotenv.config({ path: path.join(__dirname, '../.env.production') })
//     res.send(dotenv.config({ path: path.join(__dirname, '../.env.production') }).parsed.DB_NAME)
//   } else if (process.env.NODE_ENV === 'develop') {
//     // dotenv.config({ path: path.join(__dirname, '../.env.develop') })
//     res.send(dotenv.config({ path: path.join(__dirname, '../.env.develop') }).parsed.DB_NAME)
//   } else {
//     res.send('개발중!11')
//     // throw new Error('process.env.NODE_ENV를 설정하지 않았습니다!')
//   }
// });

module.exports = router;
