import { describe, expect, it } from 'vitest';
import { analyzeVirtualApp } from '../../testkits/virtual/index.js';

describe('detects next.js with react, ant design, postcss and react-intl', async () => {
  const result = await analyzeVirtualApp(
    {
      outDir: '.next',
      buildCommand: 'next build',
      startCommand: 'next start',
      env: {
        NEXT_DEBUG: 'true',
      },
      dependencies: {
        '@types/react': '19.0.10',
        '@types/node': '22.13.4',
        next: '15.1.7',
        react: '19.0.0',
        typescript: '5.7.3',
        'react-dom': '19.0.0',
        antd: '5.12.2',
        '@ant-design/icons': '5.2.6',
        postcss: '8.4.32',
        'postcss-preset-env': '9.3.0',
        'postcss-flexbugs-fixes': '5.0.2',
        'postcss-nested': '6.0.1',
        'postcss-mixins': '9.0.4',
        'postcss-import': '15.1.0',
        'react-intl': '7.1.6',
      },
      files: {
        'postcss.config.js': `
          module.exports = {
            plugins: [
              'postcss-import',
              'postcss-flexbugs-fixes',
              'postcss-mixins',
              'postcss-nested',
              [
                'postcss-preset-env',
                {
                  autoprefixer: {
                    flexbox: 'no-2009',
                  },
                  stage: 3,
                  features: {
                    'custom-properties': false,
                    'nesting-rules': true,
                  },
                },
              ],
            ],
          }
        `,
        'src/styles/mixins.css': `
          @define-mixin heading $size: 18px, $weight: bold, $color: #333 {
            font-size: $size;
            font-weight: $weight;
            color: $color;
            margin-bottom: 1rem;
          }

          @define-mixin card {
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            padding: 20px;
            background-color: white;
          }

          @define-mixin button $bg: #1890ff, $color: white {
            display: inline-block;
            background-color: $bg;
            color: $color;
            border: none;
            border-radius: 4px;
            padding: 8px 16px;
            cursor: pointer;
            transition: background-color 0.3s;

            &:hover {
              background-color: color-mod($bg shade(15%));
            }
          }
        `,
        'src/styles/variables.css': `
          :root {
            --primary-color: #1890ff;
            --secondary-color: #722ed1;
            --error-color: #f5222d;
            --warning-color: #faad14;
            --info-color: #1890ff;
            --success-color: #52c41a;

            --text-primary: rgba(0, 0, 0, 0.85);
            --text-secondary: rgba(0, 0, 0, 0.65);
            --text-disabled: rgba(0, 0, 0, 0.45);

            --background-default: #f0f2f5;
            --background-paper: #ffffff;

            --spacing-unit: 8px;
            --border-radius: 4px;
          }
        `,
        'src/styles/global.css': `
          @import './variables.css';
          @import './mixins.css';

          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }

          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif;
            background-color: var(--background-default);
            color: var(--text-primary);
            line-height: 1.5;
          }

          .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 var(--spacing-unit);
          }

          .section {
            margin: calc(var(--spacing-unit) * 4) 0;
          }

          .card {
            @mixin card;
          }

          .heading-large {
            @mixin heading 24px, bold, var(--text-primary);
          }

          .heading-medium {
            @mixin heading 20px, 500, var(--text-primary);
          }

          .heading-small {
            @mixin heading 16px, 500, var(--text-secondary);
          }

          .custom-button {
            @mixin button;

            &.secondary {
              @mixin button var(--secondary-color), white;
            }

            &.text-only {
              background-color: transparent;
              color: var(--primary-color);
              padding: 6px 8px;

              &:hover {
                background-color: rgba(24, 144, 255, 0.04);
              }
            }
          }

          /* Example of PostCSS nesting */
          .custom-input {
            border: 1px solid #d9d9d9;
            border-radius: var(--border-radius);
            padding: 8px 12px;
            width: 100%;

            &:focus {
              border-color: var(--primary-color);
              outline: none;
              box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
            }

            &.error {
              border-color: var(--error-color);
            }

            &::placeholder {
              color: var(--text-disabled);
            }
          }
        `,
        'src/theme/theme.js': `
        'use client';

          import { theme as antdTheme } from 'antd';

          const theme = {
            token: {
              colorPrimary: '#1890ff',
              colorSuccess: '#52c41a',
              colorWarning: '#faad14',
              colorError: '#f5222d',
              colorInfo: '#1890ff',
              borderRadius: 4,
              wireframe: false,
            },
            components: {
              Button: {
                borderRadius: 4,
                primaryColor: '#1890ff',
              },
              Card: {
                borderRadius: 8,
              },
            },
          };

          export default theme;
        `,
        'src/lang/en.json': `{
          "welcome": "Welcome",
          "dashboard": "Dashboard",
          "profile": "Profile",
          "settings": "Settings",
          "language": "Language"
        }`,
        'src/lang/uk.json': `{
          "welcome": "Ласкаво просимо",
          "dashboard": "Панель керування",
          "profile": "Профіль",
          "settings": "Налаштування",
          "language": "Мова"
        }`,
        'src/i18n/intl.js': `
          'use client';

          import React from 'react';
          import { IntlProvider } from 'react-intl';
          import enMessages from '../lang/en.json';
          import ukMessages from '../lang/uk.json';

          const messages = {
            en: enMessages,
            uk: ukMessages,
          };

          export const IntlProviderWrapper = ({ children, locale = 'en' }) => {
            return (
              <IntlProvider locale={locale} messages={messages[locale]} defaultLocale="en">
                {children}
              </IntlProvider>
            );
          };
        `,
        'src/components/LanguageSwitcher.jsx': `
          import React from 'react';
          import { useIntl } from 'react-intl';
          import { Radio } from 'antd';

          const LanguageSwitcher = ({ locale, setLocale }) => {
            const intl = useIntl();

            const handleChange = (e) => {
              setLocale(e.target.value);
            };

            return (
              <Radio.Group
                value={locale}
                onChange={handleChange}
                buttonStyle="solid"
                size="small"
              >
                <Radio.Button value="en">EN</Radio.Button>
                <Radio.Button value="uk">UK</Radio.Button>
              </Radio.Group>
            );
          };

          export default LanguageSwitcher;
        `,
        'src/components/CustomCard.jsx': `
          import React from 'react';
          import { Card, Typography, Button, Space } from 'antd';
          import styles from './CustomCard.module.css';

          const { Title, Paragraph } = Typography;

          const CustomCard = ({ title, description, primaryAction, secondaryAction }) => {
            return (
              <Card className={styles.customCard}>
                <Title level={5}>{title}</Title>
                <Paragraph type="secondary">{description}</Paragraph>
                <Space>
                  {primaryAction && (
                    <Button type="primary" size="small">
                      {primaryAction}
                    </Button>
                  )}
                  {secondaryAction && (
                    <Button size="small">
                      {secondaryAction}
                    </Button>
                  )}
                </Space>
              </Card>
            );
          };

          export default CustomCard;
        `,
        'src/components/CustomCard.module.css': `
          .customCard {
            margin-bottom: 16px;
            transition: transform 0.3s ease;

            &:hover {
              transform: translateY(-4px);
            }

            & h5 {
              color: var(--primary-color);
            }
          }
        `,
        'src/components/Dashboard.jsx': `
          import React, { useState } from 'react';
          import {
            Layout,
            Typography,
            Menu,
            Button,
            Input,
            Card,
            Row,
            Col,
            Divider,
            Space,
            theme
          } from 'antd';
          import {
            MenuUnfoldOutlined,
            MenuFoldOutlined,
            DashboardOutlined,
            UserOutlined,
            SettingOutlined,
            BellOutlined
          } from '@ant-design/icons';
          import { useIntl, FormattedMessage } from 'react-intl';
          import CustomCard from './CustomCard';
          import LanguageSwitcher from './LanguageSwitcher';
          import '../styles/global.css';

          const { Header, Sider, Content } = Layout;
          const { Title, Text, Paragraph } = Typography;

          const Dashboard = ({ locale, setLocale }) => {
            const intl = useIntl();
            const { token } = theme.useToken();
            const [collapsed, setCollapsed] = useState(false);

            const toggleCollapsed = () => {
              setCollapsed(!collapsed);
            };

            return (
              <Layout style={{ minHeight: '100vh' }}>
                <Sider trigger={null} collapsible collapsed={collapsed} theme="light">
                  <div style={{ height: 32, margin: 16, background: 'rgba(0, 0, 0, 0.2)', borderRadius: 4 }} />
                  <Menu
                    mode="inline"
                    defaultSelectedKeys={['1']}
                    items={[
                      {
                        key: '1',
                        icon: <DashboardOutlined />,
                        label: intl.formatMessage({ id: 'dashboard' }),
                      },
                      {
                        key: '2',
                        icon: <UserOutlined />,
                        label: intl.formatMessage({ id: 'profile' }),
                      },
                      {
                        key: '3',
                        icon: <SettingOutlined />,
                        label: intl.formatMessage({ id: 'settings' }),
                      },
                    ]}
                  />
                </Sider>
                <Layout className="site-layout">
                  <Header style={{ padding: 0, background: token.colorBgContainer }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingRight: 24 }}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                          className: 'trigger',
                          onClick: toggleCollapsed,
                          style: { fontSize: 18, padding: '0 24px', cursor: 'pointer' }
                        })}
                        <Title level={4} style={{ margin: 0 }}>
                          <FormattedMessage id="welcome" />
                        </Title>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <Text>
                          <FormattedMessage id="language" />:
                        </Text>
                        <LanguageSwitcher locale={locale} setLocale={setLocale} />
                        <Button type="text" icon={<BellOutlined />} />
                      </div>
                    </div>
                  </Header>
                  <Content style={{ margin: '24px 16px', padding: 24, background: token.colorBgContainer, overflow: 'auto' }}>
                    <Title level={2}>
                      <FormattedMessage id="dashboard" />
                    </Title>

                    <Row gutter={[16, 16]}>
                      <Col xs={24} md={16}>
                        <Card>
                          <Title level={4}>Ant Design Components</Title>
                          <Paragraph>
                            This example shows Ant Design components working alongside PostCSS for custom styling.
                          </Paragraph>
                          <Input placeholder="Standard Input" style={{ marginBottom: 16 }} />
                          <Space>
                            <Button type="primary">Primary</Button>
                            <Button type="default">Default</Button>
                            <Button type="dashed">Dashed</Button>
                          </Space>
                        </Card>
                      </Col>

                      <Col xs={24} md={8}>
                        <CustomCard
                          title="PostCSS Features"
                          description="This card component shows custom styling using PostCSS with nesting, mixins, and variables."
                          primaryAction="Learn More"
                          secondaryAction="Dismiss"
                        />

                        <div className="card">
                          <h3 className="heading-medium">Custom PostCSS Classes</h3>
                          <p>This uses custom classes with PostCSS mixins.</p>
                          <input className="custom-input" placeholder="Custom input..." />
                          <div style={{ marginTop: '16px' }}>
                            <button className="custom-button">Custom Button</button>
                            <button className="custom-button secondary" style={{ marginLeft: '8px' }}>Secondary</button>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </Content>
                </Layout>
              </Layout>
            );
          };

          export default Dashboard;
        `,
        'src/app/layout.js': `
          export const metadata = {
            title: 'Next.js with Ant Design, PostCSS and react-intl',
            description: 'A sample app for testing style and i18n detection',
          };

          export default function RootLayout({ children }) {
            return (
              <html lang="en">
                <body>{children}</body>
              </html>
            );
          }
        `,
        'src/app/AntdRegistry.js': `
          'use client';

          import React from 'react';
          import { StyleProvider } from '@ant-design/cssinjs';
          import { ConfigProvider } from 'antd';
          import theme from '../theme/theme';

          export default function AntdRegistry({ children }) {
            return (
              <StyleProvider hashPriority="high">
                <ConfigProvider theme={theme}>
                  {children}
                </ConfigProvider>
              </StyleProvider>
            );
          }
        `,
        'src/app/page.js': `
          'use client';

          import { useState } from 'react';
          import Dashboard from '../components/Dashboard';
          import AntdRegistry from './AntdRegistry';
          import { IntlProviderWrapper } from '../i18n/intl';

          export default function Home() {
            const [locale, setLocale] = useState('en');

            return (
              <AntdRegistry>
                <IntlProviderWrapper locale={locale}>
                  <Dashboard locale={locale} setLocale={setLocale} />
                </IntlProviderWrapper>
              </AntdRegistry>
            );
          }
        `,
        'next.config.js': `
          /** @type {import('next').NextConfig} */
          const nextConfig = {
            reactStrictMode: true,
            transpilePackages: ['@ant-design/icons', '@ant-design/cssinjs', 'antd'],
            i18n: {
              locales: ['en', 'uk'],
              defaultLocale: 'en',
            },
            webpack: (config, { isServer, webpack }) => {
              // Add react-intl modules to a specific chunk
              config.optimization.splitChunks = {
                ...config.optimization.splitChunks,
                cacheGroups: {
                  ...config.optimization.splitChunks.cacheGroups,
                  reactIntl: {
                    test: /[\\/]node_modules[\\/]react-intl[\\/]/,
                    name: 'react-intl',
                    priority: 10,
                    chunks: 'all',
                  },
                  antDesign: {
                    test: /[\\/]node_modules[\\/]@ant-design[\\/]/,
                    name: 'ant-design',
                    priority: 10,
                    chunks: 'all',
                  },
                },
              };

              return config;
            },
          }

          module.exports = nextConfig
        `,
        'tsconfig.json': `
          {
            "compilerOptions": {
              "target": "es5",
              "lib": ["dom", "dom.iterable", "esnext"],
              "allowJs": true,
              "skipLibCheck": true,
              "strict": true,
              "forceConsistentCasingInFileNames": true,
              "noEmit": true,
              "esModuleInterop": true,
              "module": "esnext",
              "moduleResolution": "node",
              "resolveJsonModule": true,
              "isolatedModules": true,
              "jsx": "preserve",
              "incremental": true,
              "plugins": [
                {
                  "name": "next"
                }
              ],
              "paths": {
                "@/*": ["./src/*"]
              }
            },
            "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx", ".next/types/**/*.ts"],
            "exclude": ["node_modules"]
          }
        `,
      },
    },
    { preserveFiles: true }
  );

  it('detects next.js framework', async () => {
    expect(result.framework.name).toBe('next');
    expect(result.framework.confidence).toBeGreaterThanOrEqual(1);
    expect(result.framework.secondaryMatches).toEqual({});
  });

  it('detects react ui library', async () => {
    expect(result.uiLibrary.name).toBe('react');
    expect(result.uiLibrary.confidence).toBeGreaterThanOrEqual(1);
    expect(result.uiLibrary.secondaryMatches).toEqual({});
  });

  it('detects ant-design component library', async () => {
    expect(result.stylingLibraries.items.antDesign).toBeTruthy();
    expect(
      result.stylingLibraries.items.antDesign.confidence
    ).toBeGreaterThanOrEqual(0.9);
  });

  it('detects react-intl', async () => {
    expect(result.translations.name).toBe('reactIntl');
    expect(result.translations.confidence).toBeGreaterThanOrEqual(0.9);
  });
});
