import type { UserConfig } from 'vite';

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
  features: {
    storyStoreV7: true,
  },
  viteFinal: (config: UserConfig) => {
    return {
      ...config,
      // Use absolute base for Vercel deployment, relative for local development
      base: process.env.VERCEL ? '/' : './',
    };
  },
};
