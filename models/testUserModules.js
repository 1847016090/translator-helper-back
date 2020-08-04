const mongodb = require("./index");

mongodb.once("connect", async () => {
  const col = mongodb.setCollection("modules");
  try {
    // 删除该文档的所有数据
    await col.deleteMany();
    // c插入
    await col.insertMany([
      { title: "Fav", key: "1", show: true },
      { title: "Javascript", key: "2", show: true },
      { title: "React", key: "3", show: true },
      { title: "Vue", key: "4", show: true },
      { title: "Node", key: "7", show: true },
      { title: "Mongodb", key: "8", show: true },
      { title: "Other", key: "9", show: true },
      { title: "Koa", key: "5", show: true },
      { title: "Egg", key: "6", show: true }
    ]);
    console.log("插入数据成功");
  } catch (error) {
    console.log("插入数据失败");
    throw error;
  }
});
