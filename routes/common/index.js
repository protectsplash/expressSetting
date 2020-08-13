let express = require('express');
let router = express.Router();
let caller = require('caller');
let asyncjs = require('async');
let xss = require('xss');
let jwt = require('jsonwebtoken');
let jwt_obj = require(`${__appbase}/confs/secretkey.js`);
let uniqid = require('uniqid');
const shortid = require('shortid');
shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_');
var Sequelize = require('sequelize');
const Op = Sequelize.Op;

let sequelizeconn = require(`${__appbase}/libs/common/sequelizeconn`);
let globalconf = require(`${__appbase}/confs/globalconf.js`);

const runtime_exception = require(`${__appbase}/libs/common/runtime_error`);

// ---------------------------------------------------------------------------
// library common 선언부
let _common = require(`${__appbase}/libs/common`); // *** __common 전역변수를 위한 선언이기도 함
let _d = __common.d;
let _u = __common.u;

const logger = require(`${__appbase}/libs/common/logger`);

/** //////////////////////////////////////////////////////////////////////////
 backend api v1 global main
 http://127.0.0.1:10080/api/v1/dev/%api name%
 */
const _prefix = 'routes::api::v1';
const _api_prefix = '/api/v1';

class gblmain {
  constructor() {
    _d.tlog(`${_prefix}::constructor [${_d.removePrefix(caller())}]`
      //+ `\n\tclass location: ${__filename}`
      //+ `\n\t${path.basename(__filename)} on ${require.main.filename}`
      //+ `\n\tcaller: ${caller()}`
    );
    this.xssflt = async (cont) => {
      let xsscont = await xss(cont, {
        onIgnoreTagAttr: function(tag, name, value, isWhiteAttr) {
          // Parameters are the same with onTagAttr
          // If a string is returned, the value would be replaced with this string
          // If return nothing, then keep default (remove the attribute)
          // -----
          // _d.tlog(`tag: ${tag}`);
          // _d.tlog(`name: ${name}`);
          // _d.tlog(`value: ${value}`);
          // _d.tlog(`isWhiteAttr: ${isWhiteAttr}`);
          if (value.indexOf('quill') !== -1) { return `${name}="${value}"`; }
          else if (name === 'lnk') { return `${name}="${value}"`; }
          else if (tag === 'span' && name === 'id') { return `${name}="${value}"`; }
          else if (tag === 'span' && name === 'contenteditable') { return `${name}="${value}"`; }
          // -----
          if (-1 !== value.indexOf('ql-')) { return `${name}="${value}"`; }
          else if (name === 'style') { return `${name}="${value}"`; }
        }
      });
      return xsscont;
    }
    this.genshortid = () => { return shortid.generate().replace(/[-_]/gi, '0'); }
    // -------------------------------------------------------------
    this._common = __common;
    this._apidefs = require('./apidefs');
    this._err_def = require(`${__appbase}/libs/common/errdef`);
    // -----
    this._email = require(`${__appbase}/libs/common/smtpmail`);
    this._knoxmail = require(`${__appbase}/libs/common/knoxmail`);
    //_d.tlog(`email sender: ${this.email.conf.auth.user}`);
    this._sendmail = {};
    this._mailsender = '';
    if (globalconf.use_knoxmail) {
      this._sendmail = this.knoxmail.funcs.sendmail;
      this._mailsender = this.knoxmail.conf.sender;
    }
    else {
      this._sendmail = this.email.funcs.sendmail;
      this._mailsender = this.email.conf.auth.user;
    }
    // -----
    this._sequelize_opts = {
      timezone: 'Asia/Seoul', //'+09:00',
      dialectOptions: {
        charset: 'utf8mb4',
        dateStrings: true,
        typeCast: true,
        timezone: 'Asia/Seoul'
      },
      pool: {
        max: 20,
        min: 0,
        acquire: 30000,
        idle: 10000
      },
      define: {
        timestamps: true
      },
      models_path: `${__dirname}/../models`,
      logging: (...msg) => {
        logger.funcs.query(msg[0]);
        if (__debug_mode) {
          _d.tlog(msg[0]);
        }
      }
    }
    this._sequelizeconn = new sequelizeconn(this._sequelize_opts);
    this._mariadbconf = require(`${__appbase}/confs/mariadb_r0ev_com.json`);
    this._api_test_pages = {
      prep_test_page_context: this.prep_test_page_context.bind(this),
      prep_modify_test_page_context: this.prep_modify_test_page_context.bind(this),
      prep_req_test_page_context: this.prep_req_test_page_context.bind(this)
    }
    this._api_utils = {
      fltprms:           this.filter_params.bind(this),
    }
    this._api_funcs = {
      forcelogout:      this.jwt_force_logout.bind(this), // promise / internal use
      accesscheck:      this.jwt_access_check.bind(this),
      accessrestore:    this.jwt_access_restore.bind(this),
      // -----
      authcheck:        this.auth_check.bind(this),
      // -----
      checklicvalidity: this.check_lic_validity.bind(this),
      // -----
      logging:          this.api_logging.bind(this),
      // -----
      apires:           this.api_response.bind(this),
    }
    this._dev_funcs = {
      envcheck:         this.dev_envcheck.bind(this),
    }
    // -------------------------------------------------------------
    this._britycrypt = {
      seq: 0,
      num () {
        return this.seq++
      },
      en:             this.britycrypt_encrypt.bind(this),
      de:             this.britycrypt_decrypt.bind(this),
    }
    // -------------------------------------------------------------
  }

