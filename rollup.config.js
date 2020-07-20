import typescript from "rollup-plugin-typescript";
import sourceMaps from "rollup-plugin-sourcemaps";
import { eslint } from 'rollup-plugin-eslint';

export default {
  input: "./src/main.ts",
  plugins: [
    eslint({
      throwOnError: true,
      throwOnWarning: false,
      include: ['src/**'],
      exclude: ['node_modules/**']
  }),
    typescript({
      exclude: "node_modules/**",
      typescript: require("typescript")
    }),
    sourceMaps(),
    
  ],
  output: [
    {
      format: "cjs",
      file: "lib/bundle.cjs.js",
      sourcemap: true
    },
    {
      format: "es",
      file: "lib/bundle.esm.js",
      sourcemap: true
    }
  ]
};
