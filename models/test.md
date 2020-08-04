# 如何写出优雅的代码

## 1. 优先使用 const

```const``` 在 JavaScript 中不仅可以用于命名常量，因为其用于保证内存地址不可变，所以也常用于声明对象与数组。在编程中多使用 ```const``` 代替 ```let```, 可以在风格上向 immutable 靠拢，在编程思维上开始摈弃副作用
> 副作用：只要是跟函数外部环境发生的交互就都是副作用

为什么少使用```let```?
在 JS 中如果过多的使用 let 声明变量，阅读者往往需要贯穿上下文反复阅读才能理解当前变量的值，且变量可能被其他函数引用更改，显而易见， 使用变量越多理解的成本也就越高，而且你很难追踪变量具体的值。

如下方代码统计数组每个值的总和。使用 ```const``` 命名一个常量后，
你将无法使用 forEach 在每一次循环时改动它，转而使用 reduce，我们减少了变量 count，增加了常量 count，在随后代码的引用中就无需担忧
变量的状态，因为我们知道，count 只能是一个数值，而不会变化。

```bash
// bad
let count = 0
[...].forEach(item => {
  count += item
})

// good
const count = [...].reduce((pre, current) => pre + current, 0)
```

### 2. 使用函数表达式优于函数声明

参见：<https://juejin.im/post/5b22071af265da59a23f14ba>

配合上文所提到的 const，我们能够使用函数表达式来创建一个函数，更多的时候我们会与箭头函数配合食用 ```const f = () => {}```。它们优于传统函数声明的地方在于:

+ 语义化的指明函数是不可变的。
+ 函数表达式可以被看做赋值语句，更加简单易懂，且无法被覆盖。(常量不可以被重复声明)
+ 函数声明会在解析时被提升，存在先使用后声明。高可读的代码应当先声明再调用，使用表达式范式可以约束这一点。
+ 搭配箭头函数使用可减轻对 this 的思维依赖。

```bash
// bad
function addOne(value) {
  return value + 1
}

// good
const addOne = value => value + 1
```

### 3. 减少魔术字符

> 魔术字符 (魔术数字) 指的是代码中出现意义不明的字符，从上下文无法推论其来源与作用，这会使代码难以扩展。

通常，我们还会把所有的字符或数字统一声明在一个常量文件内，如 ```host``` ```defaultSettings``` ```port``` 等等，这会有益于维护

```bash
// bad
const url = `${host}/2/users`

// good
const apiVersion = 2
const apis = {
  users: 'users',
  projects: 'projects',
  // ...
}
```

### 4. 函数不要有过多参数

> 在不断延展的需求中，我们的函数会有越来越多的参数，但要注意，当一个函数的参数较多时会使调用方困扰。我们并非需要所有的函数都实现 ```curry```，但减少
函数参数、合并参数、分离函数都会显著提升代码的可读性与扩展性。

+ 在调用较多参数的函数时，我们不仅要紧记每个参数的顺序，还要对空缺的参数进行补位 (如传入 ```null``` ```undefined``` 等)，这会导致声明与调用的代码中都被迫
存在非常多的变量与判断。
+ 在函数个数增长时可以考虑将其中的一部分合成为一个对象参数，或是将一部分功能拆离，作为一个新的函数。

```bash
// bad
const createUser = (id, name, createdAt, telephone, email, address) => {}

// good
const createUser = (id, userOptions) => {}
```

### 5. 保持函数的专注

> 在一个函数中组好只做一件事，同时也最好保证这件事是与函数的名称是相关的。在单个函数中累积逻辑会给阅读者带来非常大的心智负担，如果我们予以函数拆分、 合理化的命名、组合，就能使代码整体获得极大的美感，看起来井井有条，泾渭分明。

```bash
// bad
const getUser = id => {
  const headers = // ...
  const options = // ...
  options.headers = headers
  const host = // ...
  const url = // ...
  if (id.length > 1) // ...
  return fetch(url, options)
}

// good
const makeOptions = () => {}
const makeUrl = id => {}

const getuser = id => {
  const options = makeOptions()
  const url = makeUrl(id)
  return fetch(url, options)
}
```

### 6. 使用语义化命名代替长条件

> 过长的条件判断常常会在一段时间后变的匪夷所思，很难理解其中的逻辑，将其使用语义化的常量代替则可向阅读者提示意义，更省略了不必要的注释。

```bash
// bad

// the code for teen-ager
if (user.age < 19 && user.age > 13) {
  // ...
}

// good
const  isTeenAgerMember = user.age < 19 && user.age > 13
if (isTeenAgerMember) // ...
```

### 7. 减少函数的副作用（此处可以长篇大论）

减少函数的副作用并非总是需要以纯函数来解决所有问题，不必慌张，我们知道副作用会使状态的变化难以琢磨，在编程中应当以较少的副作用函数为目标，
使函数的预期与实际保持一致的同时不至于造成过多的影响，这或许会使在构思和声明时花费一些时间，但对上下文的代码块来说，是一件好事。

```bash
// bad
let user = getUser()
const upload = () => {
  user.name = `${user.name}-upload`
  // fetch user ...
}

// good
const user = getUser()
const upload = user => {
  const body = Object.assign({}, user, { name: `${user.name}-upload` })
  // fetch body ...
}
upload(user)
```
