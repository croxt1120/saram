// Author: sanghee park <novles@naver.com>
// Create Date: 2014.12.18
// 사용자 Service
var _ = require("underscore"); 
var debug = require('debug')('Approval');
var Schemas = require("../schemas.js");
var ApprovalDao= require('../dao/approvalDao.js');
var CommuteDao = require('../dao/commuteDao.js');
var OutOfficeDao= require('../dao/outOfficeDao.js');
var InOfficeDao= require('../dao/inOfficeDao.js');
var moment = require("moment");

var Promise = require('bluebird');
var db = require('../lib/dbmanager.js');

var fs = require('fs');
var path = require("path");
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

function timeformat(num){
    var result = "";
    var hour = Math.floor(num / 60);
    var min = Math.floor(num % 60);
    
    if(hour < 10){
        result += "0";
    }
    result += hour + "시간 ";
    
    if(min < 10){
        result += "0";
    }
    
    result += min+"분";
    
    return result;
}

var transport = nodemailer.createTransport(smtpTransport({
    host: 'wsmtp.ecounterp.com',
    port: 587,
    auth: {
        user: 'webmaster@yescnc.co.kr',
        pass: 'yes112233'
    },
    rejectUnauthorized: false,
    connectionTimeout:10000
}));

var Approval = function (data) {
    var _getApprovalList = function (doc_num) {
        return ApprovalDao.selectApprovalList(doc_num);
    };
    var _getApprovalListWhere = function (startDate, endDate, managerId) {
        if(managerId != undefined && managerId != ""){
            return ApprovalDao.selectApprovalByManager(managerId, startDate, endDate);
        }
        return ApprovalDao.selectApprovalListWhere(startDate, endDate);
    };
    var _getApprovalListById = function(data){
        return ApprovalDao.selectApprovalListById(data);
    };
    var _insertApproval = function (data) {
        return ApprovalDao.insertApproval(data);
    };    
    var _updateApprovalConfirm = function(data) {
    	var _data = data;
        return new Promise(function(resolve, reject){
        	var queryArr = [];
  		    for(var idx in data.data){
  		        var approvalItem = data.data[idx];
  		        if(approvalItem.state == "취소반려"){
  		            queryArr.push(ApprovalDao.rejectApprovalConfirm(approvalItem));
  		        }else{
  		            console.log(data);
  		            if(!(_.isUndefined(data.inOffice) || _.isNull(data.inOffice))){
  		                
  		                var today = moment();
  		                var inOfficeDay = moment(data.inOffice.arrInsertDate[0], "YYYY-MM-DD").hours(0).minutes(0).seconds(0);
  		                if(today.isBefore(inOfficeDay)){
  		                    if(inOfficeDay.day() == "0" && today.day() == "6" && today.diff(inOfficeDay,"days") == 0 ){
  		                        approvalItem.black_mark = '3';
  		                    }else{
  		                        approvalItem.black_mark = '1';
  		                    }
  		                }else{
  		                    approvalItem.black_mark = '3';
  		                }
  		                
  		                queryArr.push(ApprovalDao.updateApprovalConfirm2(approvalItem));        
  		                
  		            }else{
  	                    queryArr.push(ApprovalDao.updateApprovalConfirm(approvalItem));    
  		            }
  		        }
  		    }
  		    
  		    if(!(_.isUndefined(data.outOffice) || _.isNull(data.outOffice))){
  		        var outOfficeData = {};
  		        for(var key in data.outOffice.arrInsertDate){
  		            outOfficeData[key] = _.clone( data.outOffice);
  		            outOfficeData[key].date = data.outOffice.arrInsertDate[key];
                      outOfficeData[key].year = outOfficeData[key].date.substr(0,4);
                      outOfficeData[key].black_mark = (data.outOffice.black_mark == undefined)? "" : data.outOffice.black_mark;
                      queryArr.push(OutOfficeDao.insertOutOffice(outOfficeData[key]));
  		        }
  		    }
  		    
  		    if(!(_.isUndefined(data.inOffice) || _.isNull(data.inOffice))){
  		        var inOfficeData = {};
  		        for(var inKey in data.inOffice.arrInsertDate){
  		            inOfficeData[inKey] = _.clone( data.inOffice );
  		            inOfficeData[inKey].date = data.inOffice.arrInsertDate[inKey];
                      inOfficeData[inKey].year = inOfficeData[inKey].date.substr(0,4);
                      inOfficeData[inKey].black_mark = (data.inOffice.black_mark == undefined)? "" : data.inOffice.black_mark;
                      queryArr.push(InOfficeDao.insertInOffice(inOfficeData[inKey]));    
  		        }
  		        
  		    }
  		    
  		    if(!(_.isUndefined(data.commute) || _.isNull(data.commute))){
  		        for(var idx in data.commute){
  			        queryArr.push(CommuteDao.updateCommute_t(data.commute[idx])); 
  			    }
  	            
  		    }
  		    
              db.queryTransaction(queryArr).then(function(resultArr){
                  resolve(resultArr); 
              }, function(err){
                  reject(err);
              });
 		}).catch(function(err){
        	  if(!(_.isUndefined(_data.outOffice) || _.isNull(_data.outOffice))){        		  
        		  db.query("outOffice", "deleteOutOfficeList", [_data.outOffice.doc_num]).then(function(resultArr){
        			  console.log(_data.outOffice.doc_num);
        		  });
        		  throw(err);
        	  }
        });
    };
    var _sendOutofficeEmail = function(doc_num){
        
        return new Promise(function(resolve, reject){
            ApprovalDao.getApprovalMailData(doc_num).then(function(data){
                if(data.length == 1 )
                    data = data[0];
                
                if(data.start_date == data.end_date)
                    data.end_date = null;
                
    	        fs.readFileAsync(path.dirname(module.parent.parent.filename) + "/views/outofficeApproval.html","utf8").then(function (html) {
    	            
    	            if(data.code_name == "초과근무"){
    	                var splitArr = data.submit_comment.split(",");
                        var except = parseInt(splitArr[0],10);
                        var overTime = parseInt(splitArr[1],10);
                        var startTime = _.isUndefined(splitArr[2]) ? "" : splitArr[2];
                        var endTime = _.isUndefined(splitArr[3]) ? "" : splitArr[3];
                        var calc = overTime-except;
                        var type = Math.floor(calc/120);
                        if(type == 1){
                            type = "야근 A형";
                        }else if(type == 2){
                            type = "야근 B형";
                        }else if(type > 2){
                            type = "야근 C형";
                        }else {
                            type = "-";
                        }
                        data.submit_comment = "출근시간 : "+ startTime + ", 퇴근시간: "+endTime+"<br>초과시간 : "+timeformat(overTime)+", 제외시간 : "+timeformat(except)+"<br>확정시간 : "+timeformat(calc)+", 근무타입 : " + type;
    	            }
                    var temp=_.template(html);
                    var sendHTML=temp(data);
                    
                    ApprovalDao.getApprovalMailingList(data.dept_code).then(function(result){
                        var cc = [];
                        
                        /* 유강재 이사님 결재선일 경우(팀장) 사장님, 부사장님 추가 */
                        if(data.manager_id == "160301"){
                            cc.push({name : "김특훈", address : "thkim@yescnc.co.kr"});
                        }
                
                        // 모든 근태 결재 메일을 임원에게 발송
                        cc.push({ name :"전영호", address: "yh.jeon@yescnc.co.kr"});
                        cc.push({ name :"유강재", address: "youkj@yescnc.co.kr"});
                        cc.push({ name :"최홍락", address: "redrock.choi@yescnc.co.kr"});
                        
                        /* 근태 메일 품질검증팀 제외 */
                        if(data.dept_code != "5100" && data.dept_code != "5200"){
                        	// 서울에서 발생한 근태 결재내역은 모든 팀장에게 발송 - 2016.10.18
                        	cc.push({ name :"박수종", address: "soojong@yescnc.co.kr"});
		                    cc.push({ name :"윤정관", address: "jkyoon96@yescnc.co.kr"});
		                    cc.push({ name :"김태중", address: "hhs2tjk@yescnc.co.kr"});
		                    cc.push({ name :"최치운", address: "cwchoi@yescnc.co.kr"});
                            for(var idx in result){
                                if(result[idx].email != "" || !_.isNull(result[idx].email) || !_.isUndefined(result[idx].email)){
                                    if(result[idx].leave_company == "" || _.isNull(result[idx].leave_company) || _.isUndefined(result[idx].leave_company))
                                        cc.push({name : result[idx].name, address: result[idx].email});
                                }
                            }
                        }
                        _.uniq(cc, function(d) {return d.address});	// 중복 제거
                        
                        //cc.push({ name :"강정규", address: "jkkang@yescnc.co.kr"});	// 테스트용
                        
                        var mailOptions= {
                            from: 'webmaster@yescnc.co.kr', // sender address 
                            to: [
	                                { name: "김성식", address: "sskim@yescnc.co.kr"},
	                                { name :"김은영", address: "eykim@yescnc.co.kr"}
                                ],
                            subject:"[근태보고] " + data.name + "_" + data.code_name,
                            html:sendHTML,
                        	text:"",
                            cc: cc
                        };
                        
                        transport.sendMail(mailOptions, function(error, info){
                            if(error){//메일 보내기 실패시 
                                console.log(error);
                                reject();
                            }else{
                                resolve();
                            }
                        });    
                    });
                }).catch(SyntaxError, function (e) {
                    reject(e);
                }).error(function (e) {
                    reject(e);
                });    
    	    });
    	    
        });
    };
    
    var _sendApprovalEmail = function(doc_num, managerId){
        return new Promise(function(resolve, reject){
            ApprovalDao.getApprovalMailData(doc_num).then(function(data){
                if(data.length == 1 )
                    data = data[0];
                
                if(data.start_date == data.end_date)
                    data.end_date = null;
                
    	        fs.readFileAsync(path.dirname(module.parent.parent.filename) + "/views/outofficeApproval.html","utf8").then(function (html) {
    	            if(data.code_name == "초과근무"){
    	                var splitArr = data.submit_comment.split(",");
                        var except = parseInt(splitArr[0],10);
                        var overTime = parseInt(splitArr[1],10);
                        var startTime = _.isUndefined(splitArr[2]) ? "" : splitArr[2];
                        var endTime = _.isUndefined(splitArr[3]) ? "" : splitArr[3];
                        var calc = overTime-except;
                        var type = Math.floor(calc/120);
                        if(type == 1){
                            type = "야근 A형";
                        }else if(type == 2){
                            type = "야근 B형";
                        }else if(type > 2){
                            type = "야근 C형";
                        }else {
                            type = "-";
                        }
                        data.submit_comment = "출근시간 : "+ startTime + ", 퇴근시간: "+endTime+"<br>초과시간 : "+timeformat(overTime)+", 제외시간 : "+timeformat(except)+"<br>확정시간 : "+timeformat(calc)+", 근무타입 : " + type;
    	            }
    	            
                    var temp=_.template(html);
                    var sendHTML=temp(data);
                    
                    ApprovalDao.getManagerId(managerId).then(function(result){
                        var to = [];
                        var cc = [];
                        
                        
                        for(var idx in result){
                            if(result[idx].email != "" || !_.isNull(result[idx].email) || !_.isUndefined(result[idx].email)){
                                var person = result[idx];
                                to.push({name : person.name, address: person.email});
                                
                                if(person.name == "김특훈"){
                                    cc.push({ name: "김성식", address: "sskim@yescnc.co.kr"});
                                }
                            }
                        }
                        
                        var mailOptions= {
                            from: 'webmaster@yescnc.co.kr', // sender address 
                            to: to,
                            subject:"[근태 상신 알림] " + data.name + "_" + data.code_name,
                            html:sendHTML,
                        	text:"",
                        };
                        
                        if(cc.length > 0){
                            mailOptions["cc"] = cc;
                        }
                        
                        transport.sendMail(mailOptions, function(error, info){
                            if(error){//메일 보내기 실패시 
                                console.log(error);
                                reject();
                            }else{
                                resolve();
                            }
                        });    
                    });
                }).catch(SyntaxError, function (e) {
                    reject(e);
                }).error(function (e) {
                    reject(e);
                });    
    	    });
    	    
        });
    };
    
    var _getApprovalIndex = function (yearmonth) {
        return ApprovalDao.selectApprovalIndex(yearmonth);
    };
    
    var _setApprovalIndex = function () {
        var _schema = new Schemas('approval_index');
        var _param = _schema.get(data);
        
        if(_param.seq != null)
            return ApprovalDao.updateMaxIndex(_param);            
        else
            return ApprovalDao.insertApprovalIndex(_param);
    };
    var _updateApprovalIndex = function (yearmonth) {
        return ApprovalDao.updateMaxIndex(yearmonth);
    };
    return {
        getApprovalList:_getApprovalList,
        getApprovalListWhere:_getApprovalListWhere,
        getApprovalListById:_getApprovalListById,
        insertApproval:_insertApproval,
        updateApprovalConfirm:_updateApprovalConfirm,
        getApprovalIndex:_getApprovalIndex,
        setApprovalIndex:_setApprovalIndex,
        updateApprovalIndex:_updateApprovalIndex,
        sendOutofficeEmail:_sendOutofficeEmail,
        sendApprovalEmail : _sendApprovalEmail
    };
};

module.exports = Approval;

