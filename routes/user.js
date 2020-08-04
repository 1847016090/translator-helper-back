const Router = require("koa-router");
const fs = require("fs");
const path = require("path");
const router = new Router({ prefix: "/user" });
const { errorRequest, successRequest } = require("../utils/CUtil");

let store = {};
const db = require("../models");
router.post("/login", async ctx => {
  /**
   * seup a collection with mongodb
   */
  let user = db.setCollection("user");
  const { body: loginUser } = ctx.request;
  let dbUser = await user.findOne({ user: loginUser.user });
  /**
   * loginUser: login user info
   * dbUser: mongodb user info
   * loginInfoNotRight: judge login info is not right and send a message
   */
  const loginInfoNotRight =
    dbUser === null ||
    loginUser.user !== dbUser.user ||
    loginUser.password !== dbUser.password;

  if (loginInfoNotRight) {
    ctx.body = errorRequest("Your password or loginname is not right!");
  } else {
    ctx.body = successRequest("Login successfully!", {});
  }
});

router.get("/modules", async ctx => {
  let modules = db.setCollection("modules");
  const myModules = await modules.find().toArray();
  ctx.body = successRequest("Success", { myModules });
});

router.get("/articles/:moduleKey", async ctx => {
  const { moduleKey } = ctx.params;
  let articles = db.setCollection("articles");

  const moduleArticle = await articles.find({ moduleKey }).toArray();
  ctx.body = successRequest("Success", { moduleArticle });
});

router.get("/articles/info/:articleId", async ctx => {
  const { articleId } = ctx.params;
  let articles = db.setCollection("articles");

  const article = await articles.findOne({ id: Number(articleId) });
  ctx.body = successRequest("Success", { article });
});

/**
 * 实现upload功能，使用koa-multer 中间件
 */
const Multer = require("koa-multer");
const upload = new Multer({ dest: "./public/images" });

router.post("/upload", upload.single("file"), async ctx => {
  const url = ctx.req.file.path;
  const data = await fs.readFileSync(`./${url}`);
  store[ctx.req.file.filename] = data.toString();
  // 写入数据库
  ctx.body = {
    info: ctx.req.file.filename
  };
});

/**
 * 添加文章
 */
router.post("/articles/add", async ctx => {
  const { body } = ctx.request;
  let articles = db.setCollection("articles");
  const addRes = await articles.insertOne({
    ...body,
    info: store[body.info],
    id: Date.now(),
    addDate: new Date(),
    updateDate: new Date()
  });
  // console.log(aa.result.ok);
  ctx.body = successRequest("Success");
});

/**
 * 移动文章
 * @param {Number} id 文章ID
 * @param {String} moduleKey 所属模块Key
 */
router.put("/articles/move", async ctx => {
  const {
    body: { id, moduleKey }
  } = ctx.request;
  let articles = db.setCollection("articles");
  const putRes = await articles.update(
    {
      id: id
    },
    {
      $set: { moduleKey: moduleKey }
    }
  );
  console.log(putRes.result.ok);
  ctx.body = successRequest("移动成功!", {});
});

/**
 *  删除文章
 *  @param {Number} id 文章ID
 */
router.delete("/articles/:id", async ctx => {
  const { id } = ctx.params;
  let articles = db.setCollection("articles");
  const deleteRes = await articles.remove({ id: Number(id) });
  console.log("deleteRes: ", deleteRes.result.ok);
  ctx.body = successRequest("删除成功!", {});
});

/**
 * 修改文章
 * @param {String} content 文章内容
 * @param {Number} id  文章ID
 */

router.put("/articles/:id", async ctx => {
  const { id } = ctx.params;
  const {
    body: { content }
  } = ctx.request;
  let articles = db.setCollection("articles");
  const editRes = await articles.update(
    { id: Number(id) },
    { $set: { info: content } }
  );
  console.log("editRes: ", editRes.result);
  ctx.body = successRequest("保存成功!", {});
});
module.exports = router;