  get common () { return this._common; }
  get dbs () { return this._sequelizeconn.dbs(); }
  get orm () { return this._sequelizeconn.orm(); }
  get apidefs () { return this._apidefs; }
  get apiutils () { return this._api_utils; }
  get errdef () { return this._err_def; }
  get email () { return this._email; }
  get knoxmail () { return this._knoxmail; }
  get sendmail () { return this._sendmail; }
  get mailsender () { return this._mailsender; }
  get sequelize () { return this._sequelizeconn; }
  get api_test_pages () { return this._api_test_pages; }
  get api_funcs () { return this._api_funcs; }
  get dev_funcs () { return this._dev_funcs; }
  get britycrypt () { return this._britycrypt; }

  ////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////

  prep_test_page_context (req, res, next) {
    _d.tlog(`GET ${_api_prefix}${req.url} ; ${_prefix}::prep_test_page_context ; -`);

    if (! __dev_mode) {
      return res.json({ err: 0, msg: 'hello'});
    }

    let api_name = req.route.path.replace('/', '');
    let api_info = this.apidefs.spec(api_name);
    let api_page = `./api/test/api_test`;

    let api_postUrl = `${_api_prefix}/${api_info.url}`;

    if (Object.keys(req.query).length) {
      Object.keys(req.query).forEach((k) => {
        //_d.tlog(`${k} ${req.query[k]}`);
      });
      let query = req.url.replace(req.route.path, "");
      //_d.tlog(`url query: ${query}`);
      api_postUrl = `${api_postUrl}${query}`;
    }

    req.pageRenderContext = {
      api_no: api_name,
      api_info: api_info,
      api_page: api_page,
      api_postUrl: api_postUrl,
    }

    return next();
  }

  prep_modify_test_page_context (req, res, next) {
    _d.tlog(`GET ${_api_prefix}${req.url} ; ${_prefix}::prep_modify_test_page_context ; -`);

    if (! __dev_mode) {
      return res.json({ err: 0, msg: 'hello'});
    }

    let api_name = req.route.path.replace('/:id', '');
    api_name = api_name.replace('/', '');
    let api_info = this.apidefs.spec(api_name);
    let api_page = `./api/test/api_test`;

    let api_postUrl = `${_api_prefix}/${api_info.url}`;

    if (Object.keys(req.query).length) {
      Object.keys(req.query).forEach((k) => {
        //_d.tlog(`${k} ${req.query[k]}`);
      });
      let query = req.url.replace(req.route.path, "");
      //_d.tlog(`url query: ${query}`);
      api_postUrl = `${api_postUrl}${query}`;
    }

    req.pageRenderContext = {
      api_no: api_name,
      api_info: api_info,
      api_page: api_page,
      api_postUrl: api_postUrl,
    }

    return next();
  }

