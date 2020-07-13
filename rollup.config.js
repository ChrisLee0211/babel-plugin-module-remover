import typescript from "rollup-plugin-typescript";
import sourceMaps from "rollup-plugin-sourcemaps";
import { eslint } from 'rollup-plugin-eslint';

export default {
  input: "./src/main.ts",
  plugins: [
    typescript({
      exclude: "node_modules/**",
      typescript: require("typescript")
    }),
    sourceMaps(),
    eslint({
      throwOnError: true,
      throwOnWarning: true,
      include: ['src/**'],
      exclude: ['node_modules/**']
  }),
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
