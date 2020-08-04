const mongodb = require("./index");

mongodb.once("connect", async () => {
  const col = mongodb.setCollection("user");
  try {
    // 删除该文档的所有数据
    await col.deleteMany();
    // c插入
    await col.insertMany([{ user: "Stephen Ye", password: "Yekang-2019" }]);
    console.log("插入数据成功");
  } catch (error) {
    console.log("插入数据失败");
    throw error;
  }
});
