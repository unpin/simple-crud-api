import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import TerserPlugin from 'terser-webpack-plugin';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default {
    entry: './index.js',
    mode: 'production',
    output: {
        module: true,
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
        clean: true,
    },
    target: 'node16.13',
    experiments: {
        outputModule: true,
    },
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    ecma: 2020,
                    module: true,
                },
                extractComments: true,
            }),
        ],
    },
};
