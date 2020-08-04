// const errorResult = require('../utils/errorResult.js');
const uploadExcelSrv = require('../service/uploadExcelSrv');

const saveData = async function (ctx, next) {
 
 const getRes = await uploadExcelSrv.getExcelObjs(ctx);
 if (getRes.status) {
  ctx.body = {
   status: true,
   msg: '上传数据成功',
   data: getRes
  };
 } else {
//   errorResult.errorRes(ctx, getRes.msg);
 }
 await next();
};
module.exports = {
 saveData
};