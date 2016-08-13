const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
const validate = require('webpack-validator');
const parts = require('./libs/parts');

const PATHS = {
	app: path.join(__dirname,'app'),
	build: path.join(__dirname,'build')
};

const common = {
	entry: {
		app: PATHS.app
	},
	output: {
		path: PATHS.build,
		filename: '[name].js'
	},
	plugins: [
		new HtmlWebpackPlugin({
		title:'webpack demo'
	})]
};

var config;
switch(process.env.npm_lifecycle_event) {
	case 'build':
		config = merge(common,
					   {
						 devtool:'source-map'
					   },
					   parts.minify(),
					   parts.setFreeVariable('process.env.NODE_ENV','production'
					   	),
					   parts.setupCSS(PATHS.app));
		break;
	case 'start':
		config = merge(common,
						parts.setupCSS(PATHS.app),
						{
						    devtool: 'eval-source-map'
						},
					    parts.devServer({
					    	host: process.env.HOST,
					    	port: process.env.PORT
					    }));
		break;
	default:
		config = merge(common,{});
}

module.exports = validate(config);