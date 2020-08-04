const Router = require("koa-router");
const fs = require("fs");
const path = require("path");
const MD5 = require('./md5')
const translate = require("google-translate-api");
const uuid = require('node-uuid');
const uploadPath = path.resolve(__dirname, "../fileUpload");
const uploadData = require('./uploadData')
const xlsx = require("node-xlsx");
const send = require('koa-send');
const router = new Router({ prefix: "/upload" });
const downloadPath = path.resolve(__dirname, "../download");
const googleTrans = require('../service/googleTrans')

let TransLanMappingEnum = {
    3: 'es',
    4: 'es',
    5: 'zh',
    6: 'en',
    7: 'en',
    8: 'zh',
    9: 'pt',
    10: 'fr'
}

router.post("/files", uploadData.saveData);

router.post('/translate', async ctx => {
    const { body: { transKey, fileId } } = ctx.request;
    let transLan = TransLanMappingEnum[transKey];
    const filePath = `${uploadPath}/${fileId}.xlsx`;
    let sheets = xlsx.parse(filePath);
    let mySheet = sheets[0].data;
    // 调用 Google翻译函数 翻译Excel 文件
    let res = await googleTrans(mySheet, transLan)
    translatdArr = res.map(mx => mx.text);
    mySheet.forEach((row, index) => {
        if (row[2] !== "English(en_US)" && row[transKey] !== "Español (es_MX)") {
            console.log(row[2]);
            console.log(translatdArr[index - 1]);
            console.log("=======>");
            row[transKey] = translatdArr[index - 1];
        }
    });
    const downloadId = uuid.v4()
    const buffer = await xlsx.build([{ name: "mySheet", data: mySheet }]);
    await fs.writeFile(`${downloadPath}/${downloadId}.xlsx`, buffer, function (err) {
        if (err) throw err;
    });
    ctx.body = {
        downloadId
    }
})

router.get('/excel/:id', async ctx => {
    const { id } = ctx.params;
    const filePath = `${downloadPath}/${id}.xlsx`;
    ctx.attachment(filePath);
    await send(ctx, `download/${id}.xlsx`);
})

module.exports = router;
