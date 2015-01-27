// Author: sanghee park <novles@naver.com>
// Create Date: 2014.1.12
// code table access 

var debug = require('debug')('OutOfficeDao');
var util = require('util');
var db = require('../lib/dbmanager.js');

var OutOfficeDao = function () {
};
OutOfficeDao.prototype.selectOutOfficeList =  function () {
    var queryStr = util.format(db.getQuery('outOffice', 'selectOutOfficeList'));
    return db.queryV2(queryStr);
};
OutOfficeDao.prototype.insertOutOffice =  function (connection, data) {
    var queryStr = util.format(db.getQuery('outOffice', 'insertOutOffice'));
    return db.queryTransaction(
        connection,
        queryStr,
        data,
        [
            "year", "date", "id", "office_code", "office_code",  "memo", "doc_num", "black_mark", "start_time", "end_time"
        ]
    ); 
    
    // return db.queryV2(queryStr, [year, _data.date, _data.id, _data.office_code, _data.office_code,  _data.memo, _data.doc_num, _data.black_mark, _data.start_time, _data.end_time]);
};
OutOfficeDao.prototype.removeOutOffice =  function (doc_num) {
    var queryStr = util.format(db.getQuery('outOffice', 'deleteOutOfficeList'));
    return db.queryV2(queryStr, [doc_num]);
};
module.exports = new OutOfficeDao();