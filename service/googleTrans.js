const translate = require("google-translate-api");

const judgeType = (data) => {
  return Object.prototype.toString.call(data).slice(8, -1);
};

String.prototype.format = function (obj) {
  var str = this;
  var newStr = str;
  if (judgeType(obj) === "Object" && JSON.stringify(obj) !== "{}") {
    Object.entries(obj).forEach((module) => {
      const [key, value] = module;
      newStr = newStr.replace(`{${key}}`, value);
    });
  }
  return newStr;
};

function googleTrans(sheet, transLan) {
  let translatingPromiseArr = [];

  sheet.forEach((transtr, index) => {
    if (index !== 0) {
      // 将每个字符串用 translate 包裹, 2 代表 要翻译的字符串
      translatingPromiseArr.push(
        translate(transtr[2], { from: "en", to: transLan })
      );
    }
  });
  // return Promise.all(translatingPromiseArr)
  return sheet;
}
function dealObjOfMySheet(mySheet) {
  let no = 1;
  let pattern = /{(.+?)}/g;
  let mapObj = {};
  //   let newSheey = []
  let newSheet = mySheet.map((transtrArr, index) => {
    let transStr = transtrArr[2];
    if (index !== 0 && transStr.includes("{")) {
      let remapObj = {};
      let altArr = transStr.match(pattern);
      altArr.forEach((alt) => {
        let altStr = alt.replace(/{|}/g, "");
        mapObj[`s${no}`] = altStr;
        remapObj[altStr] = `{s${no}}`;
        no++;
      });
      return [transtrArr[0], transtrArr[1], transStr.format(remapObj)];
    }
    return transtrArr;
  });
  return { alterMySheet: newSheet, mapObj };
}
module.exports = {
  googleTrans,
  dealObjOfMySheet,
};