  prep_req_test_page_context (req, res, next) {
    _d.tlog(`GET ${_api_prefix}${req.url} ; ${_prefix}::prep_req_test_page_context ; -`);

    if (! __dev_mode) {
      return res.json({ err: 0, msg: 'hello'});
    }

    let api_name = req.route.path.replace('/req/', '');
    let api_info = this.apidefs.spec(api_name);
    let api_page = `./api/test/api_test`;

    let api_postUrl = `${_api_prefix}/${api_info.url}`;

    if (Object.keys(req.query).length) {
      Object.keys(req.query).forEach((k) => {
        //_d.tlog(`${k} ${req.query[k]}`);
      });
      let query = req.url.replace(req.route.path, "");
      //_d.tlog(`url query: ${query}`);
      api_postUrl = `${api_postUrl}${query}`;
    }

    req.pageRenderContext = {
      api_no: api_name,
      api_info: api_info,
      api_page: api_page,
      api_postUrl: api_postUrl,
    }

    return next();
  }

  ////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////

  filter_params (params, model) {
    let item = {};
    Object.keys(params).forEach(field_nm => {
      if (model.rawAttributes[field_nm] !== undefined) {
        if (model.rawAttributes[field_nm].type.key === 'STRING') {
          item[field_nm] = String(params[field_nm]);
        }
        else if (model.rawAttributes[field_nm].type.key === 'INTEGER') {
          item[field_nm] = Number(params[field_nm]);
        }
        else {
          item[field_nm] = params[field_nm];
        }
      }
    });
    return item;
  }

  ////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////

  /** --------------------------------------------------------------
   */
  async jwt_force_logout (req, res) {
    _d.tlog(`${_prefix}::jwt_force_logout ; -`);
    return new Promise((resolve) => {
      _d.tlog(`force logout session: ${_u.toPrettyJson(req.session)}`);

      let userid = '';
      const models = this.dbs;
      asyncjs.waterfall([
        (cb) => {
          let rets = [];
          (async () => {
            try {
              //req.session.destroy();
              _d.tlog(`cookies: ${_u.toPrettyJson(req.cookies)}`);
              _d.tlog(`signedCookies: ${_u.toPrettyJson(req.signedCookies)}`);
              Object.keys(req.signedCookies).forEach(cookie => {
                res.clearCookie(cookie);
              });
              if (_u.isNull(req.session)) {
                cb(new Error('null == req.session'));
                return ;
              }
              if (_u.isNotNull(req.session.lgnid)) {
                await models.userlogin.update({ ssid: '' }, { where: { emailid: req.session.lgnid} });
              }
              if (_u.isNull(req.session.data)) {
                return resolve(0);
              }
              userid = req.session.data.userid;
              // -----
              let ret = {
                userid: userid
              }
              // -----
              if (! _u.isNullStr(userid)) {
                await models.user.update(
                    { tokenupd: '' },
                    { where: { emailid: userid, sysstat: 1 } }
                );
                await this.orm.query(_u.sqlpf(`DELETE FROM sessions where lgnid = ?`, userid));
              }
              req.session.destroy(function(err) {
                if (err) {
                  return cb(err);
                }
                return cb(null, rets);
              });
            }
            catch (err) {
              _d.terr(err.stack);
              cb(err);
            }
          })();
        },
      ], (err, results) => {
        if (err) {
          _d.terr(err.message);
          resolve(0);
          return ;
        }
        resolve(1);
      });
    });
  }

