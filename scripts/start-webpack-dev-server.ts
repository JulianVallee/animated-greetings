/**
 * Allow starting webpack-dev-server programmatically as
 * a child process, this way we can start and stop the
 * docker containers and the webpack-dev-server with a
 * single command.
 *
 * @since 1.0.2
 */

const Webpack = require('webpack');
const StartWebpackDevServer = require('webpack-dev-server');
const webpackConfig = require('../webpack.config.js');

const compiler = Webpack(webpackConfig);
const server = new StartWebpackDevServer(webpackConfig.devServer, compiler);

server.start();
