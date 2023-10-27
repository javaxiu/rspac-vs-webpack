/**
 * @type {import('@rspack/cli').Configuration}
 */
module.exports = {
	entry: {
		app: './src/app.tsx'
	},
	output: {
		filename: 'rspack_output.js',
	},
  externals: {
    react: 'var window.React',
    'react-dom': 'var window.ReactDOM',
  },
	module: {
		rules: [
			{
				test: /\.s[ca]ss$/,
				use: [
					{
						loader: "sass-loader",
						options: {},
					},
				],
				type: "css",
			},
		]
	}
};