  /** --------------------------------------------------------------
   GET /api/hello
   */
  jwt_access_check (req, res, next) {
    _d.tlog(`GET ${_api_prefix} ; ${_prefix}::jwt_access_check ; -`);

    const models = this.dbs;
    (async () => {
      let ret = {
        err: -1,
        desc: '',
        data: {}
      }
      let token = '';
      try {
        token = req.signedCookies.access_key;
        if (! _u.isNullStr(req.body.access_key)) {
          token = req.body.access_key;
        }
        if (_u.isNotNull(req.headers.sdskey)) {
          token = req.headers.sdskey;
        }
        if (_u.isNullStr(token)) {
          throw new runtime_exception('토큰을 확인할 수 없습니다.', '0020', {});
        }
        // -----
        let decoded = await jwt.verify(token, jwt_obj.secret);
        //_d.tlog(`jwt_access_check: session => ${_u.toPrettyJson(req.session)}`);
        if (_u.isNull(req.session.lgnid)) {
          let session = await models.sessions.findOne({ where: { sid: decoded.sid } });
          if (_u.isNull(session)) {
            throw new runtime_exception('세션이 만료되었습니다.', '0023', {} );
          }
          let ssdata = JSON.parse(session.dataValues.data);
          _d.tlog(_u.toPrettyJson(ssdata));
          if (_u.isNotNull(ssdata.uid)) req.session.uid = ssdata.uid;
          if (_u.isNotNull(ssdata.lgnid)) req.session.lgnid = ssdata.lgnid;
          if (_u.isNotNull(ssdata.data)) req.session.data = _u.deepcopy(ssdata.data);
          // 기존 세션으로 접속해 올 수 있기 때문에 직접 삭제하지 않고 유효기간 만료 자동삭제까지 보관한다.
          //await sessions.destroy({ where: { sid: decoded.sid }});
        }
        // -----
        if (req.session.lgnid === decoded.emailid) {
          if (_u.isNull(req.session.data)) {
            throw new runtime_exception('올바르지 않은 세션 접근입니다.', '0023', {} );
          }
          // -----
          if (decoded.vk !== _u.sha256(req.session.data.userinfo.pwdsalt)) {
            throw new runtime_exception('올바르지 않은 토큰입니다.', '0020', {} );
          }
          // -----
          return next();
        }
        // -----
        throw new runtime_exception('토큰을 확인할 수 없습니다.', '0020', {} );
      }
      catch (err) {
        _d.terr(err.message);
        if (err instanceof runtime_exception) {
          ret = this.errdef.report(err);
        }
        else if (err.name === 'TokenExpiredError') {
          ret = this.errdef.err('0022', err);
        }
        else if (err.name === 'JsonWebTokenError') {
          ret = this.errdef.err('0024', err);
        }
        else {
          ret = this.errdef.err('9999', err);
        }
        if (err.name !== 'TokenExpiredError') {
          await this.api_funcs.forcelogout(req, res);
        }
        res.json(ret);
      }
    })();
  }

  /** --------------------------------------------------------------
   GET /api/hello
   */
  jwt_access_restore (req, res, next) {
    _d.tlog(`GET ${_api_prefix} ; ${_prefix}::jwt_access_restore ; -`);

    const models = this.dbs;
    (async () => {
      let ret = {
        err: -1,
        desc: '',
        data: {}
      }
      let token = '';
      // -----
      try {
        token = req.signedCookies.access_key;
        if (! _u.isNullStr(req.body.access_key)) {
          token = req.body.access_key;
        }
        if (_u.isNull(req.headers.sdskey)) {
          token = null;
          await this.api_funcs.forcelogout(req, res);
          next();
          return ;
        }
        else {
          token = req.headers.sdskey;
        }
        if (_u.isNullStr(token)) {
          next();
          return ;
        }
        // -----
        let decoded = jwt.verify(token, jwt_obj.secret);
        if (_u.isNull(decoded)) {
          next();
          return ;
        }
        // -----
        //_d.tlog(`jwt_access_check: session => ${_u.toPrettyJson(req.session)}`);
        if (_u.isNull(req.session.lgnid)) {
          let session = await models.sessions.findOne({ where: { sid: decoded.sid } });
          if (_u.isNull(session)) {
            throw new runtime_exception('세션이 만료되었습니다.', '0023', {});
          }
          let ssdata = JSON.parse(session.dataValues.data);
          _d.tlog(_u.toPrettyJson(ssdata));
          if (_u.isNotNull(ssdata.uid)) req.session.uid = ssdata.uid;
          if (_u.isNotNull(ssdata.lgnid)) req.session.lgnid = ssdata.lgnid;
          if (_u.isNotNull(ssdata.data)) req.session.data = _u.deepcopy(ssdata.data);
          // 기존 세션으로 접속해 올 수 있기 때문에 직접 삭제하지 않고 유효기간 만료 자동삭제까지 보관한다.
          //await sessions.destroy({ where: { sid: decoded.sid }});
          // -----
        }
        // -----
        if (req.session.lgnid === decoded.emailid) {
          if (_u.isNull(req.session.data)) {
            throw new runtime_exception('올바르지 않은 세션 접근입니다.', '0023', {} );
          }
          // -----
          if (decoded.vk !== _u.sha256(req.session.data.userinfo.pwdsalt)) {
            throw new runtime_exception('올바르지 않은 토큰입니다.', '0020', {} );
          }
        }

        next();
      }
      catch (err) {
        (async () => {
          _d.terr(err.message);
          if (err instanceof runtime_exception) {
            ret = this.errdef.report(err);
          }
          else if (err.name === 'TokenExpiredError') {
            ret = this.errdef.err('0022', err);
          }
          else if (err.name === 'JsonWebTokenError') {
            ret = this.errdef.err('0024', err);
          }
          else {
            ret = this.errdef.err('9999', err);
          }
          // -----
          if (err.name !== 'TokenExpiredError') {
            await this.api_funcs.forcelogout(req, res);
          }
          // -----
          res.json(ret);
        })();
      }
    })();
  }

