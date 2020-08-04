const translate = require("google-translate-api");

function googleTrans(sheet, transLan) {
    let translatingPromiseArr = [];
    sheet.forEach((transtr, index) => {
        if (index !== 0) {
            translatingPromiseArr.push(translate(transtr[2], { from: "en", to: transLan }))
        }
    })
    return Promise.all(translatingPromiseArr)
}

module.exports = googleTrans;