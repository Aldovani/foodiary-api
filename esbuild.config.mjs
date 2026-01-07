import esbuildPluginTsc from 'esbuild-plugin-tsc';

export default () => ({
  bundle: true,
  minify: true,
  sourcemap: false,
  platform: 'node',
  target: 'node22',
  exclude: ['!@aws-sdk/client-cognito-identity-provider'],
  external: ['!@aws-sdk/client-cognito-identity-provider'],
  plugins: [esbuildPluginTsc()],
});
