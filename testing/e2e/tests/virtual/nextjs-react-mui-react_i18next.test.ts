import { describe, expect, it } from 'vitest';
import { analyzeVirtualApp } from '../../testkits/virtual/index.js';

describe('detects next.js with react, mui, postcss and i18next', async () => {
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
        '@mui/material': '^5.15.3',
        '@mui/icons-material': '^5.15.3',
        '@emotion/react': '^11.11.3',
        '@emotion/styled': '^11.11.0',
        postcss: '^8.4.32',
        'postcss-preset-env': '^9.3.0',
        'postcss-flexbugs-fixes': '^5.0.2',
        'postcss-nested': '^6.0.1',
        'postcss-mixins': '^9.0.4',
        'postcss-import': '^15.1.0',
        i18next: '^23.7.11',
        'react-i18next': '^13.5.0',
        'i18next-browser-languagedetector': '^7.2.0',
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

          @define-mixin button $bg: #1976d2, $color: white {
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
            --primary-color: #1976d2;
            --secondary-color: #9c27b0;
            --error-color: #d32f2f;
            --warning-color: #ed6c02;
            --info-color: #0288d1;
            --success-color: #2e7d32;

            --text-primary: rgba(0, 0, 0, 0.87);
            --text-secondary: rgba(0, 0, 0, 0.6);
            --text-disabled: rgba(0, 0, 0, 0.38);

            --background-default: #f5f5f5;
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
            font-family: 'Roboto', 'Helvetica', 'Arial', sans-serif;
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
                background-color: rgba(25, 118, 210, 0.04);
              }
            }
          }

          /* Example of PostCSS nesting */
          .custom-input {
            border: 1px solid #ccc;
            border-radius: var(--border-radius);
            padding: 8px 12px;
            width: 100%;

            &:focus {
              border-color: var(--primary-color);
              outline: none;
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

          import { createTheme } from '@mui/material/styles';

          const theme = createTheme({
            palette: {
              primary: {
                main: '#1976d2',
                light: '#42a5f5',
                dark: '#1565c0',
                contrastText: '#fff',
              },
              secondary: {
                main: '#9c27b0',
                light: '#ba68c8',
                dark: '#7b1fa2',
                contrastText: '#fff',
              },
              error: {
                main: '#d32f2f',
              },
              warning: {
                main: '#ed6c02',
              },
              info: {
                main: '#0288d1',
              },
              success: {
                main: '#2e7d32',
              },
              background: {
                default: '#f5f5f5',
                paper: '#ffffff',
              },
            },
            shape: {
              borderRadius: 4,
            },
            typography: {
              fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
              h1: {
                fontSize: '2.5rem',
                fontWeight: 500,
                lineHeight: 1.2,
              },
              h2: {
                fontSize: '2rem',
                fontWeight: 500,
                lineHeight: 1.3,
              },
              h3: {
                fontSize: '1.75rem',
                fontWeight: 500,
                lineHeight: 1.4,
              },
              h4: {
                fontSize: '1.5rem',
                fontWeight: 500,
                lineHeight: 1.4,
              },
              h5: {
                fontSize: '1.25rem',
                fontWeight: 500,
                lineHeight: 1.5,
              },
              h6: {
                fontSize: '1rem',
                fontWeight: 500,
                lineHeight: 1.6,
              },
              button: {
                textTransform: 'none',
              },
            },
            components: {
              MuiButton: {
                styleOverrides: {
                  root: {
                    borderRadius: 4,
                  },
                },
              },
              MuiPaper: {
                styleOverrides: {
                  root: {
                    borderRadius: 8,
                  },
                },
              },
            },
          });

          export default theme;
        `,
        'public/locales/en/common.json': `{
          "welcome": "Welcome",
          "dashboard": "Dashboard",
          "profile": "Profile",
          "settings": "Settings",
          "language": "Language"
        }`,
        'public/locales/uk/common.json': `{
          "welcome": "Ласкаво просимо",
          "dashboard": "Панель керування",
          "profile": "Профіль",
          "settings": "Налаштування",
          "language": "Мова"
        }`,
        'src/i18n/i18n.js': `
          'use client';

          import i18n from 'i18next';
          import { initReactI18next } from 'react-i18next';
          import LanguageDetector from 'i18next-browser-languagedetector';

          i18n
            .use(LanguageDetector) // Detect user language
            .use(initReactI18next) // Pass i18n instance to react-i18next
            .init({
              resources: {
                en: {
                  common: require('../../public/locales/en/common.json')
                },
                uk: {
                  common: require('../../public/locales/uk/common.json')
                }
              },
              fallbackLng: 'en',
              debug: false,
              ns: ['common'],
              defaultNS: 'common',
              interpolation: {
                escapeValue: false
              }
            });

          export default i18n;
        `,
        'src/components/LanguageSwitcher.jsx': `
          import React from 'react';
          import { useTranslation } from 'react-i18next';
          import { Button, ButtonGroup } from '@mui/material';

          const LanguageSwitcher = () => {
            const { t, i18n } = useTranslation();

            return (
              <ButtonGroup variant="text" color="inherit">
                <Button
                  onClick={() => i18n.changeLanguage('en')}
                  disabled={i18n.language === 'en'}
                >
                  EN
                </Button>
                <Button
                  onClick={() => i18n.changeLanguage('uk')}
                  disabled={i18n.language === 'uk'}
                >
                  UK
                </Button>
              </ButtonGroup>
            );
          };

          export default LanguageSwitcher;
        `,
        'src/components/CustomCard.jsx': `
          import React from 'react';
          import { Card, CardContent, CardActions, Typography, Button } from '@mui/material';
          import styles from './CustomCard.module.css';

          const CustomCard = ({ title, description, primaryAction, secondaryAction }) => {
            return (
              <Card className={styles.customCard}>
                <CardContent>
                  <Typography variant="h5" component="h2" gutterBottom>
                    {title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {description}
                  </Typography>
                </CardContent>
                <CardActions>
                  {primaryAction && (
                    <Button size="small" color="primary">
                      {primaryAction}
                    </Button>
                  )}
                  {secondaryAction && (
                    <Button size="small" color="secondary">
                      {secondaryAction}
                    </Button>
                  )}
                </CardActions>
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

            & h2 {
              color: var(--primary-color);
            }
          }
        `,
        'src/components/Dashboard.jsx': `
          import React, { useState } from 'react';
          import {
            Container,
            Grid,
            Paper,
            Typography,
            Button,
            TextField,
            Box,
            AppBar,
            Toolbar,
            IconButton,
            Drawer,
            List,
            ListItem,
            ListItemIcon,
            ListItemText,
            Divider,
            useTheme
          } from '@mui/material';
          import {
            Menu as MenuIcon,
            Dashboard as DashboardIcon,
            Person as PersonIcon,
            Settings as SettingsIcon,
            Notifications as NotificationsIcon
          } from '@mui/icons-material';
          import { useTranslation } from 'react-i18next';
          import CustomCard from './CustomCard';
          import LanguageSwitcher from './LanguageSwitcher';
          import '../styles/global.css';

          const Dashboard = () => {
            const theme = useTheme();
            const { t } = useTranslation();
            const [drawerOpen, setDrawerOpen] = useState(false);

            const toggleDrawer = () => {
              setDrawerOpen(!drawerOpen);
            };

            return (
              <Box sx={{ display: 'flex' }}>
                <AppBar position="fixed">
                  <Toolbar>
                    <IconButton
                      color="inherit"
                      aria-label="open drawer"
                      edge="start"
                      onClick={toggleDrawer}
                      sx={{ mr: 2 }}
                    >
                      <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                      {t('welcome')}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="body2" sx={{ mr: 1 }}>
                        {t('language')}:
                      </Typography>
                      <LanguageSwitcher />
                    </Box>
                  </Toolbar>
                </AppBar>

                <Drawer
                  variant="temporary"
                  open={drawerOpen}
                  onClose={toggleDrawer}
                  sx={{
                    width: 240,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                      width: 240,
                      boxSizing: 'border-box',
                    },
                  }}
                >
                  <Toolbar />
                  <Box sx={{ overflow: 'auto' }}>
                    <List>
                      <ListItem button>
                        <ListItemIcon><DashboardIcon /></ListItemIcon>
                        <ListItemText primary={t('dashboard')} />
                      </ListItem>
                      <ListItem button>
                        <ListItemIcon><PersonIcon /></ListItemIcon>
                        <ListItemText primary={t('profile')} />
                      </ListItem>
                      <ListItem button>
                        <ListItemIcon><SettingsIcon /></ListItemIcon>
                        <ListItemText primary={t('settings')} />
                      </ListItem>
                    </List>
                    <Divider />
                  </Box>
                </Drawer>

                <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
                  <Container maxWidth="lg">
                    <Typography variant="h4" gutterBottom>
                      {t('dashboard')}
                    </Typography>

                    {/* Rest of the dashboard content remains unchanged */}
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={8}>
                        <Paper sx={{ p: 2 }}>
                          <Typography variant="h6" gutterBottom>
                            MUI Components
                          </Typography>
                          <Typography paragraph>
                            This example shows Material UI components working alongside PostCSS for custom styling.
                          </Typography>
                          <TextField
                            label="Standard Input"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                          />
                          <Box sx={{ mt: 2 }}>
                            <Button variant="contained" color="primary" sx={{ mr: 1 }}>Primary</Button>
                            <Button variant="contained" color="secondary" sx={{ mr: 1 }}>Secondary</Button>
                            <Button variant="outlined" color="primary">Outlined</Button>
                          </Box>
                        </Paper>
                      </Grid>

                      <Grid item xs={12} md={4}>
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
                      </Grid>
                    </Grid>
                  </Container>
                </Box>
              </Box>
            );
          };

          export default Dashboard;
        `,
        'src/app/layout.js': `
          import { ThemeProvider } from '@mui/material/styles';
          import CssBaseline from '@mui/material/CssBaseline';
          import theme from '../theme/theme';
          import '../styles/global.css';

          export const metadata = {
            title: 'Next.js with MUI, PostCSS and i18next',
            description: 'A sample app for testing style and i18n detection',
          };

          export default function RootLayout({ children }) {
            return (
              <html lang="en">
                <body>
                  {/* MUI theme provider would normally go here, but for SSR compatibility in Next.js
                      we would need to use a client component with emotion cache setup.
                      This is simplified for the test */}
                  {children}
                </body>
              </html>
            );
          }
        `,
        'src/app/ThemeRegistry.js': `
          'use client';

          import { useState } from 'react';
          import { ThemeProvider } from '@mui/material/styles';
          import CssBaseline from '@mui/material/CssBaseline';
          import theme from '../theme/theme';

          export default function ThemeRegistry({ children }) {
            return (
              <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
              </ThemeProvider>
            );
          }
        `,
        'src/app/page.js': `
          'use client';

          import Dashboard from '../components/Dashboard';
          import ThemeRegistry from './ThemeRegistry';
          import '../i18n/i18n'; // Import i18n configuration

          export default function Home() {
            return (
              <ThemeRegistry>
                <Dashboard />
              </ThemeRegistry>
            );
          }
        `,
        'next.config.js': `
          /** @type {import('next').NextConfig} */
          const nextConfig = {
            reactStrictMode: true,
            transpilePackages: ['@mui/material', '@mui/icons-material', '@mui/system'],
            i18n: {
              locales: ['en', 'uk'],
              defaultLocale: 'en',
            },
            webpack: (config, { isServer, webpack }) => {
              // Add i18next-related modules to a specific chunk
              config.optimization.splitChunks = {
                ...config.optimization.splitChunks,
                cacheGroups: {
                  ...config.optimization.splitChunks.cacheGroups,
                  i18n: {
                    test: /[\\/]node_modules[\\/](i18next|i18next-browser-languagedetector)[\\/]/,
                    name: 'i18n',
                    priority: 10,
                    chunks: 'all',
                  },
                  'react-i18next': {
                    test: /[\\/]node_modules[\\/]react-i18next[\\/]/,
                    name: 'react-i18next',
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

  it('detects emotion', async () => {
    expect(result.stylingProcessor.name).toBe('emotion');
    expect(result.stylingProcessor.confidence).toBeGreaterThanOrEqual(0.9);
  });

  it('detects postcss', async () => {
    expect(result.stylingProcessor.secondaryMatches?.postCSS).toBeTruthy();
    expect(
      result.stylingProcessor.secondaryMatches?.postCSS?.confidence
    ).toBeGreaterThanOrEqual(0.9);
  });

  it('detects mui component library', async () => {
    expect(result.stylingLibraries.items.mui).toBeTruthy();
    expect(result.stylingLibraries.items.mui.confidence).toBeGreaterThanOrEqual(
      0.9
    );
  });

  it('detects react-i18next', async () => {
    expect(result.translations.name).toBe('reactI18next');
    expect(result.translations.confidence).toBeGreaterThanOrEqual(0.9);
    expect(
      result.translations.secondaryMatches.i18next?.confidence
    ).toBeGreaterThanOrEqual(0.9);
  });
});
