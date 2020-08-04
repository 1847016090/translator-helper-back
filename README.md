## 使用 Rest Client 插件来调试接口 [官网](https://marketplace.visualstudio.com/items?itemName=humao.rest-client#overview)

[参考链接](https://juejin.im/post/5e2067f7f265da3e405028fb)

### Postman 与 REST Client

1. 优点
    + 能够进行版本化并可以在团队间共享你的 API 调用；
    + 仅仅是一个 HTTP 文件，团队成员间可以通过 git 协作维护这个文件；
    + 无需切换窗口，可以在一个 HTTP 文件中去维护多个接口；
    + 相比于Postman，REST Client支持了 [cURL](https://link.zhihu.com/?target=https%3A//en.wikipedia.org/wiki/CURL) 和 [RFC 2616](https://link.zhihu.com/?target=https%3A//www.w3.org/Protocols/rfc2616/rfc2616-sec5.html) 两种标准来调用REST API；
2. 缺点
    + 你必须使用 VS Code，如果使用其它的工具开发是不可以的；
    + Postman 拥有强大的用户操作界面，而 REST Client 没有操作界面，仅仅是在一个 HTTP 文件中编写请求，没有 Postman 方便；

### 使用

1. 安装 REST Client 插件
2. 创建一个`.http`或者`.rest`文件
3. 写入测试接口
    + 符合 RFC 2616 标准的 POST 请求(推荐)

    ```
    POST http://dummy.restapiexample.com/api/v1/create HTTP/1.1
    content-type: application/json

    {
        "name":"Hendry",
        "salary":"61888",
        "age":"26"
    }
    ```

    + 符合 cURL 标准的 POST 请求

    ```
    curl -X POST "http://dummy.restapiexample.com/api/v1/create" -d "Hello World"
    ```

**如果省略 request 方法，请求将被视为 GET 。**
> 注意：接口间通过 ### 分隔，同一个 .http 文件里可以涵盖多个 HTTP 请求。不像 Postman，不同的 HTTP 请求需要放在不同的 tab 里。

4. 点击send request

#### 其他

**rest-client 还有更多的配置项，例如：**

```
"rest-client.previewOption": "body" // 可以只获得成功后的返回值
```

#### 自定义文件变量

```
// 文件变量
@port = 8080
@contentType = application/json

### 测试接口 RFC 2616
// 文件变量
@name = musicRankings
GET https://{{host}}/{{name}} HTTP/1.1
```

+ 对于文件变量，定义遵循 @variableName = variableValue 占用完整行的语法；
+ 变量名称（variableName）不得包含任何空格。至于变量值（variableValue），它可以由任  何字符组成，甚至允许空格（前导和尾随空格将被剥离）；
+ 如果你想保留一些像换行符这样的特殊字符，你可以使用反斜杠 \n ；
