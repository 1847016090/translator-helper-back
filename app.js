/**
 * 引入 koa
 */
const Koa = require("koa");
const koaBody = require('koa-body');
const app = new Koa();

// 处理跨域
const cors = require("koa2-cors");
app.use(cors());

/**
 * 处理post请求以及文件上传
 */
app.use(koaBody({
  multipart: true,formidable: {
  maxFileSize: 200*1024*1024 // 设置上传文件大小最大限制
  }
}));

/**
 * 引入路由
 */
const upload = require("./routes/upload");
// 处理404 情况 response 对象的请求头
app.use(upload.routes()).use(upload.allowedMethods());

/**
 * 设置监听端口
 */
app.listen(3000);
