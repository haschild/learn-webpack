const path = require("path")
const uglify = require("uglifyjs-webpack-plugin") // reference js compress plugin
const htmlplugin = require("html-webpack-plugin") // reference html compress plugin
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const cleanwebpackplugin = require("clean-webpack-plugin"); // 每次打包的时候把打包文件删除
var website = {
    publicPath: "http://localhost:8888/"
    // publicPath:"http://192.168.1.103:8888/"
}
// --这两个是把不需要的 css 消除掉
const glob = require("glob")
const purifycssplugin = require("purifycss-webpack")
const webpack = require("webpack")
// -- 
module.exports = {
    mode: "production",
    // 入口文件的配置
    entry: {
        // 属性的名字是可以随意写的。入口有几个就会 bundle 几个文件
        main: "./src/index.js",
        // bundle: path.resolve(__dirname, "../src/main.js") // 可以获取当前的路径作为基础
    },
    devtool: "inline-source-map",
    output: {
        // 打包的路径
        path: path.resolve(path.dirname(__dirname), "dist"),
        // 打包的文件名
        filename: "[name][hash:8].js", // [name] 告诉我们入口是什么名字 bundle 后就是什么名字
        publicPath: website.publicPath // 处理静态文件使用(如果不加，css里引用了图片是找不到的)

    },
    // 模块：例如css，图片怎么加载和压缩
    module: {
        rules: [
            {   // 将打包的 css 文件分出来成一个独立的文件
                test: /\.css$/,
                use: [
                    "style-loader",
                    { loader: "css-loader" }
                ]
            },
            {
                test: /\.(png|jpg)$/,
                use: {
                    loader: "url-loader",
                    options: {
                        limit: 1024,
                        outputPath: 'images/'
                    }
                }
            },
            {   // webpack 不能打包 html 里面的 img 标签
                test: /\.(html|htm)$/i,
                use: [
                    { loader: "html-withimg-loader" }
                ]
            },
            {
                test: /\.less$/,
                use: [{ // 也是会直接打包到 js 文件里
                    loader: "style-loader" // creates style nodes from JS strings
                },
                {
                    loader: "css-loader" // translates CSS into CommonJS
                },
                {
                    loader: "less-loader" // compiles Less to CSS
                }]
            }, {
                test: /\.sass$/,
                use: [
                    { loader: "style-loader" },
                    { loader: "css-loader" },
                    { loader: "sass-loader" }
                ]
            }, { // 这是把 Babel 的配置，配置在 webpack 里
                test: /\.(jsx|js)$/,
                use: {
                    loader: 'babel-loader',

                    // 现在已经将这部分的配置放在 .babelrc 里
                    // options: {
                    //     presets: [
                    //         "es2015", "react"
                    //     ]
                    // }
                },
                exclude: /node_modules/
            }

        ]
    },
    // 插件
    plugins: [
        //在运行（build & server）的时候显示进度条
        new webpack.ProgressPlugin(),
        // bundle 的时候会把以前的文件删除掉
        new cleanwebpackplugin(),
        // 给打包后的 js 在压缩下。这里你需要下载 uglifyjs-webpack-plugin
        new uglify(),
        // 对 html 进行打包
        new htmlplugin({
            minify: { //是对html文件进行压缩
                removeAttributeQuotes: true  //removeAttrubuteQuotes是却掉属性的双引号。
            },
            hash: true,
            template: "./src/index.html"
        }),
        //将 css 提取到指定的文件里
        // new ExtractTextPlugin("./src/css/index.css"),

        // new purifycssplugin({
        //     //这里配置了一个paths，主要是需找html模板，purifycss根据这个配置会遍历你的文件，查找哪些css被使用了。
        //     // 注意这个插件必须要和 extract-text-webpack-plugin 配合使用

        //     paths: glob.sync(path.join(__dirname, 'src/*.html')),


        // }),
        new webpack.HotModuleReplacementPlugin()
    ],
    // 配置webpack开发服务
    devServer: {
        // 设置基本的目录,找到打包的路径
        contentBase: path.resolve(__dirname, "../dist"),
        host: "localhost",
        compress: true,
        port: 8888,
        hot: true
    },
    // 默认查找的文件
    resolve: {
        extensions: [".ts", ".js", ".css"]
    }
}