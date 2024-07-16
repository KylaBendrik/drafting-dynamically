import esbuild from 'esbuild';

const args = process.argv.slice(2);
const watch = args.includes('--watch');
const deploy = args.includes('--deploy');

const loader = {
  // Add loaders for images/fonts/etc, e.g. { '.svg': 'file' }
};

const plugins = [
  // Add and configure plugins here
];

const options = {
  entryPoints: ['display.js'],
  bundle: true,
  format: 'esm',
  logLevel: 'info',
  target: ['firefox127', 'chrome126'],
  outdir: 'dist',
  external: ['*.css', 'fonts/*', 'images/*'],
  minify: deploy,
  loader,
  plugins,
};

if (watch) {
  esbuild
    .context({ ...options, sourcemap: 'inline' })
    .then((ctx) => {
      ctx.watch();
    })
    .catch((_error) => {
      process.exit(1);
    });
} else {
  esbuild.build(options);
}
