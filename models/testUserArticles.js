const mongodb = require("./index");
const faker = require("faker");
const fs = require("fs");
const data = fs.readFileSync("./test.md");
console.log("data: ", data.toString());

mongodb.once("connect", async () => {
  const col = mongodb.setCollection("articles");
  try {
    // 删除该文档的所有数据
    await col.deleteMany();
    let arr = [];
    for (var i = 0; i < 20; i++) {
      arr[i] = {
        title: faker.random.word(),
        moduleKey: ["1", "2", "3", "4", "5", "6"][
          Math.floor(Math.random() * 6)
        ],
        detail: faker.random.words(),
        info: data.toString(),
        id: i + 1
      };
    }
    // c插入
    console.log(faker.random.word);
    await col.insertMany(arr);
    console.log("插入数据成功");
  } catch (error) {
    console.log("插入数据失败");
    throw error;
  }
});
