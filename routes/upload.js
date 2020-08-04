const Router = require("koa-router");
const fs = require("fs");
const path = require("path");
const uuid = require("node-uuid");
const uploadPath = path.resolve(__dirname, "../fileUpload");
const uploadData = require("./uploadData");
const xlsx = require("node-xlsx");
const send = require("koa-send");
const router = new Router({ prefix: "/upload" });
const downloadPath = path.resolve(__dirname, "../download");
const { googleTrans, dealObjOfMySheet } = require("../service/googleTrans");

// label value的语言种类map
let TransLanMappingEnum = {
  3: "es",
  4: "es",
  5: "zh",
  6: "en",
  7: "en",
  8: "zh",
  9: "pt",
  10: "fr",
};

router.post("/files", uploadData.getFiles);

router.post("/translate", async (ctx) => {
  let {
    body: { transKey, fileId },
  } = ctx.request;
  // 获取要翻译的语种
  let transLan = TransLanMappingEnum[transKey];
  // 拿到上传的文件路径
  let filePath = `${uploadPath}/${fileId}.xlsx`;
  // 解析得到表格的数据
  let sheets = xlsx.parse(filePath);
  // 拿到表格的内容
  let mySheet = sheets[0].data;
  let { alterMySheet, mapObj } = dealObjOfMySheet(mySheet);
  // 调用 Google翻译函数 翻译Excel 文件
  let res = await googleTrans(alterMySheet, transLan);
  // 将获取到值 取出放到一个数组中  ['MX1','MX2','MX3']
  translatdArr = res.map((mx) => mx.text);
  // 遍历将translatdArr 里面翻译好的值，添加到表格数里面对应的语言类型下面
  alterMySheet.forEach((row, index) => {
    if (row[2] !== "English(en_US)" && row[transKey] !== "Español (es_MX)") {
      row[transKey] = translatdArr[index - 1];
    }
  });
  // 创建 downloadID
  let downloadId = uuid.v4();
  let buffer = await xlsx.build([{ name: "mySheet", data: alterMySheet }]);
  // 存储到download文件夹下面
  await fs.writeFile(`${downloadPath}/${downloadId}.xlsx`, buffer, function (
    err
  ) {
    if (err) throw err;
  });
  ctx.body = {
    downloadId,
  };
});

router.get("/excel/:id", async (ctx) => {
  let { id } = ctx.params;
  let filePath = `${downloadPath}/${id}.xlsx`;
  // 默认 attachment
  ctx.attachment(filePath);
  // 发送文件
  await send(ctx, `download/${id}.xlsx`);
});

module.exports = router;
