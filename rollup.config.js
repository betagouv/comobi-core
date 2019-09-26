import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import replace from 'rollup-plugin-replace'

const production = !process.env.ROLLUP_WATCH;

function makePlugins(){ 
	return [
		resolve(), 
		commonjs({
			namedExports: {
				// react
				'node_modules/react/index.js': ['createElement', 'createContext', 'forwardRef', 'useContext', 'Component', 'Fragment', 'Children', 'cloneElement', 'useState', 'useEffect'],
				// react-dom
				'node_modules/react-dom/index.js': ['createPortal', 'render'],
				// leaflet
				'node_modules/leaflet/dist/leaflet-src.js': ['Control', 'Circle', 'CircleMarker', 'DomUtil', 'FeatureGroup', 'GeoJSON', 'GridLayer', 'ImageOverlay', 'latLngBounds', 'LayerGroup', 'Map', 'Marker', 'Polygon', 'Polyline', 'Popup', 'Rectangle', 'TileLayer', 'Tooltip', 'VideoOverlay']
			}
		}),
		replace({ 'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV) }),
		production && terser()
	]
}

export default [
	{
		input: 'Corresplot/main.js',
		output: {
			file: 'build/corresplot-rollup-bundle.js',
			format: 'esm',
			sourcemap: true
		},
		plugins: makePlugins()
	},
	{
		input: 'demandes/main.js',
		output: {
			file: 'build/demandes-rollup-bundle.js',
			format: 'esm',
			sourcemap: true
		},
		plugins: makePlugins()
	}
]
