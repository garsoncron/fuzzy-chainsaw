import type { StorybookConfig } from '@storybook/nextjs'
import path from 'path'

const config: StorybookConfig = {
  stories: [
    '../src/**/*.stories.@(js|jsx|ts|tsx|mdx)',
    '../src/**/*.story.@(js|jsx|ts|tsx|mdx)',
    './**/*.stories.@(js|jsx|ts|tsx|mdx)',
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-onboarding',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y',
  ],
  framework: {
    name: '@storybook/nextjs',
    options: {
      builder: {
        useSWC: true,
      },
    },
  },
  typescript: {
    check: false,
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) => (prop.parent ? !/node_modules/.test(prop.parent.fileName) : true),
    },
  },
  docs: {
    autodocs: 'tag',
    defaultName: 'Documentation',
  },
  staticDirs: ['../public'],
  webpackFinal: async (config, { configType }) => {
    // Handle absolute imports
    if (config.resolve) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@': path.resolve(__dirname, '../src'),
        '@/utilities': path.resolve(__dirname, '../src/utilities'),
        '@/components': path.resolve(__dirname, '../src/components'),
        // Mock Payload UI components that have SCSS issues
        '@payloadcms/ui/icons/Copy$': path.resolve(__dirname, './mocks/payloadcms-ui.js'),
        // Mock Next.js router functions
        'next/navigation': path.resolve(__dirname, './mocks/next-router.js'),
        'next/router': path.resolve(__dirname, './mocks/next-router.js'),
        'next/link': path.resolve(__dirname, './mocks/next-link.js'),
      }
    }

    return config
  },
}

export default config
