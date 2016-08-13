const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
const validate = require('webpack-validator');
const parts = require('./libs/parts');
const pkg = require('./package.json');

const PATHS = {
	app: path.join(__dirname,'app'),
	style: path.join(__dirname,'app','main.css'),
	build: path.join(__dirname,'build')
};

const common = {
	entry: {
		app: PATHS.app,
		style: PATHS.style,
		vendor: Object.keys(pkg.dependencies)
	},
	output: {
		path: PATHS.build
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
						 devtool: 'source-map',
						 output: {
						 	path:PATHS.build,
						 	filename:'[name].[chunkhash].js',
						 	chunkFilename: '[chunkhash].js'
						 }
					   },
					   parts.clean(PATHS.build),
					   parts.minify(),
					   parts.setFreeVariable('process.env.NODE_ENV','production'
					   	),
					   parts.extractBundle({
					   	name: 'vendor',
					   	entries: ['react']
					   }),
					   parts.extractCSS(PATHS.style));
		break;
	case 'start':
		config = merge(common,
						parts.setupCSS(PATHS.style),
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