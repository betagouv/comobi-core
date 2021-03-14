import * as path from 'path'
import { common } from './webpack.common.js'
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default {
	...common,
	entry: [
		...(common.mode === 'development' ? ['webpack-hot-middleware/client'] : []),
		path.resolve(__dirname, '_scripts/main.js')
	],
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'frontend_build'),
		publicPath: '/frontend_build/'
	}
}