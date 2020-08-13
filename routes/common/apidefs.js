let globalconf = require(`${__appbase}/confs/globalconf.js`);

function null_is_invalid(v) {
  return v !== '';
}

let vhints = {
  null_is_invalid: 'empty value not allowed',
}

const API_DEFS = {
  base_url: globalconf.api_defs.base_url, // 'http://127.0.0.1:10080/api/v1',
  spec (api_name) {
    return this.apis.filter(e => e.url === api_name)[0];
  },
  validate (spec, params) {
    spec.input_param.forEach(p => {
      let p_value = params[Object.keys(params).filter(k => p.key === k)];
      if (p.required) {
        if (p_value === undefined) {
          throw new Error(`param: '${p.key}' is required`);
        }
      }
      if (p.validation !== null) {
        if (! p.validation(p_value)) {
          throw new Error(`param: '${p.key}' validation failed --> ${p.validation_hints}`);
        }
      }
      if (p.type === 'INTEGER') {
        params[p.key] = Number(params[p.key]);
      }
    });

    return params;
  },
  apis: [
    {
      name: '권한그룹 조회',
      tag: '1',
      apicd: 'api0010',
      url: 'authsearch',
      desc: '권한그룹 조회',
      input_param: [
        { key: 'dummy', name: '더미 파라메터', depth: 1, required: false, type: 'STRING', size: '0', desc: '더미데이터', validation: null },
      ]
    },
    {
      name: '권한그룹 추가',
      tag: '2',
      apicd: 'api0020',
      url: 'authinsert',
      desc: '권한그룹 추가',
      input_param: [
        { key: 'nm', name: '권한그룹 이름', depth: 1, required: true, type: 'STRING', size: '0', desc: '생성될 권한 그룹의 이름', validation: (v) => {
          return v !== '';
        }, validation_hints: 'empty value not allowed' },
        { key: 'data', name: '권한 데이터', depth: 1, required: true, type: 'JSON', size: '0', desc: 'JSON 형식 입력', validation: null },
      ]
    },
    {
      name: '권한그룹 수정',
      tag: '3',
      apicd: 'api0030',
      url: 'authmodify',
      desc: '권한그룹 수정',
      input_param: [
        { key: 'id', name: '권한그룹 ID', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '수정할 권한 그룹의 아이디', validation: null },
        { key: 'nm', name: '권한그룹 이름', depth: 1, required: true, type: 'STRING', size: '0', desc: '생성될 권한 그룹의 이름',
          validation: (v) => {
            return v !== '';
          }, validation_hints: 'empty value not allowed' },
        { key: 'data', name: '권한 데이터', depth: 1, required: true, type: 'JSON', size: '0', desc: 'JSON 형식 입력', validation: null },
      ]
    },
    {
      name: '권한그룹 삭제',
      tag: '4',
      apicd: 'api0040',
      url: 'authremove',
      desc: '권한그룹 수정',
      input_param: [
        { key: 'id', name: '권한그룹 ID', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '삭제할 권한 그룹의 아이디',
          validation: (v) => {
            return v !== '';
        }, validation_hints: 'empty value not allowed' },
      ]
    },
    ////////////////////////////////////////////////////////////////
    {
      name: '국가 조회',
      tag: '5',
      apicd: 'api0050',
      url: 'nationsearch',
      desc: '국가 조회',
      input_param: [
        { key: 'loc', name: '언어', depth: 1, required: true, type: 'STRING', size: '0', desc: '한글:ko, 영어:en', validation: null_is_invalid, validation_hints: vhints.null_is_invalid },
      ]
    },
    ////////////////////////////////////////////////////////////////
    {
      name: '회원가입',
      tag: '6',
      apicd: 'api0060',
      url: 'usersignin',
      desc: '회원가입',
      input_param: [
        { key: 'fstnm', name: '이름', depth: 1, required: true, type: 'STRING', size: '0', desc: '이름을 입력해 주세요.', validation: null_is_invalid, validation_hints: vhints.null_is_invalid },
        { key: 'lstnm', name: '성', depth: 1, required: true, type: 'STRING', size: '0', desc: '성을 입력해 주세요.', validation: null_is_invalid, validation_hints: vhints.null_is_invalid },
        { key: 'emailid', name: '이메일', depth: 1, required: true, type: 'STRING', size: '0', desc: '이메일을 입력해 주세요.', validation: null_is_invalid, validation_hints: vhints.null_is_invalid },
        { key: 'pwd', name: '암호', depth: 1, required: true, type: 'STRING', size: '0', desc: '암호를 입력해 주세요.', validation: null_is_invalid, validation_hints: vhints.null_is_invalid },
        { key: 'nationId', name: '국가', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '국가를 선택해주세요.', validation: null_is_invalid, validation_hints: vhints.null_is_invalid },
        { key: 'mobile', name: '전화번호', depth: 1, required: true, type: 'STRING', size: '0', desc: '전화번호를 입력해주세요.', validation: null_is_invalid, validation_hints: vhints.null_is_invalid },
        { key: 'agencynm', name: '회사명', depth: 1, required: true, type: 'STRING', size: '0', desc: '회사명를 입력해주세요.', validation: null_is_invalid, validation_hints: vhints.null_is_invalid },
        { key: 'agencyid', name: '회사ID', depth: 1, required: false, type: 'STRING', size: '0', desc: '회사ID는 라이센스 구매기업 및 파트너에게만 제공됩니다.', validation: null },
        { key: 'marketactyn', name: '마케팅정보동의여부', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '', validation: null },
      ]
    },
    {
      name: '비밀번호 확인',
      tag: '7',
      apicd: 'api0070',
      url: 'userpwdchk',
      desc: '비밀번호 확인',
      input_param: [
        { key: 'pwd', name: '암호', depth: 1, required: true, type: 'STRING', size: '0', desc: '암호를 입력해 주세요.', validation: null_is_invalid, validation_hints: vhints.null_is_invalid },
      ]
    },
    {
      name: '회원 탈퇴',
      tag: '8',
      apicd: 'api0080',
      url: 'usersignout',
      desc: '회원 탈퇴',
      input_param: [
        { key: 'dummy', name: '더미', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '더미값', validation: null },
      ]
    },
    {
      name: '일반 회원으로 전환',
      tag: '9',
      apicd: 'api0090',
      url: 'usersetdefault',
      desc: '일반 회원으로 전환',
      input_param: [
        { key: 'id', name: 'ID', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '회원ID', validation: null_is_invalid, validation_hints: vhints.null_is_invalid },
      ]
    },
    {
      name: '아이디 찾기',
      tag: '10',
      apicd: 'api0100',
      url: 'fdusrid',
      desc: '아이디 찾기',
      input_param: [
        { key: 'fstnm', name: '이름', depth: 1, required: true, type: 'STRING', size: '0', desc: '이름을 입력해 주세요.', validation: null_is_invalid, validation_hints: vhints.null_is_invalid },
        { key: 'lstnm', name: '성', depth: 1, required: true, type: 'STRING', size: '0', desc: '성을 입력해 주세요.', validation: null_is_invalid, validation_hints: vhints.null_is_invalid },
        { key: 'mobile', name: '전화번호', depth: 1, required: true, type: 'STRING', size: '0', desc: '전화번호를 입력해주세요.', validation: null_is_invalid, validation_hints: vhints.null_is_invalid },
      ]
    },
    {
      name: '비밀번호 찾기',
      tag: '11',
      apicd: 'api0110',
      url: 'fdusrpwd',
      desc: '비밀번호 찾기',
      input_param: [
        { key: 'fstnm', name: '이름', depth: 1, required: true, type: 'STRING', size: '0', desc: '이름을 입력해 주세요.', validation: null_is_invalid, validation_hints: vhints.null_is_invalid },
        { key: 'lstnm', name: '성', depth: 1, required: true, type: 'STRING', size: '0', desc: '성을 입력해 주세요.', validation: null_is_invalid, validation_hints: vhints.null_is_invalid },
        { key: 'emailid', name: '이메일', depth: 1, required: true, type: 'STRING', size: '0', desc: '이메일를 입력해주세요.', validation: null_is_invalid, validation_hints: vhints.null_is_invalid },
      ]
    },
    {
      name: '비밀번호 재설정',
      tag: '12',
      apicd: 'api0120',
      url: 'fdusrpwdrst',
      desc: '비밀번호 재설정',
      input_param: [
        { key: 'emailid', name: '이메일', depth: 1, required: true, type: 'STRING', size: '0', desc: '이메일을 입력해 주세요.', validation: null_is_invalid, validation_hints: vhints.null_is_invalid },
        { key: 'pwdrstkey', name: '암호재설정키', depth: 1, required: true, type: 'STRING', size: '0', desc: '', validation: null_is_invalid, validation_hints: vhints.null_is_invalid },
        { key: 'pwd', name: '암호', depth: 1, required: true, type: 'STRING', size: '0', desc: '암호를 입력해 주세요.', validation: null_is_invalid, validation_hints: vhints.null_is_invalid },
      ]
    },
    {
      name: '사용자 조회',
      tag: '13',
      apicd: 'api0130',
      url: 'usersearch',
      desc: '사용자 조회',
      input_param: [
        { key: 'cpnycls', name: '회사분류', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '고객사:1 / 파트너사:2 / 삼성 SDS:3', validation: null },
        { key: 'constate', name: '승인상태', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '승인상태', validation: null },
        { key: 'usrstate', name: '회원상태', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '회원상태', validation: null },
        { key: 'emailid', name: '이메일ID', depth: 1, required: false, type: 'STRING', size: '0', desc: '이메일ID', validation: null },
        { key: 'cls', name: '회원구분', depth: 1, required: false, type: 'STRING', size: '0', desc: 'JSON 배열', validation: null },
        { key: 'srchprt', name: '검색구분', depth: 1, required: false, type: 'INTEGER', size: '0', desc: 'email:1 / 이름:2 / 전화번호:3 / 회사명:4', validation: null },
        { key: 'srchwrd', name: '검색어', depth: 1, required: false, type: 'STRING', size: '0', desc: '검색어', validation: null },
        { key: 'offset', name: '오프셋', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '오프셋', validation: null },
        { key: 'limit', name: '제한', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '제한', validation: null },
      ]
    },
    {
      name: '자사 회원 검색',
      tag: '13.1',
      apicd: 'api0131',
      url: 'sscpnyusersearch',
      desc: '자사 회원 검색',
      input_param: [
        { key: 'constate', name: '승인상태', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '대기:1 / 승인:2', validation: null },
        { key: 'srchprt', name: '검색구분', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '이름:1 / email:2 / 전화번호:3', validation: null },
        { key: 'srchwrd', name: '검색어', depth: 1, required: false, type: 'STRING', size: '0', desc: '검색어', validation: null },
        { key: 'offset', name: '오프셋', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '오프셋', validation: null },
        { key: 'limit', name: '제한', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '제한', validation: null },
      ]
    },
    {
      name: '회원 이메일 조회',
      tag: '14',
      apicd: 'api0140',
      url: 'useremailcheck',
      desc: '회원 이메일 조회',
      input_param: [
        { key: 'fstnm', name: '이름', depth: 1, required: true, type: 'STRING', size: '0', desc: '이름을 입력해 주세요.', validation: null_is_invalid, validation_hints: vhints.null_is_invalid },
        { key: 'lstnm', name: '성', depth: 1, required: true, type: 'STRING', size: '0', desc: '성을 입력해 주세요.', validation: null_is_invalid, validation_hints: vhints.null_is_invalid },
        { key: 'emailid', name: '이메일ID', depth: 1, required: true, type: 'STRING', size: '0', desc: '이메일ID', validation: null_is_invalid, validation_hints: vhints.null_is_invalid },
      ]
    },
    {
      name: '회원 이메일 중복 확인',
      tag: '14.1',
      apicd: 'api0141',
      url: 'useremailcheckr1',
      desc: '회원 이메일 중복 확인',
      input_param: [
        { key: 'emailid', name: '이메일ID', depth: 1, required: true, type: 'STRING', size: '0', desc: '이메일ID', validation: null_is_invalid, validation_hints: vhints.null_is_invalid },
      ]
    },
    {
      name: '사용자 추가',
      tag: '15',
      apicd: 'api0150',
      url: 'userinsert',
      desc: '사용자 추가',
      input_param: [
        { key: 'emailid', name: '아이디', depth: 1, required: true, type: 'STRING', size: '0', desc: '', validation: null_is_invalid, validation_hints: vhints.null_is_invalid },
        { key: 'pwd', name: '비밀번호', depth: 1, required: true, type: 'STRING', size: '0', desc: '', validation: null_is_invalid, validation_hints: vhints.null_is_invalid },
        { key: 'fstnm', name: '이름', depth: 1, required: true, type: 'STRING', size: '0', desc: '', validation: null_is_invalid, validation_hints: vhints.null_is_invalid },
        { key: 'lstnm', name: '성', depth: 1, required: true, type: 'STRING', size: '0', desc: '', validation: null_is_invalid, validation_hints: vhints.null_is_invalid },
        { key: 'mobile', name: '전화번호', depth: 1, required: true, type: 'STRING', size: '0', desc: '', validation: null },
        { key: 'nationId', name: '국가ID', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '', validation: null },
        { key: 'cpnyId ', name:  '회사ID', depth: 1, required: false, type: 'INTEGER', size: '0', desc: 'clinetId 또는 ptnId', validation: null },
        { key: 'marketactyn', name: '마케팅정보동의여부', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '', validation: null },
        { key: 'tncactver', name: '약관동의버전', depth: 1, required: true, type: 'STRING', size: '0', desc: '', validation: null },
        { key: 'piactver', name: '개인정보처리버전', depth: 1, required: true, type: 'STRING', size: '0', desc: '', validation: null },
      ]
    },
    {
      name: '사용자 수정',
      tag: '16',
      apicd: 'api0160',
      url: 'usermodify',
      desc: '사용자 수정',
      input_crypt: true,
      input_param: [
        { key: 'emailid', name: '아이디', depth: 1, required: true, type: 'STRING', size: '0', desc: '', validation: null_is_invalid, validation_hints: vhints.null_is_invalid },
        { key: 'lstnm', name: '성', depth: 1, required: true, type: 'STRING', size: '0', desc: '', validation: null_is_invalid, validation_hints: vhints.null_is_invalid },
        { key: 'fstnm', name: '이름', depth: 1, required: true, type: 'STRING', size: '0', desc: '', validation: null_is_invalid, validation_hints: vhints.null_is_invalid },
        { key: 'pwd', name: '비밀번호', depth: 1, required: false, type: 'STRING', size: '0', desc: '', validation: null },
        { key: 'mobile', name: '전화번호', depth: 1, required: true, type: 'STRING', size: '0', desc: '', validation: null_is_invalid, validation_hints: vhints.null_is_invalid },
        { key: 'nationId', name: '국가', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '', validation: null },
        { key: 'agencynm', name: '회사명', depth: 1, required: false, type: 'STRING', size: '0', desc: '', validation: null },
        { key: 'agencyid', name: '회사ID', depth: 1, required: false, type: 'STRING', size: '0', desc: '', validation: null },
        { key: 'marketactyn', name: '마케팅정보동의여부', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '', validation: null },
      ]
    },
    {
      name: '사용자 언어 변경',
      tag: '16.1',
      apicd: 'api0161',
      url: 'sssetuserloc',
      desc: '사용자 언어 변경',
      input_param: [
        { key: 'loc', name: '언어', depth: 1, required: true, type: 'STRING', size: '0', desc: '한글:ko, 영어:en', validation: null_is_invalid, validation_hints: vhints.null_is_invalid },
      ]
    },
    {
      name: '사용자 상태 변경',
      tag: '17',
      apicd: 'api0170',
      url: 'userstatechange',
      desc: '사용자 상태 변경',
      input_param: [
        { key: 'emailid', name: '아이디', depth: 1, required: true, type: 'STRING', size: '0', desc: '', validation: null_is_invalid, validation_hints: vhints.null_is_invalid },
        { key: 'constate', name: '승인상태', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '대기:1 / 승인:2 / 미승인:3', validation: null },
        { key: 'usrstate', name: '회원상태', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '임시:1 / 정상:2 / 정지:3 / 탈퇴:4', validation: null },
      ]
    },
    {
      name: '권한그룹 적용',
      tag: '18',
      apicd: 'api0180',
      url: 'userauthapl',
      desc: '권한그룹 적용',
      input_param: [
        { key: 'emailid', name: '아이디', depth: 1, required: true, type: 'STRING', size: '0', desc: '이메일ID', validation: null },
        { key: 'authId', name: '권한그룹 ID', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '적용 권한그룹ID', validation: null },
      ]
    },
    {
      name: '관리자 적용/해제',
      tag: '19',
      apicd: 'api0190',
      url: 'useradminapl',
      desc: '관리자 적용/해제',
      input_param: [
        { key: 'emailid', name: '아이디', depth: 1, required: true, type: 'STRING', size: '0', desc: '이메일ID', validation: null },
        { key: 'authId', name: '권한그룹 ID', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '적용 권한그룹ID', validation: null },
        { key: 'cls', name: '회원구분', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '일반:1 / SDS:6', validation: null },
      ]
    },
    {
      name: '고객사 대표관리자 업데이트',
      tag: '20',
      apicd: 'api0200',
      url: 'climanregupdate',
      desc: '고객사 대표관리자 업데이트',
      input_crypt: true,
      input_param: [
        { key: 'userId', name: '대표관리자ID', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '대표관리자ID', validation: null },
        { key: 'pwd', name: '비밀번호', depth: 1, required: true, type: 'STRING', size: '0', desc: '', validation: null_is_invalid, validation_hints: vhints.null_is_invalid },
        { key: 'marketactyn', name: '마케팅정보동의여부', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '', validation: null },
      ]
    },
    {
      name: '파트너사 대표관리자 업데이트',
      tag: '21',
      apicd: 'api0210',
      url: 'ptnmanregupdate',
      desc: '파트너사 대표관리자 업데이트',
      input_param: [
        { key: 'userId', name: '대표관리자ID', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '대표관리자ID', validation: null },
        { key: 'pwd', name: '비밀번호', depth: 1, required: true, type: 'STRING', size: '0', desc: '', validation: null_is_invalid, validation_hints: vhints.null_is_invalid },
        { key: 'marketactyn', name: '마케팅정보동의여부', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '', validation: null },
      ]
    },
    {
      name: '고객사 임직원 승인',
      tag: '22',
      apicd: 'api0220',
      url: 'cliuserapl',
      desc: '고객사 임직원 승인',
      input_param: [
        { key: 'ids', name: '임직원IDS', depth: 1, required: true, type: 'STRING', size: '0', desc: '사용자ID JSON 배열', validation: null_is_invalid, validation_hints: vhints.null_is_invalid },
        { key: 'constate', name: '승인상태', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '승인:2 / 미승인:3', validation: null },
      ]
    },
    {
      name: '파트너사 임직원 승인',
      tag: '23',
      apicd: 'api0230',
      url: 'ptnuserapl',
      desc: '파트너사 임직원 승인',
      input_param: [
        { key: 'ids', name: '임직원IDS', depth: 1, required: true, type: 'STRING', size: '0', desc: '사용자ID JSON 배열', validation: null_is_invalid, validation_hints: vhints.null_is_invalid },
        { key: 'constate', name: '승인상태', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '승인:2 / 미승인:3', validation: null },
      ]
    },
    {
      name: '고객사 대표관리자 변경',
      tag: '24',
      apicd: 'api0240',
      url: 'climanchg',
      desc: '고객사 대표관리자 변경',
      input_param: [
        { key: 'id', name: '임직원ID', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '임직원ID', validation: null },
      ]
    },
    {
      name: '파트너사 대표관리자 변경',
      tag: '25',
      apicd: 'api0250',
      url: 'ptnmanchg',
      desc: '파트너사 대표관리자 변경',
      input_param: [
        { key: 'id', name: '임직원ID', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '임직원ID', validation: null },
      ]
    },
    ////////////////////////////////////////////////////////////////
    {
      name: '회사 조회',
      tag: '26',
      apicd: 'api0260',
      url: 'cpnysearch',
      desc: '회사 조회',
      input_param: [
        { key: 'state', name: '상태', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '상태', validation: null },
        { key: 'cpnycls', name: '회사분류', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '고객사:1 / 파트너:2', validation: null },
        { key: 'srchprt', name: '검색구분', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '회사명:1 / 회사ID:2', validation: null },
        { key: 'srchwrd', name: '검색어', depth: 1, required: false, type: 'STRING', size: '0', desc: '검색어', validation: null },
      ]
    },
    {
      name: '회사 아이디 발송',
      tag: '27',
      apicd: 'api0270',
      url: 'sendagencyid',
      desc: '회사 아이디 발송',
      input_param: [
        { key: 'emailid', name: '아이디', depth: 1, required: true, type: 'STRING', size: '0', desc: '이메일ID', validation: null_is_invalid, validation_hints: vhints.null_is_invalid },
        { key: 'agencyid', name: '회사ID', depth: 1, required: true, type: 'STRING', size: '0', desc: '고객사/파트너사ID', validation: null_is_invalid, validation_hints: vhints.null_is_invalid },
      ]
    },
    ////////////////////////////////////////////////////////////////
    {
      name: '고객사 조회',
      tag: '28',
      apicd: 'api0280',
      url: 'clientsearch',
      desc: '고객사 조회',
      input_param: [
        { key: 'state', name: '상태', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '상태', validation: null },
        { key: 'assistUserId', name: '영업담당자ID', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '단독 사용', validation: null },
        { key: 'assistUserCpnyId', name: '영업담당자의 회사ID', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '단독 사용', validation: null },
        { key: 'srchprt', name: '검색구분', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '대표관리자:1 / 전화번호:2 / 회사명:3 / 회사ID:4', validation: null },
        { key: 'srchwrd', name: '검색어', depth: 1, required: false, type: 'STRING', size: '0', desc: '검색어', validation: null },
        { key: 'offset', name: '오프셋', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '오프셋', validation: null },
        { key: 'limit', name: '제한', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '제한', validation: null },
      ]
    },
    {
      name: '파트너 고객사 조회',
      tag: '28',
      apicd: 'api0280',
      url: 'clientsrchptncli',
      desc: '파트너 고객사 조회',
      input_param: [
        { key: 'state', name: '상태', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '상태', validation: null },
        { key: 'assistUserId', name: '영업담당자ID', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '단독 사용', validation: null },
        { key: 'assistUserCpnyId', name: '영업담당자의 회사ID', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '단독 사용', validation: null },
        { key: 'srchprt', name: '검색구분', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '대표관리자:1 / 전화번호:2 / 회사명:3 / 회사ID:4', validation: null },
        { key: 'srchwrd', name: '검색어', depth: 1, required: false, type: 'STRING', size: '0', desc: '검색어', validation: null },
        { key: 'offset', name: '오프셋', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '오프셋', validation: null },
        { key: 'limit', name: '제한', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '제한', validation: null },
      ]
    },
    {
      name: '고객사 등록',
      tag: '29',
      apicd: 'api0290',
      url: 'clientreg',
      desc: '고객사 등록',
      input_param: [
        { key: 'agencynm', name: '회사명', depth: 1, required: true, type: 'STRING', size: '0', desc: '', validation: null_is_invalid, validation_hints: vhints.null_is_invalid },
        // -----
        { key: 'manageUserId', name: '대표관리자ID', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '', validation: null },
        { key: 'emailid', name: 'Email(ID)', depth: 1, required: true, type: 'STRING', size: '0', desc: '', validation: null },
        { key: 'nationId', name: '국가ID', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '', validation: null },
        { key: 'lstnm', name: '성', depth: 1, required: true, type: 'STRING', size: '0', desc: '대표관리자(성)', validation: null },
        { key: 'fstnm', name: '이름', depth: 1, required: true, type: 'STRING', size: '0', desc: '대표관리자(이름)', validation: null },
        { key: 'mobile', name: '전화번호', depth: 1, required: true, type: 'STRING', size: '0', desc: '', validation: null },
        // -----
        { key: 'typ', name: '유형', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '라이센스 유형', validation: null },
        { key: 'subj', name: '목적', depth: 1, required: true, type: 'STRING', size: '0', desc: '라이센스 목적', validation: null },
        { key: 'svrmac', name: '설치서버MAC', depth: 1, required: true, type: 'STRING', size: '0', desc: '설치서버MAC JSON', validation: null },
        { key: 'licsdt', name: '시작날짜', depth: 1, required: true, type: 'STRING', size: '0', desc: '라이센스 시작일', validation: null },
        { key: 'licFileId', name: '파일ID', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '라이센스 파일ID', validation: null },
        { key: 'dat', name: '데이터', depth: 1, required: false, type: 'STRING', size: '0', desc: '라이센스데이터 JSON', validation: null },
        // -----
        { key: 'techsptm', name: '기술지원시간', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '', validation: null },
        // -----
        { key: 'assistUserId', name: '영업담당자ID', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '', validation: null },
      ]
    },
    {
      name: '고객사 등록 및 라이센스 신청',
      tag: '30',
      apicd: 'api0300',
      url: 'clientreglicreq',
      desc: '고객사 등록 및 라이센스 신청',
      input_crypt: true,
      input_param: [
        { key: 'agencynm', name: '회사명', depth: 1, required: true, type: 'STRING', size: '0', desc: '', validation: null_is_invalid, validation_hints: vhints.null_is_invalid },
        // -----
        { key: 'manageUserId', name: '대표관리자ID', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '', validation: null },
        { key: 'emailid', name: 'Email(ID)', depth: 1, required: true, type: 'STRING', size: '0', desc: '', validation: null },
        { key: 'nationId', name: '국가ID', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '', validation: null },
        { key: 'lstnm', name: '성', depth: 1, required: true, type: 'STRING', size: '0', desc: '대표관리자(성)', validation: null },
        { key: 'fstnm', name: '이름', depth: 1, required: true, type: 'STRING', size: '0', desc: '대표관리자(이름)', validation: null },
        { key: 'mobile', name: '전화번호', depth: 1, required: true, type: 'STRING', size: '0', desc: '', validation: null },
        // -----
        { key: 'typ', name: '유형', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '라이센스 유형', validation: null },
        { key: 'subj', name: '목적', depth: 1, required: true, type: 'STRING', size: '0', desc: '라이센스 목적', validation: null },
        { key: 'svrmac', name: '설치서버MAC', depth: 1, required: true, type: 'STRING', size: '0', desc: '설치서버MAC JSON', validation: null },
        { key: 'licsdt', name: '시작날짜', depth: 1, required: true, type: 'STRING', size: '0', desc: '라이센스 시작일', validation: null },
        { key: 'licedt', name: '종료날짜', depth: 1, required: false, type: 'STRING', size: '0', desc: '라이센스 종료일', validation: null },
        { key: 'dat', name: '데이터', depth: 1, required: false, type: 'STRING', size: '0', desc: '라이센스데이터 JSON', validation: null },
      ]
    },
    {
      name: '고객사 담당자 변경',
      tag: '31',
      apicd: 'api0310',
      url: 'clientupdateastusr',
      desc: '고객사 담당자 변경',
      input_param: [
        { key: 'id', name: '고객사ID', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '고객사ID', validation: null },
        { key: 'assistUserId', name: '담당자', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '파트너사 직원ID', validation: null },
      ]
    },
    {
      name: '고객사 상태 변경',
      tag: '32',
      apicd: 'api0320',
      url: 'clientstatechange',
      desc: '고객사 상태 변경',
      input_param: [
        { key: 'id', name: '고객사ID', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '고객사ID', validation: null },
        { key: 'state', name: '상태', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '중지:1 / 정상:2', validation: null },
      ]
    },
    ////////////////////////////////////////////////////////////////
    {
      name: '라이센스 신청 안내 메일',
      tag: '33',
      apicd: 'api0330',
      url: 'licreqinfomail',
      desc: '라이센스 신청 안내 메읿 발송',
      input_param: [
        { key: 'typ', name: '라이선스 구분', depth: 1, required: true, type: 'INTEGER', size: '0', desc: 'Purchase:1 / Annual:2 / POC:3', validation: null },
        { key: 'email', name: '이메일', depth: 1, required: true, type: 'STRING', size: '0', desc: '이메일 주소를 입력하십시오.', validation: null_is_invalid, validation_hints: vhints.null_is_invalid },
        { key: 'cont', name: '내용', depth: 1, required: true, type: 'STRING', size: '0', desc: '내용을 입력하십시오.', validation: null_is_invalid, validation_hints: vhints.null_is_invalid },
      ]
    },
    {
      name: '라이센스 신청',
      tag: '34',
      apicd: 'api0340',
      url: 'licreq',
      desc: '라이센스 신청',
      input_param: [
        { key: 'clientId', name: '고객사ID', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '고객사ID', validation: null },
        { key: 'typ', name: '유형', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '라이센스 유형', validation: null },
        { key: 'subj', name: '목적', depth: 1, required: true, type: 'STRING', size: '0', desc: '라이센스 목적', validation: null },
        { key: 'svrmac', name: '설치서버MAC', depth: 1, required: true, type: 'STRING', size: '0', desc: '설치서버MAC JSON', validation: null },
        { key: 'licsdt', name: '시작날짜', depth: 1, required: true, type: 'STRING', size: '0', desc: '라이센스 시작일', validation: null },
        { key: 'licedt', name: '종료날짜', depth: 1, required: false, type: 'STRING', size: '0', desc: '라이센스 종료일', validation: null },
        { key: 'dat', name: '데이터', depth: 1, required: false, type: 'STRING', size: '0', desc: '라이센스데이터 JSON', validation: null },
      ]
    },
    {
      name: '라이센스 조회',
      tag: '35',
      apicd: 'api0350',
      url: 'licsearch',
      desc: '라이센스 조회',
      input_param: [
        { key: 'clientId', name: '고객사ID', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '상태', validation: null },
        { key: 'typ', name: '유형', depth: 1, required: false, type: 'INTEGER', size: '0', desc: 'Purchase:1 / Evaluation:2 / POC:3', validation: null },
        { key: 'state', name: '상태', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '신청/대기:1 / 유효:2 / 거절:3 / 만료:4', validation: null },
        { key: 'ClientAssistUserId', name: '고객사 영업담당자ID', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '단독 사용', validation: null },
        { key: 'ClientAssistUserCpnyId', name: '고객사 영업담당자의 회사ID', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '단독 사용', validation: null },
        { key: 'retxls', name: '엑셀', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '엑셀로 받기:1', validation: null },
        { key: 'srchprt', name: '검색구분', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '신청자:1 / 회사명:2 / 담당자명:3', validation: null },
        { key: 'srchwrd', name: '검색어', depth: 1, required: false, type: 'STRING', size: '0', desc: '검색어', validation: null },
        { key: 'offset', name: '오프셋', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '오프셋', validation: null },
        { key: 'limit', name: '제한', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '제한', validation: null },
      ]
    },
    {
      name: '라이센스 수정',
      tag: '36',
      apicd: 'api0360',
      url: 'licmodify',
      desc: '라이센스 수정',
      input_param: [
        { key: 'id', name: 'ID', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '라이센스ID', validation: null },
        { key: 'state', name: '상태', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '유효:2 / 거절:3', validation: null },
        { key: 'rjmemo', name: '거절사유', depth: 1, required: false, type: 'STRING', size: '0', desc: '거절사유', validation: null },
        { key: 'licFileId', name: '파일ID', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '라이센스 파일ID', validation: null },
        { key: 'dat', name: '데이터', depth: 1, required: false, type: 'STRING', size: '0', desc: '라이센스데이터 JSON', validation: null },
      ]
    },
    ////////////////////////////////////////////////////////////////
    {
      name: '파트너사 등록',
      tag: '37',
      apicd: 'api0370',
      url: 'ptnreg',
      desc: '고객사 등록',
      input_param: [
        { key: 'agencynm', name: '회사명', depth: 1, required: true, type: 'STRING', size: '0', desc: '파트너사 이름', validation: null_is_invalid, validation_hints: vhints.null_is_invalid },
        // -----
        { key: 'manageUserId', name: '대표관리자ID', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '', validation: null },
        { key: 'emailid', name: 'Email(ID)', depth: 1, required: true, type: 'STRING', size: '0', desc: '', validation: null },
        { key: 'nationId', name: '국가ID', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '', validation: null },
        { key: 'lstnm', name: '성', depth: 1, required: true, type: 'STRING', size: '0', desc: '대표관리자(성)', validation: null },
        { key: 'fstnm', name: '이름', depth: 1, required: true, type: 'STRING', size: '0', desc: '대표관리자(이름)', validation: null },
        { key: 'mobile', name: '전화번호', depth: 1, required: true, type: 'STRING', size: '0', desc: '', validation: null },
      ]
    },
    {
      name: '파트너사 조회',
      tag: '38',
      apicd: 'api0380',
      url: 'ptnsearch',
      desc: '파트너사 조회',
      input_param: [
        { key: 'state', name: '상태', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '상태', validation: null },
        { key: 'srchprt', name: '검색구분', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '회사명:1 / 회사ID:2 / 담당자:3', validation: null },
        { key: 'srchwrd', name: '검색어', depth: 1, required: false, type: 'STRING', size: '0', desc: '검색어', validation: null },
        { key: 'offset', name: '오프셋', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '오프셋', validation: null },
        { key: 'limit', name: '제한', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '제한', validation: null },
      ]
    },
    {
      name: '파트너사 상태 변경',
      tag: '39',
      apicd: 'api0390',
      url: 'ptnstatechange',
      desc: '파트너사 상태 변경',
      input_param: [
        { key: 'id', name: '파트너ID', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '파트너ID', validation: null },
        { key: 'state', name: '상태', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '중지:1 / 정상:2', validation: null },
      ]
    },
    ////////////////////////////////////////////////////////////////
    {
      name: '파트너Q&A 추가',
      tag: '40',
      apicd: 'api0400',
      url: 'ptnqnainsert',
      desc: '파트너Q&A 추가',
      input_param: [
        { key: 'ptnId', name: '파트너사ID', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '파트너사ID', validation: null },
        { key: 'cont', name: '내용', depth: 1, required: true, type: 'STRING', size: '0', desc: '내용', validation: null },
      ]
    },
    {
      name: '파트너Q&A 답변',
      tag: '41',
      apicd: 'api0410',
      url: 'ptnqnaans',
      desc: '파트너Q&A 답변',
      input_param: [
        { key: 'id', name: '게시물ID', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '게시물ID', validation: null },
        { key: 'anscont', name: '답변내용', depth: 1, required: true, type: 'STRING', size: '0', desc: '답변내용', validation: null },
      ]
    },
    {
      name: '파트너Q&A 삭제',
      tag: '42',
      apicd: 'api0420',
      url: 'ptnqnaremove',
      desc: '파트너Q&A 삭제',
      input_param: [
        { key: 'id', name: '게시물ID', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '게시물ID', validation: null },
      ]
    },
    {
      name: '파트너Q&A 검색',
      tag: '43',
      apicd: 'api0430',
      url: 'ptnqnasearch',
      desc: '파트너Q&A 검색',
      input_param: [
        { key: 'ptnId', name: '파트너ID', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '파트너ID', validation: null },
        { key: 'state', name: '상태', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '상태', validation: null },
        { key: 'srchprt', name: '검색구분', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '등록자:1 / 회사명:2', validation: null },
        { key: 'srchwrd', name: '검색어', depth: 1, required: false, type: 'STRING', size: '0', desc: '검색어', validation: null },
        { key: 'offset', name: '오프셋', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '오프셋', validation: null },
        { key: 'limit', name: '제한', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '제한', validation: null },
        { key: 'orderby', name: '정렬', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '역순:0, 순차:1', validation: null },
      ]
    },
    ////////////////////////////////////////////////////////////////
    {
      name: '티켓구매요청 등록',
      tag: '44',
      apicd: 'api0440',
      url: 'tcktreqinsert',
      desc: '티켓구매 신청',
      input_param: [
        { key: 'reqhr', name: '요청시간', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '추가요청시간', validation: null },
      ]
    },
    {
      name: '티켓구매요청 승인',
      tag: '45',
      apicd: 'api0450',
      url: 'tcktreqapl',
      desc: '티켓구매요청 승인',
      input_crypt: true,
      input_param: [
        { key: 'id', name: 'ID', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '게시물ID', validation: null },
        { key: 'state', name: '상태', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '완료:5 / 거절:6', validation: null },
        { key: 'aplhr', name: '승인시간', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '승인시간', validation: null },
        { key: 'rjmemo', name: '거절사유', depth: 1, required: false, type: 'STRING', size: '0', desc: '거절사유', validation: null },
      ]
    },
    {
      name: '관리자 티켓구매 등록',
      tag: '46',
      apicd: 'api0460',
      url: 'tcktreqadmininsert',
      desc: '관리자 티켓구매 등록',
      input_param: [
        { key: 'clientId', name: '고객사ID', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '고객사ID', validation: null },
        { key: 'reqhr', name: '구매시간', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '구매시간/음수값 가능', validation: null },
      ]
    },
    {
      name: '티켓구매요청 조회',
      tag: '47',
      apicd: 'api0470',
      url: 'tcktreqsearch',
      desc: '티켓구매요청 조회',
      input_param: [
        { key: 'clientId', name: '고객사ID', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '고객사ID', validation: null },
        { key: 'state', name: '상태', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '신청:1 / 완료:5 / 거절:6', validation: null },
        { key: 'ClientAssistUserId', name: '고객사 영업담당자ID', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '단독 사용', validation: null },
        { key: 'ClientAssistUserCpnyId', name: '고객사 영업담당자의 회사ID', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '단독 사용', validation: null },
        { key: 'srchsdt', name: '조회시작날짜', depth: 1, required: false, type: 'STRING', size: '0', desc: '조회시작날짜', validation: null },
        { key: 'srchedt', name: '조회끝날짜', depth: 1, required: false, type: 'STRING', size: '0', desc: '조회끝날짜', validation: null },
        { key: 'retxls', name: '엑셀', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '엑셀로 받기:1', validation: null },
        { key: 'srchprt', name: '검색구분', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '신청자:1 / 소속기관:2 / 담당자:3', validation: null },
        { key: 'srchwrd', name: '검색어', depth: 1, required: false, type: 'STRING', size: '0', desc: '검색어', validation: null },
        { key: 'offset', name: '오프셋', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '오프셋', validation: null },
        { key: 'limit', name: '제한', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '제한', validation: null },
      ]
    },
    ////////////////////////////////////////////////////////////////
    {
      name: '티켓사용 등록',
      tag: '48',
      apicd: 'api0480',
      url: 'tcktuseinsert',
      desc: '티켓사용 등록',
      input_param: [
        { key: 'cls', name: '기술지원유형', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '장애조치:1 / 기술문의:2 / S/W설치:3 / 현장교육:4 / 기타:5', validation: null },
        { key: 'etcdesc', name: '기타기술지원유형', depth: 1, required: false, type: 'STRING', size: '0', desc: '기타기술지원유형', validation: null },
        { key: 'preprchr', name: '예상소요시간', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '예상소요시간', validation: null },
        { key: 'nm', name: '제목', depth: 1, required: true, type: 'STRING', size: '0', desc: '제목', validation: null },
        { key: 'cont', name: '요청상세', depth: 1, required: true, type: 'STRING', size: '0', desc: '요청상세', validation: null },
        { key: 'updfs', name: '첨부파일', depth: 1, required: false, type: 'STRING', size: '0', desc: '첨부파일', validation: null },
      ]
    },
    {
      name: '티켓사용 수정',
      tag: '49',
      apicd: 'api0490',
      url: 'tcktusemodify',
      desc: '티켓사용 수정',
      input_param: [
        { key: 'id', name: 'ID', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '게시물ID', validation: null },
        { key: 'cls', name: '기술지원유형', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '장애조치:1 / 기술문의:2 / S/W설치:3 / 현장교육:4 / 기타:5', validation: null },
        { key: 'etcdesc', name: '기타기술지원유형', depth: 1, required: false, type: 'STRING', size: '0', desc: '기타기술지원유형', validation: null },
        { key: 'preprchr', name: '예상소요시간', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '예상소요시간', validation: null },
        { key: 'nm', name: '제목', depth: 1, required: true, type: 'STRING', size: '0', desc: '제목', validation: null },
        { key: 'cont', name: '요청상세', depth: 1, required: true, type: 'STRING', size: '0', desc: '요청상세', validation: null },
        { key: 'updfs', name: '첨부파일', depth: 1, required: false, type: 'STRING', size: '0', desc: '첨부파일', validation: null },
      ]
    },
    {
      name: '티켓사용 조회',
      tag: '50',
      apicd: 'api0500',
      url: 'tcktusesearch',
      desc: '티켓사용 조회',
      input_param: [
        { key: 'clientId', name: '고객사ID', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '고객사ID', validation: null },
        { key: 'cls', name: '기술지원유형', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '장애조치:1 / 기술문의:2 / S/W설치:3 / 현장교육:4 / 기타:5', validation: null },
        { key: 'state', name: '상태', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '상태', validation: null },
        { key: 'ClientAssistUserId', name: '고객사 영업담당자ID', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '단독 사용', validation: null },
        { key: 'ClientAssistUserCpnyId', name: '고객사 영업담당자의 회사ID', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '단독 사용', validation: null },
        { key: 'srchsdt', name: '조회시작날짜', depth: 1, required: false, type: 'STRING', size: '0', desc: '조회시작날짜', validation: null },
        { key: 'srchedt', name: '조회끝날짜', depth: 1, required: false, type: 'STRING', size: '0', desc: '조회끝날짜', validation: null },
        { key: 'srchprt', name: '검색구분', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '신청자:1 / 회사명:2 / 담당자:3 / 티켓번호:4', validation: null },
        { key: 'srchwrd', name: '검색어', depth: 1, required: false, type: 'STRING', size: '0', desc: '검색어', validation: null },
        { key: 'offset', name: '오프셋', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '오프셋', validation: null },
        { key: 'limit', name: '제한', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '제한', validation: null },
      ]
    },
    {
      name: '티켓 신청내역 조회',
      tag: '60',
      apicd: 'api0600',
      url: 'tcktusedetailsearch',
      desc: '티켓 신청내역 조회',
      input_param: [
        { key: 'clientId', name: '고객사ID', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '고객사ID', validation: null },
        { key: 'state', name: '상태', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '상태', validation: null },
        { key: 'tcktno', name: '티켓번호', depth: 1, required: false, type: 'STRING', size: '0', desc: '티켓번호', validation: null },
        { key: 'srchsdt', name: '조회시작날짜', depth: 1, required: false, type: 'STRING', size: '0', desc: '조회시작날짜', validation: null },
        { key: 'srchedt', name: '조회끝날짜', depth: 1, required: false, type: 'STRING', size: '0', desc: '조회끝날짜', validation: null },
        { key: 'srchprt', name: '검색구분', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '검색구분', validation: null },
        { key: 'srchwrd', name: '검색어', depth: 1, required: false, type: 'STRING', size: '0', desc: '검색어', validation: null },
        { key: 'offset', name: '오프셋', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '오프셋', validation: null },
        { key: 'limit', name: '제한', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '제한', validation: null },
      ]
    },
    ////////////////////////////////////////////////////////////////
    {
      name: '티켓지원처리 등록',
      tag: '61',
      apicd: 'api0610',
      url: 'tcktuseprcinsert',
      desc: '티켓지원처리 등록',
      input_param: [
        { key: 'tcktuseId', name: '티켓사용ID', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '', validation: null },
        { key: 'state', name: '상태', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '신청:1 / 접수:2 / 승인요청:3 / 반려:4 / 완료:5', validation: null },
        { key: 'cpnyId', name: '기술지원회사ID', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '기술지원회사ID', validation: null },
        { key: 'prcUserId', name: '기술지원담당자ID', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '', validation: null },
        { key: 'prchr', name: '소요시간', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '소요시간', validation: null },
        { key: 'cont', name: '처리내용', depth: 1, required: false, type: 'STRING', size: '0', desc: '조치내용', validation: null },
        { key: 'updfs', name: '첨부파일', depth: 1, required: false, type: 'STRING', size: '0', desc: '첨부파일', validation: null },
        { key: 'rjcls', name: '거절사유타입', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '기술지원시간 상이:1 / 기술지원미흡:2 / 기타:3', validation: null },
        { key: 'rjmemo', name: '거절사유', depth: 1, required: false, type: 'STRING', size: '0', desc: '거절사유', validation: null },
      ]
    },
    {
      name: '티켓지원처리 조회',
      tag: '62',
      apicd: 'api0620',
      url: 'tcktuseprcsearch',
      desc: '티켓지원처리 조회',
      input_param: [
        { key: 'tcktuseId', name: '티켓사용ID', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '고객사ID', validation: null },
        { key: 'state', name: '상태', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '신청:1 / 접수:2 / 승인요청:3 / 반려:4 / 완료:5', validation: null },
        { key: 'rjcls', name: '거절사유타입', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '기술지원시간 상이:1 / 기술지원미흡:2 / 기타:3', validation: null },
        { key: 'srchsdt', name: '조회시작날짜', depth: 1, required: false, type: 'STRING', size: '0', desc: '조회시작날짜', validation: null },
        { key: 'srchedt', name: '조회끝날짜', depth: 1, required: false, type: 'STRING', size: '0', desc: '조회끝날짜', validation: null },
        { key: 'srchprt', name: '검색구분', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '검색구분', validation: null },
        { key: 'srchwrd', name: '검색어', depth: 1, required: false, type: 'STRING', size: '0', desc: '검색어', validation: null },
        { key: 'offset', name: '오프셋', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '오프셋', validation: null },
        { key: 'limit', name: '제한', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '제한', validation: null },
      ]
    },
    ////////////////////////////////////////////////////////////////
    {
      name: '티켓사용통계 조회',
      tag: '63',
      apicd: 'api0630',
      url: 'tcktusestsearch',
      desc: '티켓사용통계 조회',
      input_param: [
        { key: 'dummy', name: '더미', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '더미', validation: null },
      ]
    },
    ////////////////////////////////////////////////////////////////
    {
      name: '공통 코드 검색',
      tag: '64',
      apicd: 'api0640',
      url: 'bbsccdsearch',
      desc: '공통 코드 검색',
      input_param: [
        { key: 'loc', name: '언어', depth: 1, required: false, type: 'STRING', size: '0', desc: '한글:ko, 영어:en', validation: null },
        { key: 'gpcd', name: '그룹코드', depth: 1, required: false, type: 'STRING', size: '0', desc: '그룹코드', validation: null },
        { key: 'nm', name: '이름', depth: 1, required: false, type: 'STRING', size: '0', desc: '이름', validation: null },
        { key: 'state', name: '상태', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '상태', validation: null },
        { key: 'srchprt', name: '검색구분', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '검색구분', validation: null },
        { key: 'srchwrd', name: '검색어', depth: 1, required: false, type: 'STRING', size: '0', desc: '검색어', validation: null },
        { key: 'offset', name: '오프셋', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '오프셋', validation: null },
        { key: 'limit', name: '제한', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '제한', validation: null },      ]
    },
    {
      name: '공통 코드 추가',
      tag: '65',
      apicd: 'api0650',
      url: 'bbsccdinsert',
      desc: '공통 코드 추가',
      input_param: [
        { key: 'loc', name: '언어', depth: 1, required: true, type: 'STRING', size: '0', desc: '한글:ko, 영어:en', validation: null_is_invalid, validation_hints: vhints.null_is_invalid },
        { key: 'nm', name: '이름', depth: 1, required: true, type: 'STRING', size: '0', desc: '이름', validation: null_is_invalid, validation_hints: vhints.null_is_invalid },
        { key: 'gpcd', name: '그룹코드', depth: 1, required: true, type: 'STRING', size: '0', desc: '그룹코드', validation: null_is_invalid, validation_hints: vhints.null_is_invalid },
      ]
    },
    ////////////////////////////////////////////////////////////////
    {
      name: 'Learn Contents 추가',
      tag: '66',
      apicd: 'api0660',
      url: 'lnctinsert',
      desc: 'Learn Contents 추가',
      input_param: [
        { key: 'loc', name: '언어', depth: 1, required: true, type: 'STRING', size: '0', desc: '한글:ko, 영어:en', validation: null_is_invalid, validation_hints: vhints.null_is_invalid },
        { key: 'nm', name: '제목', depth: 1, required: true, type: 'STRING', size: '0', desc: '제목', validation: null },
        { key: 'bbsccdId', name: '분류ID', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '분류ID', validation: null },
        { key: 'state', name: '상태', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '상태', validation: null },
        { key: 'ver', name: '버전', depth: 1, required: true, type: 'STRING', size: '0', desc: '버전', validation: null },
        { key: 'tags', name: '태그', depth: 1, required: false, type: 'STRING', size: '0', desc: '태그', validation: null },
        { key: 'cont', name: '내용', depth: 1, required: true, type: 'STRING', size: '0', desc: '내용', validation: null },
        { key: 'contbl', name: '목차', depth: 1, required: false, type: 'STRING', size: '0', desc: '목차', validation: null },
      ]
    },
    {
      name: 'Learn Contents 수정',
      tag: '67',
      apicd: 'api0670',
      url: 'lnctmodify',
      desc: 'Learn Contents 수정',
      input_param: [
        { key: 'id', name: '게시물ID', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '게시물ID', validation: null },
        { key: 'loc', name: '언어', depth: 1, required: true, type: 'STRING', size: '0', desc: '한글:ko, 영어:en', validation: null_is_invalid, validation_hints: vhints.null_is_invalid },
        { key: 'nm', name: '제목', depth: 1, required: true, type: 'STRING', size: '0', desc: '제목', validation: null },
        { key: 'bbsccdId', name: '분류ID', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '분류ID', validation: null },
        { key: 'state', name: '상태', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '상태', validation: null },
        { key: 'ver', name: '버전', depth: 1, required: true, type: 'STRING', size: '0', desc: '버전', validation: null },
        { key: 'tags', name: '태그', depth: 1, required: false, type: 'STRING', size: '0', desc: '태그', validation: null },
        { key: 'cont', name: '내용', depth: 1, required: true, type: 'STRING', size: '0', desc: '내용', validation: null },
        { key: 'contbl', name: '목차', depth: 1, required: false, type: 'STRING', size: '0', desc: '목차', validation: null },
      ]
    },
    {
      name: 'Learn Contents 삭제',
      tag: '68',
      apicd: 'api0680',
      url: 'lnctremove',
      desc: 'Learn Contents 삭제',
      input_param: [
        { key: 'id', name: '게시물ID', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '게시물ID', validation: null },
      ]
    },
    {
      name: 'Learn Contents 검색',
      tag: '69',
      apicd: 'api0690',
      url: 'lnctsearch',
      desc: 'Learn Contents 검색',
      input_param: [
        { key: 'loc', name: '언어', depth: 1, required: false, type: 'STRING', size: '0', desc: '한글:ko, 영어:en', validation: null },
        { key: 'bbsccdId', name: '분류ID', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '분류ID', validation: null },
        { key: 'state', name: '상태', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '상태', validation: null },
        { key: 'srchprt', name: '검색구분', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '버전:1 / 제목:2 / 내용:3 / 등록자:4', validation: null },
        { key: 'srchwrd', name: '검색어', depth: 1, required: false, type: 'STRING', size: '0', desc: '검색어', validation: null },
        { key: 'offset', name: '오프셋', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '오프셋', validation: null },
        { key: 'limit', name: '제한', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '제한', validation: null },
        { key: 'orderitem', name: '정렬아이템', depth: 1, required: false, type: 'STRING', size: '0', desc: '아이디:id, 제목:nm', validation: null },
        { key: 'orderby', name: '정렬', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '역순:0, 순차:1', validation: null },
      ]
    },
    ////////////////////////////////////////////////////////////////
    {
      name: 'Design Library 추가',
      tag: '70',
      apicd: 'api0700',
      url: 'dgnlibinsert',
      desc: 'Design Library 추가',
      input_param: [
        { key: 'loc', name: '언어', depth: 1, required: true, type: 'STRING', size: '0', desc: '한글:ko, 영어:en', validation: null_is_invalid, validation_hints: vhints.null_is_invalid },
        { key: 'nm', name: '제목', depth: 1, required: true, type: 'STRING', size: '0', desc: '제목', validation: null },
        { key: 'bbsccdId', name: '분류ID', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '분류ID', validation: null },
        { key: 'updfs', name: '첨부파일', depth: 1, required: false, type: 'STRING', size: '0', desc: '첨부파일', validation: null },
        { key: 'state', name: '상태', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '상태', validation: null },
        { key: 'tags', name: '태그', depth: 1, required: false, type: 'STRING', size: '0', desc: '태그', validation: null },
        { key: 'cont', name: '내용', depth: 1, required: true, type: 'STRING', size: '0', desc: '내용', validation: null },
        { key: 'contbl', name: '목차', depth: 1, required: false, type: 'STRING', size: '0', desc: '목차', validation: null },
      ]
    },
    {
      name: 'Design Library 수정',
      tag: '71',
      apicd: 'api0710',
      url: 'dgnlibmodify',
      desc: 'Design Library 수정',
      input_param: [
        { key: 'id', name: '게시물ID', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '게시물ID', validation: null },
        { key: 'loc', name: '언어', depth: 1, required: true, type: 'STRING', size: '0', desc: '한글:ko, 영어:en', validation: null_is_invalid, validation_hints: vhints.null_is_invalid },
        { key: 'nm', name: '제목', depth: 1, required: true, type: 'STRING', size: '0', desc: '제목', validation: null },
        { key: 'bbsccdId', name: '분류ID', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '분류ID', validation: null },
        { key: 'updfs', name: '첨부파일', depth: 1, required: false, type: 'STRING', size: '0', desc: '첨부파일', validation: null },
        { key: 'state', name: '상태', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '상태', validation: null },
        { key: 'tags', name: '태그', depth: 1, required: false, type: 'STRING', size: '0', desc: '태그', validation: null },
        { key: 'cont', name: '내용', depth: 1, required: true, type: 'STRING', size: '0', desc: '내용', validation: null },
        { key: 'contbl', name: '목차', depth: 1, required: false, type: 'STRING', size: '0', desc: '목차', validation: null },
      ]
    },
    {
      name: 'Design Library 삭제',
      tag: '72',
      apicd: 'api0720',
      url: 'dgnlibremove',
      desc: 'Design Library 삭제',
      input_param: [
        { key: 'id', name: '게시물ID', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '게시물ID', validation: null },
      ]
    },
    {
      name: 'Design Library 검색',
      tag: '73',
      apicd: 'api0730',
      url: 'dgnlibsearch',
      desc: 'Design Library 검색',
      input_param: [
        { key: 'loc', name: '언어', depth: 1, required: true, type: 'STRING', size: '0', desc: '한글:ko, 영어:en', validation: null },
        { key: 'bbsccdId', name: '분류ID', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '분류ID', validation: null },
        { key: 'state', name: '상태', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '상태', validation: null },
        { key: 'srchprt', name: '검색구분', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '제목:1 / 내용:2 / 등록자:3', validation: null },
        { key: 'srchwrd', name: '검색어', depth: 1, required: false, type: 'STRING', size: '0', desc: '검색어', validation: null },
        { key: 'offset', name: '오프셋', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '오프셋', validation: null },
        { key: 'limit', name: '제한', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '제한', validation: null },
        { key: 'orderitem', name: '정렬아이템', depth: 1, required: false, type: 'STRING', size: '0', desc: '아이디:id, 제목:nm', validation: null },
        { key: 'orderby', name: '정렬', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '역순:0, 순차:1', validation: null },
      ]
    },
    ////////////////////////////////////////////////////////////////
    {
      name: 'Tutorial Clip 추가',
      tag: '74',
      apicd: 'api0740',
      url: 'tutclpinsert',
      desc: 'Tutorial Clip 추가',
      input_param: [
        { key: 'loc', name: '언어', depth: 1, required: true, type: 'STRING', size: '0', desc: '한글:ko, 영어:en', validation: null_is_invalid, validation_hints: vhints.null_is_invalid },
        { key: 'nm', name: '제목', depth: 1, required: true, type: 'STRING', size: '0', desc: '제목', validation: null },
        { key: 'bbsccdId', name: '분류ID', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '분류ID', validation: null },
        { key: 'state', name: '상태', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '상태', validation: null },
        { key: 'tags', name: '태그', depth: 1, required: false, type: 'STRING', size: '0', desc: '태그', validation: null },
        { key: 'vidurl', name: '비디오URL', depth: 1, required: true, type: 'STRING', size: '0', desc: '비디오URL', validation: null },
        { key: 'cont', name: '내용', depth: 1, required: true, type: 'STRING', size: '0', desc: '내용', validation: null },
      ]
    },
    {
      name: 'Tutorial Clip 수정',
      tag: '75',
      apicd: 'api0750',
      url: 'tutclpmodify',
      desc: 'Tutorial Clip 수정',
      input_param: [
        { key: 'id', name: '게시물ID', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '게시물ID', validation: null },
        { key: 'loc', name: '언어', depth: 1, required: true, type: 'STRING', size: '0', desc: '한글:ko, 영어:en', validation: null_is_invalid, validation_hints: vhints.null_is_invalid },
        { key: 'nm', name: '제목', depth: 1, required: true, type: 'STRING', size: '0', desc: '제목', validation: null },
        { key: 'bbsccdId', name: '분류ID', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '분류ID', validation: null },
        { key: 'state', name: '상태', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '상태', validation: null },
        { key: 'tags', name: '태그', depth: 1, required: false, type: 'STRING', size: '0', desc: '태그', validation: null },
        { key: 'vidurl', name: '비디오URL', depth: 1, required: true, type: 'STRING', size: '0', desc: '비디오URL', validation: null },
        { key: 'cont', name: '내용', depth: 1, required: true, type: 'STRING', size: '0', desc: '내용', validation: null },
      ]
    },
    {
      name: 'Tutorial Clip 삭제',
      tag: '76',
      apicd: 'api0760',
      url: 'tutclpremove',
      desc: 'Tutorial Clip 삭제',
      input_param: [
        { key: 'id', name: '게시물ID', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '게시물ID', validation: null },
      ]
    },
    {
      name: 'Tutorial Clip 검색',
      tag: '77',
      apicd: 'api0770',
      url: 'tutclpsearch',
      desc: 'Tutorial Clip 검색',
      input_param: [
        { key: 'loc', name: '언어', depth: 1, required: false, type: 'STRING', size: '0', desc: '한글:ko, 영어:en', validation: null },
        { key: 'bbsccdId', name: '분류ID', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '분류ID', validation: null },
        { key: 'state', name: '상태', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '상태', validation: null },
        { key: 'srchprt', name: '검색구분', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '제목:1 / 내용:2 / 등록자:3', validation: null },
        { key: 'srchwrd', name: '검색어', depth: 1, required: false, type: 'STRING', size: '0', desc: '검색어', validation: null },
        { key: 'offset', name: '오프셋', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '오프셋', validation: null },
        { key: 'limit', name: '제한', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '제한', validation: null },
        { key: 'orderitem', name: '정렬아이템', depth: 1, required: false, type: 'STRING', size: '0', desc: '아이디:id, 제목:nm', validation: null },
        { key: 'orderby', name: '정렬', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '역순:0, 순차:1', validation: null },
      ]
    },
    ////////////////////////////////////////////////////////////////
    {
      name: '개발자 포럼 추가',
      tag: '78',
      apicd: 'api0780',
      url: 'devfrinsert',
      desc: '개발자 포럼 추가',
      input_param: [
        { key: 'loc', name: '언어', depth: 1, required: true, type: 'STRING', size: '0', desc: '한글:ko, 영어:en', validation: null_is_invalid, validation_hints: vhints.null_is_invalid },
        { key: 'nm', name: '제목', depth: 1, required: true, type: 'STRING', size: '0', desc: '제목', validation: null_is_invalid, validation_hints: vhints.null_is_invalid },
        { key: 'bbsccdId', name: '분류ID', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '분류ID', validation: null },
        { key: 'updfs', name: '첨부파일', depth: 1, required: false, type: 'STRING', size: '0', desc: '첨부파일', validation: null },
        { key: 'state', name: '상태', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '비공개:1 / 공개:2', validation: null },
        { key: 'ntice', name: '고정공지글', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '고정공지글', validation: null },
        { key: 'nticesdt', name: '공지시작', depth: 1, required: false, type: 'STRING', size: '0', desc: '공지시작', validation: null },
        { key: 'nticeedt', name: '공지끝', depth: 1, required: false, type: 'STRING', size: '0', desc: '공지끝', validation: null },
        { key: 'cont', name: '내용', depth: 1, required: true, type: 'STRING', size: '0', desc: '내용', validation: null },
      ]
    },
    {
      name: '개발자 포럼 수정',
      tag: '79',
      apicd: 'api0790',
      url: 'devfrmodify',
      desc: '개발자 포럼 수정',
      input_param: [
        { key: 'id', name: '게시물ID', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '게시물ID', validation: null },
        { key: 'loc', name: '언어', depth: 1, required: true, type: 'STRING', size: '0', desc: '한글:ko, 영어:en', validation: null_is_invalid, validation_hints: vhints.null_is_invalid },
        { key: 'nm', name: '제목', depth: 1, required: true, type: 'STRING', size: '0', desc: '제목', validation: null },
        { key: 'bbsccdId', name: '분류ID', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '분류ID', validation: null },
        { key: 'updfs', name: '첨부파일', depth: 1, required: false, type: 'STRING', size: '0', desc: '첨부파일', validation: null },
        { key: 'state', name: '상태', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '비공개:1 / 공개:2', validation: null },
        { key: 'ntice', name: '고정공지글', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '고정공지글', validation: null },
        { key: 'nticesdt', name: '공지시작', depth: 1, required: false, type: 'STRING', size: '0', desc: '공지시작', validation: null },
        { key: 'nticeedt', name: '공지끝', depth: 1, required: false, type: 'STRING', size: '0', desc: '공지끝', validation: null },
        { key: 'cont', name: '내용', depth: 1, required: true, type: 'STRING', size: '0', desc: '내용', validation: null },
      ]
    },
    {
      name: '개발자 포럼 삭제',
      tag: '80',
      apicd: 'api0800',
      url: 'devfrremove',
      desc: '개발자 포럼 삭제',
      input_param: [
        { key: 'id', name: '게시물ID', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '게시물ID', validation: null },
      ]
    },
    {
      name: '개발자 포럼 검색',
      tag: '81',
      apicd: 'api0810',
      url: 'devfrsearch',
      desc: '개발자 포럼 검색',
      input_param: [
        { key: 'loc', name: '언어', depth: 1, required: false, type: 'STRING', size: '0', desc: '한글:ko, 영어:en', validation: null },
        { key: 'bbsccdId', name: '분류ID', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '분류ID', validation: null },
        { key: 'state', name: '상태', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '비공개:1 / 공개:2', validation: null },
        { key: 'srchprt', name: '검색구분', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '제목:1 / 내용:2 / 등록자:3', validation: null },
        { key: 'srchwrd', name: '검색어', depth: 1, required: false, type: 'STRING', size: '0', desc: '검색어', validation: null },
        { key: 'offset', name: '오프셋', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '오프셋', validation: null },
        { key: 'limit', name: '제한', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '제한', validation: null },
        { key: 'ordercase', name: '정렬케이스', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '메인:0, 어드민:1', validation: null },
        { key: 'orderitem', name: '정렬아이템', depth: 1, required: false, type: 'STRING', size: '0', desc: '아이디:id, 제목:nm', validation: null },
        { key: 'orderby', name: '정렬', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '역순:0, 순차:1', validation: null },
      ]
    },
    {
      name: '개발자 포럼 아이템 검색',
      tag: '81',
      apicd: 'api0810',
      url: 'devfrsearchitem',
      desc: '개발자 포럼 아이템 검색',
      input_param: [
        { key: 'targetid', name: '게시물ID', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '게시물ID', validation: null },
        { key: 'loc', name: '언어', depth: 1, required: true, type: 'STRING', size: '0', desc: '한글:ko, 영어:en', validation: null },
        { key: 'bbsccdId', name: '분류ID', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '분류ID', validation: null },
        { key: 'state', name: '상태', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '비공개:1 / 공개:2', validation: null },
        { key: 'srchprt', name: '검색구분', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '제목:1 / 내용:2 / 등록자:3', validation: null },
        { key: 'srchwrd', name: '검색어', depth: 1, required: false, type: 'STRING', size: '0', desc: '검색어', validation: null },
        { key: 'offset', name: '오프셋', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '오프셋', validation: null },
        { key: 'limit', name: '제한', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '제한', validation: null },
        { key: 'ordercase', name: '정렬케이스', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '메인:0, 어드민:1', validation: null },
        { key: 'orderitem', name: '정렬아이템', depth: 1, required: false, type: 'STRING', size: '0', desc: '아이디:id, 제목:nm', validation: null },
        { key: 'orderby', name: '정렬', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '역순:0, 순차:1', validation: null },
      ]
    },
    {
      name: '개발자 포럼 답글 추가',
      tag: '82',
      apicd: 'api0820',
      url: 'devfrcmtinsert',
      desc: '개발자 포럼 답글 추가',
      input_param: [
        { key: 'devfrId', name: '개발자 포럼 게시글ID', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '개발자 포럼 게시글ID', validation: null },
        { key: 'cmt', name: '답글', depth: 1, required: true, type: 'STRING', size: '0', desc: '답글', validation: null },
      ]
    },
    {
      name: '개발자 포럼 답글 삭제',
      tag: '83',
      apicd: 'api0830',
      url: 'devfrcmtremove',
      desc: '개발자 포럼 답글 삭제',
      input_param: [
        { key: 'id', name: '게시글ID', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '게시글ID', validation: null },
      ]
    },
    {
      name: '개발자 포럼 답글 수정',
      tag: '84',
      apicd: 'api0840',
      url: 'devfrcmtmodify',
      desc: '개발자 포럼 답글 수정',
      input_param: [
        { key: 'id', name: '게시글ID', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '게시글ID', validation: null },
        { key: 'state', name: '상태', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '상태', validation: null },
        { key: 'cmt', name: '답글', depth: 1, required: false, type: 'STRING', size: '0', desc: '답글', validation: null },
      ]
    },
    ////////////////////////////////////////////////////////////////
    {
      name: 'FAQ 추가',
      tag: '85',
      apicd: 'api0850',
      url: 'faqinsert',
      desc: 'FAQ 추가',
      input_param: [
        { key: 'nm', name: '제목', depth: 1, required: true, type: 'STRING', size: '0', desc: '제목', validation: null },
        { key: 'bbsccdId', name: '분류ID', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '분류ID', validation: null },
        { key: 'state', name: '상태', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '상태', validation: null },
        { key: 'cont', name: '내용', depth: 1, required: true, type: 'STRING', size: '0', desc: '내용', validation: null },
      ]
    },
    {
      name: 'FAQ 수정',
      tag: '86',
      apicd: 'api0860',
      url: 'faqmodify',
      desc: 'FAQ 수정',
      input_param: [
        { key: 'id', name: '게시물ID', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '게시물ID', validation: null },
        { key: 'nm', name: '제목', depth: 1, required: true, type: 'STRING', size: '0', desc: '제목', validation: null },
        { key: 'bbsccdId', name: '분류ID', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '분류ID', validation: null },
        { key: 'state', name: '상태', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '비공개:1 / 공개:2', validation: null },
        { key: 'cont', name: '내용', depth: 1, required: true, type: 'STRING', size: '0', desc: '내용', validation: null },
      ]
    },
    {
      name: 'FAQ 삭제',
      tag: '87',
      apicd: 'api0870',
      url: 'faqremove',
      desc: 'FAQ 삭제',
      input_param: [
        { key: 'id', name: '게시물ID', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '게시물ID', validation: null },
      ]
    },
    {
      name: 'FAQ 검색',
      tag: '88',
      apicd: 'api0880',
      url: 'faqsearch',
      desc: 'FAQ 검색',
      input_param: [
        { key: 'bbsccdId', name: '분류ID', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '분류ID', validation: null },
        { key: 'state', name: '상태', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '상태', validation: null },
        { key: 'srchprt', name: '검색구분', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '제목:1 / 내용:2 / 등록자:3', validation: null },
        { key: 'srchwrd', name: '검색어', depth: 1, required: false, type: 'STRING', size: '0', desc: '검색어', validation: null },
        { key: 'offset', name: '오프셋', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '오프셋', validation: null },
        { key: 'limit', name: '제한', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '제한', validation: null },
        { key: 'orderitem', name: '정렬아이템', depth: 1, required: false, type: 'STRING', size: '0', desc: '아이디:id, 제목:nm', validation: null },
        { key: 'orderby', name: '정렬', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '역순:0, 순차:1', validation: null },
      ]
    },
    ////////////////////////////////////////////////////////////////
    {
      name: 'NEWS 추가',
      tag: '89',
      apicd: 'api0890',
      url: 'nwsinsert',
      desc: 'NEWS 추가',
      input_param: [
        { key: 'loc', name: '언어', depth: 1, required: true, type: 'STRING', size: '0', desc: '한글:ko, 영어:en', validation: null_is_invalid, validation_hints: vhints.null_is_invalid },
        { key: 'nm', name: '제목', depth: 1, required: true, type: 'STRING', size: '0', desc: '제목', validation: null },
        { key: 'state', name: '상태', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '비공개:1 / 공개:2', validation: null },
        { key: 'mpop', name: '메인팝업', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '메인팝업', validation: null },
        { key: 'imgfId', name: '이미지ID', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '팝업 이미지', validation: null },
        { key: 'pulnk', name: '팝업링크', depth: 1, required: false, type: 'STRING', size: '0', desc: '팝업 링크', validation: null },
        { key: 'cont', name: '내용', depth: 1, required: true, type: 'STRING', size: '0', desc: '내용', validation: null },
      ]
    },
    {
      name: 'NEWS 수정',
      tag: '90',
      apicd: 'api0900',
      url: 'nwsmodify',
      desc: 'NEWS 수정',
      input_param: [
        { key: 'id', name: '게시물ID', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '게시물ID', validation: null },
        { key: 'loc', name: '언어', depth: 1, required: true, type: 'STRING', size: '0', desc: '한글:ko, 영어:en', validation: null_is_invalid, validation_hints: vhints.null_is_invalid },
        { key: 'nm', name: '제목', depth: 1, required: true, type: 'STRING', size: '0', desc: '제목', validation: null },
        { key: 'state', name: '상태', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '비공개:1 / 공개:2', validation: null },
        { key: 'mpop', name: '메인팝업', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '메인팝업', validation: null },
        { key: 'imgfId', name: '이미지ID', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '팝업 이미지', validation: null },
        { key: 'pulnk', name: '팝업링크', depth: 1, required: false, type: 'STRING', size: '0', desc: '팝업 링크', validation: null },
        { key: 'cont', name: '내용', depth: 1, required: true, type: 'STRING', size: '0', desc: '내용', validation: null },
      ]
    },
    {
      name: 'NEWS 삭제',
      tag: '91',
      apicd: 'api0910',
      url: 'nwsremove',
      desc: 'NEWS 삭제',
      input_param: [
        { key: 'id', name: '게시물ID', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '게시물ID', validation: null },
      ]
    },
    {
      name: 'NEWS 검색',
      tag: '92',
      apicd: 'api0920',
      url: 'nwssearch',
      desc: 'NEWS 검색',
      input_param: [
        { key: 'loc', name: '언어', depth: 1, required: false, type: 'STRING', size: '0', desc: '한글:ko, 영어:en', validation: null },
        { key: 'state', name: '상태', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '상태', validation: null },
        { key: 'mpop', name: '메인팝업', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '메인팝업', validation: null },
        { key: 'srchprt', name: '검색구분', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '제목:1 / 내용:2 / 등록자:3', validation: null },
        { key: 'srchwrd', name: '검색어', depth: 1, required: false, type: 'STRING', size: '0', desc: '검색어', validation: null },
        { key: 'offset', name: '오프셋', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '오프셋', validation: null },
        { key: 'limit', name: '제한', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '제한', validation: null },
        { key: 'orderitem', name: '정렬아이템', depth: 1, required: false, type: 'STRING', size: '0', desc: '아이디:id, 제목:nm', validation: null },
        { key: 'orderby', name: '정렬', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '역순:0, 순차:1', validation: null },
      ],
      logging: false,
    },
    ////////////////////////////////////////////////////////////////
    {
      name: '이벤트 추가',
      tag: '93',
      apicd: 'api0930',
      url: 'evtinsert',
      desc: '이벤트 추가',
      input_param: [
        { key: 'loc', name: '언어', depth: 1, required: true, type: 'STRING', size: '0', desc: '한글:ko, 영어:en', validation: null_is_invalid, validation_hints: vhints.null_is_invalid },
        { key: 'nm', name: '제목', depth: 1, required: true, type: 'STRING', size: '0', desc: '제목', validation: null },
        { key: 'state', name: '상태', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '비공개:1 / 공개:2', validation: null },
        { key: 'estate', name: '진행상태', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '대기:1 / 진행중:2 / 종료:3', validation: null },
        { key: 'strtdt', name: '시작날짜', depth: 1, required: true, type: 'STRING', size: '0', desc: '시작날짜', validation: null },
        { key: 'enddt', name: '종료날짜', depth: 1, required: true, type: 'STRING', size: '0', desc: '종료날짜', validation: null },
        { key: 'jcls', name: '참여구분', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '회원전용:1 / 비회원참여:2', validation: null },
        { key: 'mpop', name: '메인팝업', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '미적용:1 / 적용:2', validation: null },
        { key: 'imgfId', name: '이미지ID', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '이미지 파일(imgf)의 ID', validation: null },
        { key: 'cont', name: '내용', depth: 1, required: true, type: 'STRING', size: '0', desc: '내용', validation: null },
      ]
    },
    {
      name: '이벤트 수정',
      tag: '94',
      apicd: 'api0940',
      url: 'evtmodify',
      desc: '이벤트 수정',
      input_param: [
        { key: 'id', name: '게시물ID', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '게시물ID', validation: null },
        { key: 'loc', name: '언어', depth: 1, required: true, type: 'STRING', size: '0', desc: '한글:ko, 영어:en', validation: null_is_invalid, validation_hints: vhints.null_is_invalid },
        { key: 'nm', name: '제목', depth: 1, required: true, type: 'STRING', size: '0', desc: '제목', validation: null },
        { key: 'state', name: '상태', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '비공개:1 / 공개:2', validation: null },
        { key: 'estate', name: '진행상태', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '진행상태', validation: null },
        { key: 'strtdt', name: '시작날짜', depth: 1, required: true, type: 'STRING', size: '0', desc: '시작날짜', validation: null },
        { key: 'enddt', name: '종료날짜', depth: 1, required: true, type: 'STRING', size: '0', desc: '종료날짜', validation: null },
        { key: 'jcls', name: '참여구분', depth: 1, required: true, type: 'STRING', size: '0', desc: '참여구분', validation: null },
        { key: 'mpop', name: '메인팝업', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '메인팝업', validation: null },
        { key: 'imgfId', name: '이미지ID', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '팝업 이미지', validation: null },
        { key: 'cont', name: '내용', depth: 1, required: true, type: 'STRING', size: '0', desc: '내용', validation: null },
      ]
    },
    {
      name: '이벤트 진행상태 변경',
      tag: '95',
      apicd: 'api0950',
      url: 'evtchangeestate',
      desc: '이벤트 진행상태 변경',
      input_param: [
        { key: 'tgestate', name: '진행상태', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '대기:1 / 진행중:2 / 종료:3', validation: null },
        { key: 'tgids', name: '게시물IDS', depth: 1, required: true, type: 'STRING', size: '0', desc: '게시물ID JSON 배열', validation: null },
      ]
    },
    {
      name: '이벤트 삭제',
      tag: '96',
      apicd: 'api0960',
      url: 'evtremove',
      desc: '이벤트 삭제',
      input_param: [
        { key: 'id', name: '게시물ID', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '게시물ID', validation: null },
      ]
    },
    {
      name: '이벤트 검색',
      tag: '97',
      apicd: 'api0970',
      url: 'evtsearch',
      desc: '이벤트 검색',
      input_param: [
        { key: 'loc', name: '언어', depth: 1, required: false, type: 'STRING', size: '0', desc: '한글:ko, 영어:en', validation: null },
        { key: 'state', name: '상태', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '비공개:1 / 공개:2', validation: null },
        { key: 'estate', name: '진행상태', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '대기:1 / 진행중:2 / 종료:3', validation: null },
        { key: 'jcls', name: '참여구분', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '회원전용:1 / 비회원참여:2', validation: null },
        { key: 'srchprt', name: '검색구분', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '제목:1 / 내용:2 / 등록자:3', validation: null },
        { key: 'srchwrd', name: '검색어', depth: 1, required: false, type: 'STRING', size: '0', desc: '검색어', validation: null },
        { key: 'offset', name: '오프셋', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '오프셋', validation: null },
        { key: 'limit', name: '제한', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '제한', validation: null },
        { key: 'orderitem', name: '정렬아이템', depth: 1, required: false, type: 'STRING', size: '0', desc: '아이디:id, 제목:nm', validation: null },
        { key: 'orderby', name: '정렬', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '역순:0, 순차:1', validation: null },
      ]
    },
    {
      name: '이벤트 검색',
      tag: '97',
      apicd: 'api0971',
      url: 'evtsearchadm',
      desc: '이벤트 검색',
      input_param: [
        { key: 'loc', name: '언어', depth: 1, required: false, type: 'STRING', size: '0', desc: '한글:ko, 영어:en', validation: null },
        { key: 'state', name: '상태', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '비공개:1 / 공개:2', validation: null },
        { key: 'estate', name: '진행상태', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '대기:1 / 진행중:2 / 종료:3', validation: null },
        { key: 'jcls', name: '참여구분', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '회원전용:1 / 비회원참여:2', validation: null },
        { key: 'srchprt', name: '검색구분', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '제목:1 / 내용:2 / 등록자:3', validation: null },
        { key: 'srchwrd', name: '검색어', depth: 1, required: false, type: 'STRING', size: '0', desc: '검색어', validation: null },
        { key: 'offset', name: '오프셋', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '오프셋', validation: null },
        { key: 'limit', name: '제한', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '제한', validation: null },
        { key: 'orderitem', name: '정렬아이템', depth: 1, required: false, type: 'STRING', size: '0', desc: '아이디:id, 제목:nm', validation: null },
        { key: 'orderby', name: '정렬', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '역순:0, 순차:1', validation: null },
      ]
    },
    ////////////////////////////////////////////////////////////////
    {
      name: '이벤트 응모자(비회원) 추가',
      tag: '98',
      apicd: 'api0980',
      url: 'evtentinsert',
      desc: '이벤트 응모자(비회원) 추가',
      input_param: [
        { key: 'evtId', name: '이벤트ID', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '이벤트ID', validation: null },
        { key: 'fstnm', name: '이름', depth: 1, required: true, type: 'STRING', size: '0', desc: '이름', validation: null },
        { key: 'lstnm', name: '성', depth: 1, required: true, type: 'STRING', size: '0', desc: '성', validation: null },
        { key: 'nationId', name: '국가ID', depth: 1, required: true, type: 'STRING', size: '0', desc: '국가ID', validation: null },
        { key: 'phone', name: '전화번호', depth: 1, required: true, type: 'STRING', size: '0', desc: '전화번호', validation: null },
        { key: 'email', name: '이메일', depth: 1, required: true, type: 'STRING', size: '0', desc: '이메일', validation: null },
        { key: 'cpny', name: '회사', depth: 1, required: true, type: 'STRING', size: '0', desc: '회사', validation: null },
        { key: 'marketactyn', name: '마케팅정보동의여부', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '', validation: null },
      ]
    },
    {
      name: '이벤트 응모자(비회원) 삭제',
      tag: '99',
      apicd: 'api0990',
      url: 'evtentremove',
      desc: '이벤트 응모자(비회원) 삭제',
      input_param: [
        { key: 'id', name: '게시물ID', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '게시물ID', validation: null },
      ]
    },
    {
      name: '이벤트 응모자(비회원) 검색',
      tag: '100',
      apicd: 'api1000',
      url: 'evtentsearch',
      desc: '이벤트 응모자(비회원)',
      input_param: [
        { key: 'evtId', name: '이벤트ID', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '이벤트 게시물ID', validation: null },
        { key: 'retxls', name: '엑셀', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '엑셀로 받기:1', validation: null },
        { key: 'srchprt', name: '검색구분', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '이름:1 / 이메일:2', validation: null },
        { key: 'srchwrd', name: '검색어', depth: 1, required: false, type: 'STRING', size: '0', desc: '검색어', validation: null },
        { key: 'offset', name: '오프셋', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '오프셋', validation: null },
        { key: 'limit', name: '제한', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '제한', validation: null },
      ]
    },
    ////////////////////////////////////////////////////////////////
    {
      name: '이벤트 응모자(회원) 추가',
      tag: '101',
      apicd: 'api1010',
      url: 'evtjininsert',
      desc: '이벤트 응모자(회원) 추가',
      input_param: [
        { key: 'evtId', name: '이벤트ID', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '이벤트ID', validation: null },
        { key: 'marketactyn', name: '마케팅정보동의여부', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '', validation: null },
      ]
    },
    {
      name: '이벤트 응모자(회원) 삭제',
      tag: '102',
      apicd: 'api1020',
      url: 'evtjinremove',
      desc: '이벤트 응모자(회원) 삭제',
      input_param: [
        { key: 'id', name: '게시물ID', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '게시물ID', validation: null },
      ]
    },
    {
      name: '이벤트 응모자(회원) 검색',
      tag: '103',
      apicd: 'api1030',
      url: 'evtjinsearch',
      desc: '이벤트 응모자(비회원)',
      input_param: [
        { key: 'evtId', name: '이벤트ID', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '이벤트 게시물ID', validation: null },
        { key: 'retxls', name: '엑셀', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '엑셀로 받기:1', validation: null },
        { key: 'srchprt', name: '검색구분', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '이름:1 / 이메일:2', validation: null },
        { key: 'srchwrd', name: '검색어', depth: 1, required: false, type: 'STRING', size: '0', desc: '검색어', validation: null },
        { key: 'offset', name: '오프셋', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '오프셋', validation: null },
        { key: 'limit', name: '제한', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '제한', validation: null },
      ]
    },
    ////////////////////////////////////////////////////////////////
    {
      name: '릴리즈 노트 추가',
      tag: '104',
      apicd: 'api1040',
      url: 'relnoteinsert',
      desc: '릴리즈 노트 추가',
      input_param: [
        { key: 'loc', name: '언어', depth: 1, required: true, type: 'STRING', size: '0', desc: '한글:ko, 영어:en', validation: null_is_invalid, validation_hints: vhints.null_is_invalid },
        { key: 'state', name: '상태', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '비공개:1 / 공개:2', validation: null },
        { key: 'bbsccdId', name: '분류ID', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '분류ID', validation: null },
        { key: 'ver', name: '버전', depth: 1, required: true, type: 'STRING', size: '0', desc: '버전', validation: null },
        { key: 'cmslink', name: 'CMS링크', depth: 1, required: false, type: 'STRING', size: '0', desc: 'CMS링크', validation: null },
        { key: 'cont', name: '내용', depth: 1, required: true, type: 'STRING', size: '0', desc: '내용', validation: null },
      ]
    },
    {
      name: '릴리즈 노트 수정',
      tag: '105',
      apicd: 'api1050',
      url: 'relnotemodify',
      desc: '릴리즈 노트 수정',
      input_param: [
        { key: 'id', name: '게시물ID', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '게시물ID', validation: null },
        { key: 'loc', name: '언어', depth: 1, required: true, type: 'STRING', size: '0', desc: '한글:ko, 영어:en', validation: null_is_invalid, validation_hints: vhints.null_is_invalid },
        { key: 'state', name: '상태', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '비공개:1 / 공개:2', validation: null },
        { key: 'bbsccdId', name: '분류ID', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '분류ID', validation: null },
        { key: 'ver', name: '버전', depth: 1, required: true, type: 'STRING', size: '0', desc: '버전', validation: null },
        { key: 'cmslink', name: 'CMS링크', depth: 1, required: false, type: 'STRING', size: '0', desc: 'CMS링크', validation: null },
        { key: 'cont', name: '내용', depth: 1, required: true, type: 'STRING', size: '0', desc: '내용', validation: null },
      ]
    },
    {
      name: '릴리즈 노트 삭제',
      tag: '106',
      apicd: 'api1060',
      url: 'relnoteremove',
      desc: '릴리즈 노트 삭제',
      input_param: [
        { key: 'id', name: '게시물ID', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '게시물ID', validation: null },
      ]
    },
    {
      name: '릴리즈 노트 검색',
      tag: '107',
      apicd: 'api1070',
      url: 'relnotesearch',
      desc: '릴리즈 노트 검색',
      input_param: [
        { key: 'loc', name: '언어', depth: 1, required: false, type: 'STRING', size: '0', desc: '한글:ko, 영어:en', validation: null },
        { key: 'state', name: '상태', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '상태', validation: null },
        { key: 'bbsccdId', name: '분류ID', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '분류ID', validation: null },
        { key: 'srchprt', name: '검색구분', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '버전:1 / 내용:2', validation: null },
        { key: 'srchwrd', name: '검색어', depth: 1, required: false, type: 'STRING', size: '0', desc: '검색어', validation: null },
        { key: 'offset', name: '오프셋', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '오프셋', validation: null },
        { key: 'limit', name: '제한', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '제한', validation: null },
        { key: 'orderitem', name: '정렬아이템', depth: 1, required: false, type: 'STRING', size: '0', desc: '아이디:id, 버전:ver', validation: null },
        { key: 'orderby', name: '정렬', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '역순:0, 순차:1', validation: null },
      ]
    },
    ////////////////////////////////////////////////////////////////
    {
      name: '온라인 메뉴얼 추가',
      tag: '108',
      apicd: 'api1080',
      url: 'olmaninsert',
      desc: '온라인 메뉴얼 추가',
      input_param: [
        { key: 'loc', name: '언어', depth: 1, required: true, type: 'STRING', size: '0', desc: '한글:ko, 영어:en', validation: null_is_invalid, validation_hints: vhints.null_is_invalid },
        { key: 'state', name: '상태', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '비공개:1 / 공개:2', validation: null },
        { key: 'bbsccdId', name: '분류ID', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '분류ID', validation: null },
        { key: 'ver', name: '버전', depth: 1, required: true, type: 'STRING', size: '0', desc: '버전', validation: null },
        { key: 'url', name: 'URL', depth: 1, required: false, type: 'STRING', size: '0', desc: 'URL', validation: null },
        { key: 'cont', name: '내용', depth: 1, required: true, type: 'STRING', size: '0', desc: '내용', validation: null },
      ]
    },
    {
      name: '온라인 메뉴얼 수정',
      tag: '109',
      apicd: 'api1090',
      url: 'olmanmodify',
      desc: '온라인 메뉴얼 수정',
      input_param: [
        { key: 'id', name: '게시물ID', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '게시물ID', validation: null },
        { key: 'loc', name: '언어', depth: 1, required: true, type: 'STRING', size: '0', desc: '한글:ko, 영어:en', validation: null_is_invalid, validation_hints: vhints.null_is_invalid },
        { key: 'state', name: '상태', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '비공개:1 / 공개:2', validation: null },
        { key: 'bbsccdId', name: '분류ID', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '분류ID', validation: null },
        { key: 'ver', name: '버전', depth: 1, required: true, type: 'STRING', size: '0', desc: '버전', validation: null },
        { key: 'url', name: 'URL', depth: 1, required: false, type: 'STRING', size: '0', desc: 'URL', validation: null },
        { key: 'cont', name: '내용', depth: 1, required: true, type: 'STRING', size: '0', desc: '내용', validation: null },
      ]
    },
    {
      name: '온라인 메뉴얼 삭제',
      tag: '110',
      apicd: 'api1100',
      url: 'olmanremove',
      desc: '온라인 메뉴얼 삭제',
      input_param: [
        { key: 'id', name: '게시물ID', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '게시물ID', validation: null },
      ]
    },
    {
      name: '온라인 메뉴얼 검색',
      tag: '111',
      apicd: 'api1110',
      url: 'olmansearch',
      desc: '온라인 메뉴얼 검색',
      input_param: [
        { key: 'loc', name: '언어', depth: 1, required: false, type: 'STRING', size: '0', desc: '한글:ko, 영어:en', validation: null },
        { key: 'state', name: '상태', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '상태', validation: null },
        { key: 'bbsccdId', name: '분류ID', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '분류ID', validation: null },
        { key: 'srchprt', name: '검색구분', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '버전:1 / 내용:2', validation: null },
        { key: 'srchwrd', name: '검색어', depth: 1, required: false, type: 'STRING', size: '0', desc: '검색어', validation: null },
        { key: 'offset', name: '오프셋', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '오프셋', validation: null },
        { key: 'limit', name: '제한', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '제한', validation: null },
        { key: 'orderitem', name: '정렬아이템', depth: 1, required: false, type: 'STRING', size: '0', desc: '아이디:id, 버전:ver', validation: null },
        { key: 'orderby', name: '정렬', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '역순:0, 순차:1', validation: null },
      ]
    },
    ////////////////////////////////////////////////////////////////
    {
      name: 'Trial Version 추가',
      tag: '112',
      apicd: 'api1120',
      url: 'triverinsert',
      desc: 'Trial Version 추가',
      input_param: [
        { key: 'updfId', name: '파일ID', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '파일ID', validation: null },
        { key: 'memo', name: '메모', depth: 1, required: true, type: 'STRING', size: '0', desc: '메모', validation: null },
      ]
    },
    {
      name: 'Trial Version 수정',
      tag: '113',
      apicd: 'api1130',
      url: 'trivermodify',
      desc: 'Trial Version 수정',
      input_param: [
        { key: 'id', name: '게시물ID', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '게시물ID', validation: null },
        { key: 'updfId', name: '파일ID', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '파일ID', validation: null },
        { key: 'memo', name: '메모', depth: 1, required: true, type: 'STRING', size: '0', desc: '메모', validation: null },
      ]
    },
    {
      name: 'Trial Version 삭제',
      tag: '114',
      apicd: 'api1140',
      url: 'triverremove',
      desc: 'Trial Version 삭제',
      input_param: [
        { key: 'id', name: '게시물ID', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '게시물ID', validation: null },
      ]
    },
    {
      name: 'Trial Version 검색',
      tag: '115',
      apicd: 'api1150',
      url: 'triversearch',
      desc: 'Trial Version 검색',
      input_param: [
        { key: 'srchprt', name: '검색구분', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '메모:1', validation: null },
        { key: 'srchwrd', name: '검색어', depth: 1, required: false, type: 'STRING', size: '0', desc: '검색어', validation: null },
        { key: 'offset', name: '오프셋', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '오프셋', validation: null },
        { key: 'limit', name: '제한', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '제한', validation: null },
      ]
    },
    {
      name: 'Triver Version 정보',
      tag: '1151',
      apicd: 'api1151',
      url: 'triverinfo',
      desc: 'Triver Version 정보',
      input_param: [
      ]
    },
    ////////////////////////////////////////////////////////////////
    {
      name: '체험판 다운로드 신청 추가',
      tag: '116',
      apicd: 'api1160',
      url: 'triloginsert',
      desc: '체험판 다운로드 신청 추가',
      input_param: [
        { key: 'fstnm', name: '이름', depth: 1, required: true, type: 'STRING', size: '0', desc: '이름', validation: null },
        { key: 'lstnm', name: '성', depth: 1, required: true, type: 'STRING', size: '0', desc: '성', validation: null },
        { key: 'email', name: '이메일', depth: 1, required: true, type: 'STRING', size: '0', desc: '이메일', validation: null },
        { key: 'nationId', name: '국가ID', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '국가ID', validation: null },
        { key: 'phone', name: '전화번호', depth: 1, required: true, type: 'STRING', size: '0', desc: '전화번호', validation: null },
        { key: 'agencynm', name: '기업명', depth: 1, required: true, type: 'STRING', size: '0', desc: '기업명', validation: null },
        { key: 'pcplan', name: '구매계획', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '구매계획', validation: null },
        //{ key: 'triverId', name: '트라이얼버전ID', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '트라이얼버전ID', validation: null },
        { key: 'marketactyn', name: '마케팅정보동의여부', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '', validation: null },
      ]
    },
    {
      name: '체험판 다운로드 신청 삭제',
      tag: '117',
      apicd: 'api1170',
      url: 'triverremove',
      desc: '체험판 다운로드 신청 삭제',
      input_param: [
        { key: 'id', name: '게시물ID', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '게시물ID', validation: null },
      ]
    },
    {
      name: '체험판 다운로드 신청 검색',
      tag: '118',
      apicd: 'api1180',
      url: 'trilogsearch',
      desc: '체험판 다운로드 신청 검색',
      input_param: [
        { key: 'pcplan', name: '구매계획', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '구매계획', validation: null },
        { key: 'srchsdt', name: '조회시작날짜', depth: 1, required: false, type: 'STRING', size: '0', desc: '조회시작날짜', validation: null },
        { key: 'srchedt', name: '조회끝날짜', depth: 1, required: false, type: 'STRING', size: '0', desc: '조회끝날짜', validation: null },
        { key: 'srchprt', name: '검색구분', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '이름:1, 회사명:2, 이메일:3', validation: null },
        { key: 'srchwrd', name: '검색어', depth: 1, required: false, type: 'STRING', size: '0', desc: '검색어', validation: null },
        { key: 'offset', name: '오프셋', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '오프셋', validation: null },
        { key: 'limit', name: '제한', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '제한', validation: null },
      ]
    },
    ////////////////////////////////////////////////////////////////
    {
      name: 'Official Version 추가',
      tag: '119',
      apicd: 'api1190',
      url: 'oflverinsert',
      desc: 'Official Version 추가',
      input_param: [
        { key: 'bbsccdId', name: '분류ID', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '분류ID', validation: null },
        { key: 'ver', name: '버전', depth: 1, required: true, type: 'STRING', size: '0', desc: '버전', validation: null },
        { key: 'updfId', name: '파일ID', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '파일ID', validation: null },
        { key: 'state', name: '상태', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '상태', validation: null },
        { key: 'memo', name: '메모', depth: 1, required: true, type: 'STRING', size: '0', desc: '메모', validation: null },
      ]
    },
    {
      name: 'Official Version 수정',
      tag: '120',
      apicd: 'api1200',
      url: 'oflvermodify',
      desc: 'Official Version 수정',
      input_param: [
        { key: 'id', name: '게시물ID', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '게시물ID', validation: null },
        { key: 'bbsccdId', name: '분류ID', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '분류ID', validation: null },
        { key: 'ver', name: '버전', depth: 1, required: true, type: 'STRING', size: '0', desc: '버전', validation: null },
        { key: 'updfId', name: '파일ID', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '파일ID', validation: null },
        { key: 'state', name: '상태', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '상태', validation: null },
        { key: 'memo', name: '메모', depth: 1, required: true, type: 'STRING', size: '0', desc: '메모', validation: null },
      ]
    },
    {
      name: 'Official Version 삭제',
      tag: '121',
      apicd: 'api1210',
      url: 'oflverremove',
      desc: 'Official Version 삭제',
      input_param: [
        { key: 'id', name: '게시물ID', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '게시물ID', validation: null },
      ]
    },
    {
      name: 'Official Version 검색',
      tag: '122',
      apicd: 'api1220',
      url: 'oflversearch',
      desc: 'Official Version 검색',
      input_param: [
        { key: 'state', name: '상태', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '상태', validation: null },
        { key: 'bbsccdId', name: '분류ID', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '분류ID', validation: null },
        { key: 'srchprt', name: '검색구분', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '버전:1 / 메모:2', validation: null },
        { key: 'srchwrd', name: '검색어', depth: 1, required: false, type: 'STRING', size: '0', desc: '검색어', validation: null },
        { key: 'offset', name: '오프셋', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '오프셋', validation: null },
        { key: 'limit', name: '제한', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '제한', validation: null },
        { key: 'orderitem', name: '정렬아이템', depth: 1, required: false, type: 'STRING', size: '0', desc: '아이디:id, 버전:ver', validation: null },
        { key: 'orderby', name: '정렬', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '역순:0, 순차:1', validation: null },
      ]
    },
    ////////////////////////////////////////////////////////////////
    {
      name: 'Sample Resource 추가',
      tag: '123',
      apicd: 'api1230',
      url: 'spresinsert',
      desc: 'Sample Resource 추가',
      input_param: [
        { key: 'loc', name: '언어', depth: 1, required: true, type: 'STRING', size: '0', desc: '한글:ko, 영어:en', validation: null_is_invalid, validation_hints: vhints.null_is_invalid },
        { key: 'bbsccdId', name: '분류ID', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '분류ID', validation: null },
        { key: 'nm', name: '제목', depth: 1, required: true, type: 'STRING', size: '0', desc: '제목', validation: null },
        { key: 'updfs', name: '첨부파일', depth: 1, required: false, type: 'STRING', size: '0', desc: '첨부파일', validation: null },
        { key: 'state', name: '상태', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '상태', validation: null },
        { key: 'cont', name: '내용', depth: 1, required: true, type: 'STRING', size: '0', desc: '내용', validation: null },
      ]
    },
    {
      name: 'Sample Resource 수정',
      tag: '124',
      apicd: 'api1240',
      url: 'spresmodify',
      desc: 'Sample Resource 수정',
      input_param: [
        { key: 'id', name: '게시물ID', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '게시물ID', validation: null },
        { key: 'loc', name: '언어', depth: 1, required: true, type: 'STRING', size: '0', desc: '한글:ko, 영어:en', validation: null_is_invalid, validation_hints: vhints.null_is_invalid },
        { key: 'bbsccdId', name: '분류ID', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '분류ID', validation: null },
        { key: 'nm', name: '제목', depth: 1, required: true, type: 'STRING', size: '0', desc: '제목', validation: null },
        { key: 'updfs', name: '첨부파일', depth: 1, required: false, type: 'STRING', size: '0', desc: '첨부파일', validation: null },
        { key: 'state', name: '상태', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '상태', validation: null },
        { key: 'cont', name: '내용', depth: 1, required: true, type: 'STRING', size: '0', desc: '내용', validation: null },
      ]
    },
    {
      name: 'Sample Resource 삭제',
      tag: '125',
      apicd: 'api1250',
      url: 'spresremove',
      desc: 'Sample Resource 삭제',
      input_param: [
        { key: 'id', name: '게시물ID', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '게시물ID', validation: null },
      ]
    },
    {
      name: 'Sample Resource 검색',
      tag: '126',
      apicd: 'api1260',
      url: 'spressearch',
      desc: 'Sample Resource 검색',
      input_param: [
        { key: 'loc', name: '언어', depth: 1, required: false, type: 'STRING', size: '0', desc: '한글:ko, 영어:en', validation: null },
        { key: 'bbsccdId', name: '분류ID', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '분류ID', validation: null },
        { key: 'state', name: '상태', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '상태', validation: null },
        { key: 'srchprt', name: '검색구분', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '제목:1 / 내용:2 / 등록자:3', validation: null },
        { key: 'srchwrd', name: '검색어', depth: 1, required: false, type: 'STRING', size: '0', desc: '검색어', validation: null },
        { key: 'offset', name: '오프셋', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '오프셋', validation: null },
        { key: 'limit', name: '제한', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '제한', validation: null },
        { key: 'orderitem', name: '정렬아이템', depth: 1, required: false, type: 'STRING', size: '0', desc: '아이디:id, 제목:nm', validation: null },
        { key: 'orderby', name: '정렬', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '역순:0, 순차:1', validation: null },
      ]
    },
    ////////////////////////////////////////////////////////////////
    {
      name: 'Sales Material 추가',
      tag: '127',
      apicd: 'api1270',
      url: 'ssmatinsert',
      desc: 'Sales Material 추가',
      input_param: [
        { key: 'loc', name: '언어', depth: 1, required: true, type: 'STRING', size: '0', desc: '한글:ko, 영어:en', validation: null_is_invalid, validation_hints: vhints.null_is_invalid },
        { key: 'nm', name: '제목', depth: 1, required: true, type: 'STRING', size: '0', desc: '제목', validation: null },
        { key: 'bbsccdId', name: '분류ID', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '분류ID', validation: null },
        { key: 'updfs', name: '첨부파일', depth: 1, required: false, type: 'STRING', size: '0', desc: '첨부파일', validation: null },
        { key: 'state', name: '상태', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '상태', validation: null },
        { key: 'cont', name: '내용', depth: 1, required: true, type: 'STRING', size: '0', desc: '내용', validation: null },
      ]
    },
    {
      name: 'Sales Material 수정',
      tag: '128',
      apicd: 'api1280',
      url: 'ssmatmodify',
      desc: 'Sales Material 수정',
      input_param: [
        { key: 'id', name: '게시물ID', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '게시물ID', validation: null },
        { key: 'loc', name: '언어', depth: 1, required: true, type: 'STRING', size: '0', desc: '한글:ko, 영어:en', validation: null_is_invalid, validation_hints: vhints.null_is_invalid },
        { key: 'nm', name: '제목', depth: 1, required: true, type: 'STRING', size: '0', desc: '제목', validation: null },
        { key: 'bbsccdId', name: '분류ID', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '분류ID', validation: null },
        { key: 'updfs', name: '첨부파일', depth: 1, required: false, type: 'STRING', size: '0', desc: '첨부파일', validation: null },
        { key: 'state', name: '상태', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '상태', validation: null },
        { key: 'cont', name: '내용', depth: 1, required: true, type: 'STRING', size: '0', desc: '내용', validation: null },
      ]
    },
    {
      name: 'Sales Material 삭제',
      tag: '129',
      apicd: 'api1290',
      url: 'ssmatremove',
      desc: 'Sales Material 삭제',
      input_param: [
        { key: 'id', name: '게시물ID', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '게시물ID', validation: null },
      ]
    },
    {
      name: 'Sales Material 검색',
      tag: '130',
      apicd: 'api1300',
      url: 'ssmatsearch',
      desc: 'Sales Material 검색',
      input_param: [
        { key: 'state', name: '상태', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '상태', validation: null },
        { key: 'loc', name: '언어', depth: 1, required: false, type: 'STRING', size: '0', desc: '한글:ko, 영어:en', validation: null },
        { key: 'bbsccdId', name: '분류ID', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '분류ID', validation: null },
        { key: 'srchprt', name: '검색구분', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '제목:1 / 내용:2 / 등록자:3', validation: null },
        { key: 'srchwrd', name: '검색어', depth: 1, required: false, type: 'STRING', size: '0', desc: '검색어', validation: null },
        { key: 'offset', name: '오프셋', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '오프셋', validation: null },
        { key: 'limit', name: '제한', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '제한', validation: null },
        { key: 'orderitem', name: '정렬아이템', depth: 1, required: false, type: 'STRING', size: '0', desc: '아이디:id, 제목:nm', validation: null },
        { key: 'orderby', name: '정렬', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '역순:0, 순차:1', validation: null },
      ]
    },
    ////////////////////////////////////////////////////////////////
    {
      name: '검색키워드 관리 추가',
      tag: '131',
      apicd: 'api1310',
      url: 'skmaninsert',
      desc: '검색키워드 관리 추가',
      input_param: [
        { key: 'loc', name: '언어', depth: 1, required: true, type: 'STRING', size: '0', desc: '한글:ko, 영어:en', validation: null_is_invalid, validation_hints: vhints.null_is_invalid },
        { key: 'sks', name: '검색키워드', depth: 1, required: true, type: 'STRING', size: '0', desc: '검색키워드', validation: null_is_invalid, validation_hints: vhints.null_is_invalid },
      ]
    },
    {
      name: '검색키워드 관리 수정',
      tag: '132',
      apicd: 'api1320',
      url: 'skmanmodify',
      desc: '검색키워드 관리 수정',
      input_param: [
        { key: 'id', name: '게시물ID', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '게시물ID', validation: null },
        { key: 'loc', name: '언어', depth: 1, required: true, type: 'STRING', size: '0', desc: '한글:ko, 영어:en', validation: null_is_invalid, validation_hints: vhints.null_is_invalid },
        { key: 'sks', name: '검색키워드', depth: 1, required: true, type: 'STRING', size: '0', desc: '검색키워드', validation: null_is_invalid, validation_hints: vhints.null_is_invalid },
      ]
    },
    {
      name: '검색키워드 관리 삭제',
      tag: '133',
      apicd: 'api1330',
      url: 'skmanremove',
      desc: '검색키워드 관리 삭제',
      input_param: [
        { key: 'id', name: '게시물ID', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '게시물ID', validation: null },
      ]
    },
    {
      name: '검색키워드 관리 검색',
      tag: '134',
      apicd: 'api1340',
      url: 'skmansearch',
      desc: '검색키워드 관리 검색',
      input_param: [
        { key: 'loc', name: '언어', depth: 1, required: false, type: 'STRING', size: '0', desc: '한글:ko, 영어:en', validation: null },
        { key: 'srchprt', name: '검색구분', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '검색구분', validation: null },
        { key: 'srchwrd', name: '검색어', depth: 1, required: false, type: 'STRING', size: '0', desc: '검색어', validation: null },
        { key: 'offset', name: '오프셋', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '오프셋', validation: null },
        { key: 'limit', name: '제한', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '제한', validation: null },
      ]
    },
    ////////////////////////////////////////////////////////////////
    {
      name: '약관 관리 추가',
      tag: '135',
      apicd: 'api1350',
      url: 'tcmaninsert',
      desc: '약관 관리 추가',
      input_param: [
        { key: 'loc', name: '언어', depth: 1, required: true, type: 'STRING', size: '0', desc: '한글:ko, 영어:en', validation: null_is_invalid, validation_hints: vhints.null_is_invalid },
        { key: 'ccd', name: '약관구분', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '약관구분', validation: null },
        { key: 'ver', name: '버전', depth: 1, required: true, type: 'STRING', size: '0', desc: '버전', validation: null },
        { key: 'revdt', name: '개정일', depth: 1, required: true, type: 'STRING', size: '0', desc: '개정일', validation: null },
        { key: 'appdt', name: '적용일', depth: 1, required: true, type: 'STRING', size: '0', desc: '적용일', validation: null },
        { key: 'cont', name: '내용', depth: 1, required: true, type: 'STRING', size: '0', desc: '내용', validation: null_is_invalid, validation_hints: vhints.null_is_invalid },
      ]
    },
    {
      name: '약관 관리 수정',
      tag: '136',
      apicd: 'api1360',
      url: 'tcmanmodify',
      desc: '약관 관리 수정',
      input_param: [
        { key: 'id', name: '게시물ID', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '게시물ID', validation: null },
        { key: 'loc', name: '언어', depth: 1, required: true, type: 'STRING', size: '0', desc: '한글:ko, 영어:en', validation: null_is_invalid, validation_hints: vhints.null_is_invalid },
        { key: 'ccd', name: '약관구분', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '약관구분', validation: null },
        { key: 'ver', name: '버전', depth: 1, required: true, type: 'STRING', size: '0', desc: '버전', validation: null },
        { key: 'revdt', name: '개정일', depth: 1, required: true, type: 'STRING', size: '0', desc: '개정일', validation: null },
        { key: 'appdt', name: '적용일', depth: 1, required: true, type: 'STRING', size: '0', desc: '적용일', validation: null },
        { key: 'cont', name: '내용', depth: 1, required: true, type: 'STRING', size: '0', desc: '내용', validation: null_is_invalid, validation_hints: vhints.null_is_invalid },
      ]
    },
    {
      name: '약관 관리 삭제',
      tag: '137',
      apicd: 'api1370',
      url: 'tcmanremove',
      desc: '약관 관리 삭제',
      input_param: [
        { key: 'id', name: '게시물ID', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '게시물ID', validation: null },
      ]
    },
    {
      name: '약관 관리 검색',
      tag: '138',
      apicd: 'api1380',
      url: 'tcmansearch',
      desc: '약관 관리 검색',
      input_param: [
        { key: 'ccd', name: '약관구분', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '이용약관:1 / 개인정보처리방침:2 / 제3자정보제공동의:3', validation: null },
        { key: 'loc', name: '언어', depth: 1, required: false, type: 'STRING', size: '0', desc: '한글:ko, 영어:en', validation: null },
        { key: 'srchprt', name: '검색구분', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '버전:1 / 내용:2', validation: null },
        { key: 'srchwrd', name: '검색어', depth: 1, required: false, type: 'STRING', size: '0', desc: '검색어', validation: null },
        { key: 'offset', name: '오프셋', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '오프셋', validation: null },
        { key: 'limit', name: '제한', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '제한', validation: null },
      ]
    },
    {
      name: '약관 관리 검색 (공개용)',
      tag: '138.1',
      apicd: 'api1381',
      url: 'tcmansearchpub',
      desc: '약관 관리 검색 (공개용)',
      input_param: [
        { key: 'ccd', name: '약관구분', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '이용약관:1 / 개인정보처리방침:2 / 제3자정보제공동의:3', validation: null },
        { key: 'loc', name: '언어', depth: 1, required: true, type: 'STRING', size: '0', desc: '한글:ko, 영어:en', validation: null },
      ]
    },
    ////////////////////////////////////////////////////////////////
    {
      name: '메뉴관리 추가',
      tag: '139',
      apicd: 'api1390',
      url: 'mnuminsert',
      desc: '메뉴관리 추가',
      input_param: [
        { key: 'data', name: 'DATA', depth: 1, required: true, type: 'STRING', size: '0', desc: 'JSON DATA', validation: null_is_invalid, validation_hints: vhints.null_is_invalid },
      ]
    },
    {
      name: '메뉴관리 수정',
      tag: '140',
      apicd: 'api1400',
      url: 'mnummodify',
      desc: '메뉴관리 수정',
      input_param: [
        { key: 'id', name: '게시물ID', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '게시물ID', validation: null },
        { key: 'data', name: 'DATA', depth: 1, required: true, type: 'STRING', size: '0', desc: 'JSON DATA', validation: null_is_invalid, validation_hints: vhints.null_is_invalid },
      ]
    },
    {
      name: '메뉴관리 삭제',
      tag: '141',
      apicd: 'api1410',
      url: 'mnumremove',
      desc: '메뉴관리 삭제',
      input_param: [
        { key: 'id', name: '게시물ID', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '게시물ID', validation: null },
      ]
    },
    {
      name: '메뉴관리 검색',
      tag: '142',
      apicd: 'api1420',
      url: 'mnumsearch',
      desc: '메뉴관리 검색',
      input_param: [
        { key: 'srchprt', name: '검색구분', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '검색구분', validation: null },
        { key: 'srchwrd', name: '검색어', depth: 1, required: false, type: 'STRING', size: '0', desc: '검색어', validation: null },
        { key: 'offset', name: '오프셋', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '오프셋', validation: null },
        { key: 'limit', name: '제한', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '제한', validation: null },
      ]
    },
    ////////////////////////////////////////////////////////////////
    {
      name: '게시물 공개 상태 변경',
      tag: '143',
      apicd: 'api1430',
      url: 'bbschangestate',
      desc: '게시물 공개 상태 변경',
      input_param: [
        { key: 'bbsnm', name: '게시판 이름', depth: 1, required: true, type: 'STRING', size: '0', desc: '변경하려는 게시물의 게시판 이름', validation: null_is_invalid, validation_hints: vhints.null_is_invalid },
        { key: 'tgstate', name: '공개 상태', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '비공개:1 / 공개:2', validation: null },
        { key: 'tgids', name: '게시물IDS', depth: 1, required: true, type: 'STRING', size: '0', desc: '게시물ID JSON 배열', validation: null },
      ]
    },
    ////////////////////////////////////////////////////////////////
    {
      name: '데모신청 추가',
      tag: '144',
      apicd: 'api1440',
      url: 'dmorqinsert',
      desc: '데모신청 추가',
      input_param: [
        { key: 'nationId', name: '국가ID', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '', validation: null },
        { key: 'agencynm', name: '기업명', depth: 1, required: true, type: 'STRING', size: '0', desc: '기업명', validation: null },
        { key: 'nm', name: '이름', depth: 1, required: true, type: 'STRING', size: '0', desc: '이름', validation: null },
        { key: 'lstnm', name: '성', depth: 1, required: true, type: 'STRING', size: '0', desc: '성', validation: null },
        { key: 'email', name: '이메일', depth: 1, required: true, type: 'STRING', size: '0', desc: '이메일', validation: null },
        { key: 'phone', name: '전화번호', depth: 1, required: true, type: 'STRING', size: '0', desc: '전화번호', validation: null },
        { key: 'marketactyn', name: '마케팅정보동의여부', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '', validation: null },
      ]
    },
    {
      name: '데모신청 상태 업데이트',
      tag: '145',
      apicd: 'api1450',
      url: 'dmorqupdatestate',
      desc: '데모신청 상태 업데이트',
      input_param: [
        { key: 'ids', name: '게시물IDS', depth: 1, required: true, type: 'STRING', size: '0', desc: '게시물ID JSON 배열', validation: null },
        { key: 'state', name: '상태', depth: 1, required: true, type: 'STRING', size: '0', desc: '변경될 상태를 입력, 신청:1 / 완료:2', validation: null },
      ]
    },
    {
      name: '데모신청 검색',
      tag: '146',
      apicd: 'api1460',
      url: 'dmorqsearch',
      desc: '데모신청 검색',
      input_param: [
        { key: 'state', name: '상태', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '신청:1 / 완료:2', validation: null },
        { key: 'srchprt', name: '검색구분', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '이메일:1 / 전화번호:2 / 회사명:3', validation: null },
        { key: 'srchwrd', name: '검색어', depth: 1, required: false, type: 'STRING', size: '0', desc: '검색어', validation: null },
        { key: 'offset', name: '오프셋', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '오프셋', validation: null },
        { key: 'limit', name: '제한', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '제한', validation: null },
      ]
    },
    ////////////////////////////////////////////////////////////////
    {
      name: '문의내역 추가',
      tag: '147',
      apicd: 'api1470',
      url: 'inqryinsert',
      desc: '문의내역 추가',
      input_param: [
        { key: 'nationId', name: '국가ID', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '', validation: null },
        { key: 'agencynm', name: '기업명', depth: 1, required: true, type: 'STRING', size: '0', desc: '기업명', validation: null_is_invalid, validation_hints: vhints.null_is_invalid },
        { key: 'nm', name: '이름', depth: 1, required: true, type: 'STRING', size: '0', desc: '이름', validation: null_is_invalid, validation_hints: vhints.null_is_invalid },
        { key: 'lstnm', name: '성', depth: 1, required: true, type: 'STRING', size: '0', desc: '성', validation: null_is_invalid, validation_hints: vhints.null_is_invalid },
        { key: 'email', name: '이메일', depth: 1, required: true, type: 'STRING', size: '0', desc: '이메일', validation: null_is_invalid, validation_hints: vhints.null_is_invalid },
        { key: 'phone', name: '전화번호', depth: 1, required: true, type: 'STRING', size: '0', desc: '전화번호', validation: null },
        { key: 'cont', name: '내용', depth: 1, required: true, type: 'STRING', size: '0', desc: '내용', validation: null_is_invalid, validation_hints: vhints.null_is_invalid },
        { key: 'marketactyn', name: '마케팅정보동의여부', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '', validation: null },
      ]
    },
    {
      name: '문의내역 답변 업데이트',
      tag: '148',
      apicd: 'api1480',
      url: 'inqryupdateans',
      desc: '문의내역 답변 업데이트',
      input_param: [
        { key: 'id', name: '게시물ID', depth: 1, required: true, type: 'INTEGER', size: '0', desc: '게시물ID', validation: null },
        { key: 'anscont', name: '답변내용', depth: 1, required: true, type: 'STRING', size: '0', desc: '답변내용', validation: null_is_invalid, validation_hints: vhints.null_is_invalid },
      ]
    },
    {
      name: '문의내역 검색',
      tag: '149',
      apicd: 'api1490',
      url: 'inqrysearch',
      desc: '문의내역 검색',
      input_param: [
        { key: 'state', name: '상태', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '신청:1 / 완료:2', validation: null },
        { key: 'srchprt', name: '검색구분', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '이메일:1 / 내용:2', validation: null },
        { key: 'srchwrd', name: '검색어', depth: 1, required: false, type: 'STRING', size: '0', desc: '검색어', validation: null },
        { key: 'offset', name: '오프셋', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '오프셋', validation: null },
        { key: 'limit', name: '제한', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '제한', validation: null },
        { key: 'orderby', name: '정렬', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '역순:0, 순차:1', validation: null },
      ]
    },
    {
      name: '태그 검색',
      tag: '150',
      apicd: 'api1500',
      url: 'tagsearch',
      desc: '태그 검색',
      input_param: [
        { key: 'loc', name: '언어', depth: 1, required: false, type: 'STRING', size: '0', desc: '한글:ko, 영어:en', validation: null },
        { key: 'srchprt', name: '검색구분', depth: 1, required: false, type: 'INTEGER', size: '0', desc: 'lnct:1 / dgnlib:2 / tutclp:3', validation: null },
        { key: 'srchwrd', name: '검색어', depth: 1, required: true, type: 'STRING', size: '0', desc: '[\"태그명1\", \"태그명2\"]', validation: null_is_invalid, validation_hints: vhints.null_is_invalid },
        { key: 'offset', name: '오프셋', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '오프셋', validation: null },
        { key: 'limit', name: '제한', depth: 1, required: false, type: 'INTEGER', size: '0', desc: '제한', validation: null },
      ]
    },
  ]
}

module.exports = API_DEFS;
