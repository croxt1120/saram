var db = require('../lib/dbmanager.js');
var group = "roomReg";

var RoomRegDao = function () {
};

RoomRegDao.prototype.selectRoomRegList = function(param){
    return db.query(group, "selectRoomRegList", [param.start_date, param.end_date]);
};

RoomRegDao.prototype.selectRoomRegBefore = function(roomReg){
    return db.query(group, "selectRoomRegBefore", 
    	[roomReg.room_index, roomReg.date, roomReg.start_time, roomReg.end_time]);
};

RoomRegDao.prototype.insertRoomReg = function(roomReg){
    return db.query(group, "insertRoomReg", 
    	[roomReg.room_index, roomReg.member_id, roomReg.title, roomReg.date, roomReg.start_time, roomReg.end_time, roomReg.desc]);
};

RoomRegDao.prototype.updateRoomReg = function(roomReg){
    return db.query(group, "updateRoomReg", 
    	[roomReg.room_index, roomReg.title, roomReg.date, roomReg.start_time, roomReg.end_time, roomReg.desc, roomReg.index]);
};

RoomRegDao.prototype.deleteRoomReg = function(index){
    return db.query(group, "deleteRoomReg", [index]);
};

module.exports = new RoomRegDao();