  auth_check (req, res, next) {
    _d.tlog(`POST ${_api_prefix}${req.url} ; ${_prefix}::auth_check ; -`);

    let json_param = req.body;
    let user_info = {
      emailid: req.body.user_id,
      access_token: req.body.user_tokenKey
    }
    delete json_param.user_id;
    delete json_param.user_tokenKey;
    // -----
    const models = this.dbs;
    (async () => {
      try {
        if (_u.isNull(req.session.data)) {
          //return res.json(this.errdef.err('0030', null));
          throw new runtime_exception('비정상적인 접근입니다. (세션)', '0030', { } );
        }
        //_d.tlog(`auth_check::session.data: ${_u.toPrettyJson(req.session.data)}`);
        user_info.emailid = req.session.data.userid;

        let user = await models.user.findOne({ where: { id: req.session.data.id },
          attributes: ['id', 'tokenupd', 'usrstate', 'emailid'] });
        if (_u.isNull(user)) {
          //await this.api_funcs.forcelogout(req, res);
          throw new runtime_exception('비정상적인 접근입니다. (레코드)', '0030', { id: req.session.data.id } );
        }
        if ('' === user.tokenupd) {
          await this.api_funcs.forcelogout(req, res);
          throw new runtime_exception('비정상적인 접근입니다. (토큰)', '0030', { emailid: user.emailid } );
        }
        // -----
        if (! [1, 2].includes(user.usrstate)) {
          //await this.api_funcs.forcelogout(req, res);
          throw new runtime_exception('비정상적인 접근입니다. (보안)', '0090', { emailid: user.emailid } );
        }
        // -----

        let api_name = req.route.path.replace('/', '');
        let api_spec = this.apidefs.spec(api_name);

        let item = {};
        let api_fltering = true;
        if (req.method.toLowerCase() === 'post' && ! _u.isNull(api_spec)) {
          if (! _u.isNull(api_spec.input_crypt)) {
            if (api_spec.input_crypt) {
              api_fltering = false;
            }
          }
        }
        else {
          api_fltering = false;
        }

        if (api_fltering) {
          // api spec field filtering
          Object.keys(json_param).forEach(field => {
            if (undefined !== api_spec.input_param.filter(attr => field === attr.key)[0]) {
              item[field] = json_param[field];
            }
          });
        }
        else {
          item = json_param;
        }

        let auth_context = {
          user_info: user_info,
          json_param: item
        }
        req.auth_context = auth_context;

        next();
      }
      catch (err) {
        if (err) {
          await this.api_funcs.forcelogout(req, res);
          _d.terr(err.message);
          if (err instanceof runtime_exception) {
            return res.json(this.errdef.report(err));
          }
          return res.json(this.errdef.unknown(err.message, []));
        }
      }
    })();
  }

