// testing/e2e/tests/react-libs.test.ts
import { describe, expect, it } from 'vitest';
import { analyzeVirtualApp } from '../../testkits/virtual/index.js';

describe('detects storybook with react and luxon', async () => {
  const result = await analyzeVirtualApp({
    outDir: 'storybook-static',
    buildCommand: 'storybook build',
    dependencies: {
      react: '19.0.0',
      'react-dom': '19.0.0',
      luxon: '3.5.0',
      '@storybook/react': '8.5.8',
      '@storybook/react-vite': '8.5.8',
      '@storybook/addon-essentials': '8.5.8',
      vite: '6.1.1',
      '@vitejs/plugin-react': '4.3.4',
    },
    files: {
      'src/components/DateDisplay.tsx': `
        import React from 'react';
        import { DateTime } from 'luxon';

        interface DateDisplayProps {
          date: DateTime;
          format?: string;
        }

        export const DateDisplay: React.FC<DateDisplayProps> = ({
          date,
          format = 'MMMM dd, yyyy'
        }) => (
          <time dateTime={date.toISO()}>
            {date.toFormat(format)}
          </time>
        );
      `,

      'src/components/DateDisplay.stories.tsx': `
        import type { Meta, StoryObj } from '@storybook/react';
        import { DateTime } from 'luxon';
        import { DateDisplay } from './DateDisplay';

        const meta: Meta<typeof DateDisplay> = {
          title: 'Components/DateDisplay',
          component: DateDisplay,
        };

        export default meta;
        type Story = StoryObj<typeof DateDisplay>;

        export const Default: Story = {
          args: {
            date: DateTime.local(),
            format: 'MMMM dd, yyyy',
          },
        };

        export const ShortFormat: Story = {
          args: {
            date: DateTime.local(),
            format: 'MM/dd/yyyy',
          },
        };
      `,

      '.storybook/main.ts': `
        import type { StorybookConfig } from '@storybook/react-vite';

        const config: StorybookConfig = {
          stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
          addons: ['@storybook/addon-essentials'],
          framework: {
            name: '@storybook/react-vite',
            options: {},
          },
        };

        export default config;
      `,

      '.storybook/preview.ts': `
        import type { Preview } from '@storybook/react';

        const preview: Preview = {
          parameters: {
            actions: { argTypesRegex: '^on[A-Z].*' },
            controls: {
              matchers: {
                color: /(background|color)$/i,
                date: /Date$/,
              },
            },
          },
        };

        export default preview;
      `,
    },
  });

  it('detects storybook', async () => {
    expect(result.framework.name).toBe('storybook');
    expect(result.framework.confidence).toBeGreaterThanOrEqual(1);
  });

  it('detects react ui library', async () => {
    expect(result.uiLibrary.name).toBe('react');
    expect(result.uiLibrary.confidence).toBeGreaterThanOrEqual(1);
  });

  it('detects luxon usage', async () => {
    expect(result.dates.name).toBe('luxon');
    expect(result.dates.confidence).toBeGreaterThanOrEqual(1);
  });

  it('detects vite bundler', async () => {
    expect(result.bundler.name).toBe('vite');
    expect(result.bundler.confidence).toBeGreaterThanOrEqual(0.8);
  });
});
