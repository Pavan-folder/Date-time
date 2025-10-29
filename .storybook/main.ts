export default {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions'
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {}
  },
  viteFinal: (config) => {
    return {
      ...config,
      // Use an environment-provided base when set (CI or special hosts),
      // otherwise default to a relative base so Storybook assets load from any host/root.
      base: process.env.STORYBOOK_BASE || './',
    };
  },
};