  async check_lic_validity (cpnyId) {
    _d.tlog(`${_prefix}::check_lic_validity ; -`);
    return new Promise((resolve) => {
      const models = this.dbs;
      asyncjs.waterfall([
        (cb) => {
          (async () => {
            let today = _u.basic_datetime_stamp();

            let rows = await models.lic.findAll({
              where: {
                clientId: cpnyId,
                state: 2,
                licsdt: { [Op.lte]: Date.parse(today) },
                //licedt: { [Op.between]: [Date.parse(today), Date.parse(today)] },
                licedt: { [Op.gte]: Date.parse(today) },
              }
            });

            _d.tlog(`rows length: ${rows.length}`);

            cb(null, rows);
          })();
        }
      ], (err, results) => {
        if (err) {
          _d.terr(err.message);
          return resolve(false);
        }
        if (results.length > 0)
          return resolve(true);
        else
          return resolve(false);
      });
    });
  }

  api_logging (req, res, next) {
    _d.tlog(`${_api_prefix}${req.url} ; ${_prefix}::api_logging ; -`);
    const models = this.dbs;
    (async () => {
      let apilog = {}
      try {
        apilog = {
          apipath: req.route.path,
          inprm: res.logging.inprm,
          outprm: res.logging.outprm,
          emailid: req.session.data.userid,
          rmtip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
          useragent: req.useragent,
          userId: req.session.data ? req.session.data.id : 0
        }
        models.apilog.create(apilog);
        // -----
        res.json(res.logging.outprm);
      }
      catch (err) {
        if (err) {
          _d.terr(err.stack);
        }
      }
    })();
  }

  api_response (err, results, req, res, next, logging, inprm) {
    _d.tlog(`${_api_prefix}${req.url} ; ${_prefix}::api_response ; -`);

    (async () => {
      try {
        let apires = {};
        // -----
        if (err) {
          _d.terr(err.message);
          if (err instanceof runtime_exception) {
            apires = this.errdef.report(err);
          }
          else if ('SequelizeUniqueConstraintError' === err.name) {
            if (__debug_mode)
              apires = this.errdef.report(new runtime_exception('데이터베이스 오류', '9000', { check: err.original.message }));
            else
              apires = this.errdef.report(new runtime_exception('데이터베이스 오류', '9000', {}));
          }
          else if ('SequelizeValidationError' === err.name) {
            if (__debug_mode)
              apires = this.errdef.report(new runtime_exception(err.message, '9000', { errors: err.errors }));
            else
              apires = this.errdef.report(new runtime_exception(err.message, '9000', {}));
          }
          else {
            if (__debug_mode)
              apires = this.errdef.unknown(err.message, {});
            else
              apires = this.errdef.unknown('처리되지 않은 오류입니다.', []);
          }
        }
        else {
          apires = this.errdef.success(results);
        }
        // -----
        if (logging) {
          res.logging = {
            inprm: inprm,
            outprm: apires,
          }
          if (_u.isNull(next)) {
            return this.api_funcs.logging(req, res, next);
          }
          else {
            return next();
          }
        }
        // -----
        res.json(apires);
      }
      catch (err) {
        if (err) {
          _d.terr(err.stack);
        }
      }
    })();
  }

  ////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////

  dev_envcheck (req, res, next) {
    _d.tlog(`${_prefix}::dev_envcheck ; -`);

    if (! __dev_mode) {
      return res.json({ err: 0, msg: 'hello'});
    }

    return next();
  }

  ////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////

  britycrypt_encrypt(obj, key) {
    let encobj = {
      //seq: this.britycrypt.num()
      seq: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    }
    encobj.data = _u.encrypt(JSON.stringify(obj), key, `20${encobj.seq}19`);
    return encobj;
  }

  britycrypt_decrypt(encobj, key) {
    return JSON.parse(_u.decrypt(encobj.data, key, `20${encobj.seq}19`));
  }

  ////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////
}

let _gblmain = new gblmain();

// ---------------------------------------------------------------------------

module.exports = _gblmain;
