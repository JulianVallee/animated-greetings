const { VueLoaderPlugin } = require("vue-loader");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const ZipPlugin = require('zip-webpack-plugin');
const autoprefixer = require("autoprefixer");
const WebpackBuildNotifierPlugin = require('webpack-build-notifier');
const path = require("path");

module.exports = {
    entry: {
        admin: "./src/admin/assets/main.js",
        public: "./src/public/assets/main.js",
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: '[name]/bundle.js', // Hacky way to force webpack to have multiple output folders vs multiple files per one path
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                },
            },
            {
                test: /\.vue$/,
                loader: "vue-loader",
            },
            {
                test: /\.s?css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            esModule: false,
                        }
                    },
                    {
                        loader: "css-loader",
                        options: {
                            esModule: false,
                        }
                    },
                    {
                        loader: "postcss-loader",
                        options: {
                            postcssOptions: {
                                plugins: [
                                    autoprefixer()
                                ],
                            }
                        },
                    },
                    {
                        loader: "sass-loader",
                        options: {
                            sassOptions: {
                                quietDeps: true
                            }
                        },
                    }
                ],
            },
        ],
    },
    plugins: [
        new VueLoaderPlugin(),
        new MiniCssExtractPlugin({
            filename: "[name]/bundle.css"
        }),
        new CleanWebpackPlugin(),
        new CopyPlugin({
            patterns: [
                {
                    context: path.resolve(__dirname, "src").replace(/\\/g, "/"),
                    from: "**/*",
                    to: path.resolve(__dirname, "dist"),
                    globOptions: {
                        ignore: [
                            "**/assets/**",
                            "**/assets/**",
                        ],
                    },
                    force: true
                }
            ],
        }),
        new ZipPlugin({
            path: path.resolve(__dirname, "dist"),

            // OPTIONAL: defaults to the Webpack output filename (above) or,
            // if not present, the basename of the path
            filename: 'animated-greetings.zip',

            // OPTIONAL: defaults to the empty string
            // the prefix for the files included in the zip file
            pathPrefix: 'animated-greetings',

        }),
        new WebpackBuildNotifierPlugin({
            title: "Animated Greetings Build"
        })
    ],
    resolve: {
        alias: {
            vue$: "vue/dist/vue.runtime.esm.js",
        },
        extensions: ["*", ".js", ".vue", ".json"],
    },
};