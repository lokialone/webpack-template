const webpack = require('webpack');
const CleanWebpackPlugin  = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const PurifyCssPlugin = require('purifycss-webpack-plugin');


exports.devServer = function(options) {
	return {

	    watchOptions: {
	      // Delay the rebuild after the first change
	      aggregateTimeout: 300,
	      // Poll using interval (in ms, accepts boolean too)
	      poll: 1000
	    },
		devServer: {
			// enble history api fallback to HTML5 History 
			// API based
			// routing works.This is a good defualt that wil
			// come in handy in more complicated setups
			historyApiFallback: true,
			hot: true,
			inline: true,

			// display onlu errors to reduce the amount of output
			stats: 'errors-only',
			host: options.host,
			port: options.port
		},
		plugins: [
			new webpack.HotModuleReplacementPlugin({
				multiStep: true
			})
		]
	}
}

exports.setupCSS = function(paths) {
	return {
		module: {
			loaders: [
			{
				test: /\.scss$/,
				loaders: ['style','css','sass'],
				include: paths
			},
			{
				test: /\.css$/,
				loaders: ['style','css'],
				include: paths
			},
			
			{
				test: /\.sass$/,
				loaders: ['style','css','sass'],
				include: paths
			}
		  ]
		}
	}
}


exports.setupReact = function(paths) {
	return{
		module: {
			test: /\.jsx?$/,
			loader: 'babel',
			query: {
				cacheDirectory: true,
				presets: ['react','es2015']
			},
			inline: paths
		}
	}
}

exports.extractCSS = function(paths) {
	return {
		module: {
			loaders: [
				{
					test: /\.css$/,
					loader: ExtractTextPlugin.extract('style','css'),
					include: paths
				}
			]
		},
		plugins: [
		new ExtractTextPlugin('[name].[chunkhash].css')
		]
	}
}

exports.extractSass = function(paths) {
	return {
		module: {
			loaders: [
				{
					test: /\.scss$/,
					loader: ExtractTextPlugin.extract('style', 'css!sass'),
					include: paths
				}
			]
		},
		plugins: [
		// Output extracted CSS to a file
			new ExtractTextPlugin('[name].[chunkhash].css')
		]
	}
}

exports.purifyCSS = function(paths) {
	return {
		plugins: [
			new PurifyCssPlugin({
				basePath: process.cwd(),
				path:paths
			})
		]
	}
}

exports.minify = function() {
	return {
		plugins: [
			new webpack.optimize.UglifyJsPlugin({
				// Don't beautify output (enable for neater output)
				beautify: false,

				// Eliminate comments
				comments: false,

				// Compression specific options
				compress: {

					warnings: false,

					// Drop `console` statements
					drop_console: true
				},

				// Mangling specific options
				mangle: {
					// Don't mangle $
					except: ['$'],

					// Don't care about IE8
					screw_ie8 : true,

					// Don't mangle function names
					keep_fnames: true
 			   }
			})
		]
	}
}

exports.setFreeVariable = function(key,value) {
	const env = [];
	env[key]  = JSON.stringify(value);

	return {
		plugins:[
			new webpack.DefinePlugin(env)
		]
	}
}

// split files
exports.extractBundle = function(options) {
	const entry = {};
	entry[options.name] = options.entries;

	return {
		entry: entry,
		plugins: [
			new webpack.optimize.CommonsChunkPlugin({
				name: [options.name,'manifest']
		})
		]
	}
}

exports.uglifyImage = function(paths) {
	return {
		module: {
			loaders: [
				{
				    test: /.*\.(gif|png|jpe?g|svg)$/i,
				    loaders: [
				      'file?hash=sha512&digest=hex&name=[hash].[ext]',
				      'image-webpack'
				    ],
				    include: paths
			  	}
			]
		}
	}
}

exports.clean = function(path) {
	return {
		plugins: [
			new CleanWebpackPlugin([path],{
				root:process.cwd()
			})
		]
	}
}