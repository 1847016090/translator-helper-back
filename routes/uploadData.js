// const errorResult = require('../utils/errorResult.js');
const uploadExcelSrv = require("../service/uploadExcelSrv");

const getFiles = async function (ctx, next) {
  const getRes = await uploadExcelSrv.getExcelObjs(ctx);
  if (getRes.status) {
    ctx.body = {
      status: true,
      msg: "上传数据成功",
      data: getRes,
    };
  } else {
    ctx.body = {
      status: false,
      msg: "上传失败!",
    };
  }
  await next();
};
module.exports = {
  getFiles,
};
