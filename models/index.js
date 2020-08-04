const conf = require("./config");
const EventEmitter = require("events").EventEmitter;

const MongoClient = require("mongodb").MongoClient;

class MongoDB {
  constructor(conf) {
    this.conf = conf;
    this.emiter = new EventEmitter();

    // client实例
    this.client = new MongoClient(conf.url, {
      useNewUrlParser: true
    });
    // 链接数据库
    this.client.connect(err => {
      if (err) throw err;
      console.log("数据库链接成功");
      this.emiter.emit("connect");
    });
  }

  setCollection(colName, dbName = conf.dbName) {
    return this.client.db(dbName).collection(colName);
  }
  userLogin() {
    console.log("111", this.client);
  }

  once(event, cb) {
    this.emiter.once(event, cb);
  }
}

module.exports = new MongoDB(conf);
