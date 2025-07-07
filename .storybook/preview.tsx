import type { Preview } from '@storybook/react'
import React, { useEffect } from 'react'
import { Providers } from '../src/providers'
import { cn } from '../src/utilities/cn'
import './fonts.css'
import './tailwind-full.css'

const preview: Preview = {
  decorators: [
    (Story, context) => {
      const { theme } = context.globals

      useEffect(() => {
        const html = document.documentElement
        // Set the data-theme attribute on the HTML element
        html.setAttribute('data-theme', theme)
      }, [theme])

      return (
        <Providers>
          {/* Default to light theme, but allow Storybook's theme switcher to work */}
          <main
            className={cn(
              'bg-background p-4 text-foreground font-sans',
            )}
          >
            <Story />
          </main>
        </Providers>
      )
    },
  ],
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'light',
          value: '#ffffff',
        },
        {
          name: 'dark',
          value: '#1a1a1a',
        },
        {
          name: 'tournament',
          value: '#f5f5f4',
        },
      ],
    },
    viewport: {
      viewports: {
        mobile1: {
          name: 'Small mobile',
          styles: { width: '320px', height: '568px' },
        },
        mobile2: {
          name: 'Large mobile',
          styles: { width: '414px', height: '896px' },
        },
        tablet: {
          name: 'Tablet',
          styles: { width: '768px', height: '1024px' },
        },
        desktop: {
          name: 'Desktop',
          styles: { width: '1024px', height: '768px' },
        },
        scorekeeperTablet: {
          name: 'Scorekeeper Tablet',
          styles: { width: '1024px', height: '768px' },
        },
      },
    },
    docs: {
      toc: {
        contentsSelector: '.sbdocs-content',
        headingSelector: 'h1, h2, h3',
        ignoreSelector: '#primary',
        title: 'Table of Contents',
        disable: false,
      },
    },
  },
  globalTypes: {
    theme: {
      description: 'Global theme for components',
      defaultValue: 'light',
      toolbar: {
        title: 'Theme',
        icon: 'paintbrush',
        items: ['light', 'dark'],
        dynamicTitle: true,
      },
    },
  },
}

export default preview
