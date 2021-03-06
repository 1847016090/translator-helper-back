//接收上传的excel文件，保存解析返回objects
const xlsx = require("node-xlsx");
const fs = require("fs");
const uuid = require("node-uuid");
const path = require("path");
const uploadPath = path.resolve(__dirname, "../fileUpload");

async function getExcelObjs(ctx) {
  const file = ctx.request.files.file; // 获取上传文件
  const reader = fs.createReadStream(file.path); // 创建可读流
  const ext = file.name.split(".").pop(); // 获取上传文件扩展名
  let id = uuid.v4(); // 创建一个uuid
  const filePath = `${uploadPath}/${id}.${ext}`; // 创建文件路径
  const upStream = fs.createWriteStream(filePath); // 创建可写流
  const getRes = await getFile(reader, upStream); // 等待数据存储完成

  if (!getRes) {
    // 创建成功
    // 使用 xlsx 去读取文件的数据
    const sheets = xlsx.parse(filePath);
    let mySheet = sheets[0].data[0];
    let filterSheeyLang = [];
    mySheet.forEach((lan, index) => {
      // 过滤 appcode , message key , en_US
      if (![0, 1, 2].includes(index)) {
        filterSheeyLang.push({
          label: lan,
          value: index,
        });
      }
    });
    return {
      status: true,
      data: filterSheeyLang,
      fileId: id,
    };
  } else {
    return {
      status: false,
      msg: "上传文件错误",
    };
  }
}

function getFile(reader, upStream) {
  return new Promise(function (result) {
    let stream = reader.pipe(upStream); // 可读流通过管道写入可写流
    stream.on("finish", function (err) {
      result(err);
    });
  });
}

module.exports = {
  getExcelObjs,
};
