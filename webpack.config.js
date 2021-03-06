'use strict';

const path = require("path");
const { VueLoaderPlugin } = require("vue-loader");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const Autoprefixer = require("autoprefixer");
const ZipPlugin = require('zip-webpack-plugin');
const { responseInterceptor } = require('http-proxy-middleware');

const SCHEMA = 'http';
const URI = 'localhost';
const DOCKER_PORT = 8080;
const PROXY_PORT = 8081;

module.exports = {
    mode: 'development',
    devtool: 'source-map',
    entry: {
        admin: "./src/admin/assets/main.js",
        public: "./src/public/assets/main.ts",
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        publicPath: `${SCHEMA}://${URI}:${DOCKER_PORT}/wp-content/plugins/animated-greetings/`,
        filename: '[name]/bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: {
                    loader: "babel-loader",
                },
                exclude: {
                    or: [
                        /test/,
                        /node_modules/
                    ]
                },
            },
            {
                test: /\.ts$/,
                use: {
                    loader: 'ts-loader',
                    options: {
                        onlyCompileBundledFiles: true,
                        appendTsSuffixTo: [/\.vue$/]
                    }
                },
                exclude: {
                    or: [
                        /test/,
                        /node_modules/
                    ]
                },
            },
            {
                test: /\.vue$/,
                use: {
                    loader: "vue-loader"
                },
                exclude: {
                    or: [
                        /test/,
                        /node_modules/
                    ]
                },
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
                                    Autoprefixer()
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

        })
        // new WebpackBuildNotifierPlugin({
        //     title: "Animated Greetings Build"
        // })
    ],
    resolve: {
        alias: {
            vue$: "vue/dist/vue.runtime.esm.js",
        },
        extensions: ["*", ".js", ".ts", ".vue", ".json"],
    },
    devServer: {
        host: URI,
        port: PROXY_PORT,
        headers: {
            'Access-Control-Allow-Origin': '*',
        },

        client: {
            logging: 'verbose',
            overlay: true,
        },

        /**
         * Enable HMR
         **/
        hot: true,
        open: true,
        allowedHosts: 'all',

        /**
         * Write the output files to disk so docker can pick them up
         *
         **/
        devMiddleware: {
            writeToDisk: true,
        },

        /**
         * Enable/disable handling exit signals within webpack dev server
         */
        // setupExitSignals: false,

        /**
         * Proxy all webpack dev server requests to apache
         **/
        proxy: {
            '/': {
                target: `${SCHEMA}://${URI}:${DOCKER_PORT}`,

                // /**
                //  * webpack docs https://webpack.js.org/configuration/dev-server#devserverproxy:
                //  * "A backend server running on HTTPS with an invalid certificate will not be accepted by default. If you want to, modify your config like this:"
                //  **/
                // secure: false,

                /**
                 * webpack docs:
                 * "The origin of the host header is kept when proxying by default, you can set changeOrigin to true to override this behaviour.
                 * It is useful in some cases like using name-based virtual hosted sites."
                 **/
                changeOrigin: true,

                /**
                 * http-proxy-middleware docs:
                 * "rewrites the location host/port on (301/302/307/308) redirects based on requested host/port. Default: false."
                 * https://github.com/chimurai/http-proxy-middleware
                 **/
                autoRewrite: true,

                /**
                 * don't remember what it does :)
                 **/
                headers: {
                    'X-ProxiedBy-Webpack': true,
                },

                /**
                 * res.end() will be called internally by responseInterceptor()
                 */
                selfHandleResponse: true,

                /**
                 * Intercept response and replace docker url with proxy url
                 **/
                onProxyRes: responseInterceptor(async (buffer, proxyRes, req, res) => {
                    return Promise.resolve(buffer
                        .toString('utf8')
                        .replace(new RegExp(`${URI}:${DOCKER_PORT}`, 'g'), `${URI}:${PROXY_PORT}`));
                }),
            },
        },
    },
};