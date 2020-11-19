### 安装依赖
```
yarn
```
### 启动本地开发环境
```
yarn serve
```
### 构建生产环境 (自带压缩)
```
yarn build
```
### 代码格式检查以及自动修复
```
yarn lint
```
### 运行单元测试
```
yarn test:unit
```
### 自动生成 svg 组件
```
yarn svg
```
### 目录结构

```
├── public                     # 静态资源 (会被直接复制)
│   │── favicon.ico            # favicon图标
│   │── img                    # 图片资源
│   │── tinymce                # 富文本编辑器的静态资源(业务相关)
│   │── robots.txt             # 存放于根目录，可告诉蜘蛛哪些可爬去，哪些不可
│   └── index.html             # html模板
├── src                        # 源代码
│   ├── api                    # 所有请求
│   ├── assets                 # 主题 字体等静态资源 (由 webpack 处理加载)
│   ├── components             # 全局组件
│   ├── icons                  # svg 图标
│   ├── lang                   # 国际化
│   ├── layout                 # 全局布局
│   ├── store                  # 全局 vuex store
│   ├── styles                 # 全局样式
│   ├── utils                  # 全局方法
│   ├── views                  # 业务页面
│   ├── App.vue                # 入口页面
│   ├── main.ts                # 入口文件 加载组件 初始化等
│   ├── permission.ts          # 权限管理
│   ├── router.ts              # 路由
│   ├── settings.ts            # 设置文件
│   └── shims.d.ts             # 模块注入
├── tests                      # 测试
├── .browserslistrc            # browserslistrc 配置文件 (用于支持 Autoprefixer)
├── .editorconfig              # 编辑相关配置
├── .env.xxx                   # 环境变量配置
├── .eslintrc.js               # eslint 配置
├── babel.config.js            # babel-loader 配置
├── jest.config.js             # jest 单元测试配置
├── package.json               # package.json 依赖
├── postcss.config.js          # postcss 配置
├── tsconfig.json              # typescript 配置
└── vue.config.js              # vue-cli 配置
```

### 相关依赖

| 依赖                                                         | 描述                                           |
| ------------------------------------------------------------ | ---------------------------------------------- |
| [vue-class-component](https://github.com/vuejs/vue-class-component) | 用基于类的API声明组件                          |
| [vue-property-decorator](https://github.com/kaorun343/vue-property-decorator) | 使用装饰器来简化书写 依赖于vue-class-component |
| [vuex-module-decorators](https://championswimmer.in/vuex-module-decorators/) | ts装饰器的写法使用vuex                         |
| [vue-svgicon](https://www.npmjs.com/package/vue-svgicon)     | svg icon components(vue 2.x)                   |
| [vue-i18n](https://kazupon.github.io/vue-i18n/)              | 国际化插件                                     |
| [sortablejs](http://www.sortablejs.com/)                     | js拖拽库                                       |
| [tinymce](https://www.tiny.cloud/docs/)，[@tinymce/tinymce-vue](https://www.npmjs.com/package/@tinymce/tinymce-vue) | 富文本编辑器                                   |
| [normalize.css](https://github.com/necolas/normalize.css)    | css重置                                        |
| [nprogress](https://github.com/rstacruz/nprogress)           | 简约的进度条插件                               |
| [path-to-regexp](https://github.com/pillarjs/path-to-regexp) | url的正则表达式                                |
|                                                              |                                                |