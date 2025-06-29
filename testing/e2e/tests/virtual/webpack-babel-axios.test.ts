// testing/e2e/tests/vanilla-webpack.test.ts
import { describe, expect, it } from 'vitest';
import { analyzeVirtualApp } from '../../testkits/virtual/index.js';

describe('detects webpack, babel and axios in vanilla js app', async () => {
  const result = await analyzeVirtualApp({
    outDir: 'dist',
    buildCommand: 'webpack --mode production',
    dependencies: {
      axios: '1.7.9',
      webpack: '5.98.0',
      'webpack-cli': '6.0.1',
      '@babel/core': '7.26.9',
      '@babel/preset-env': '7.26.9',
      'babel-loader': '8.1.0',
      'css-loader': '6.9.1',
      'style-loader': '3.3.4',
      'html-webpack-plugin': '5.5.0',
    },
    files: {
      'src/api.js': `
        import axios from 'axios';

        export async function fetchData() {
          try {
            await axios.get('/non-existent-endpoint');
          } catch (error) {
            if (axios.isAxiosError(error)) {
              console.log('Expected error:', error.message);
            }
            return { status: 'error', message: error.message };
          }
        }

        export async function postData() {
          try {
            const response = await axios.post('/api/data', {
              test: 'data'
            }, {
              headers: {
                'Content-Type': 'application/json'
              }
            });
            return response.data;
          } catch (error) {
            console.log('Expected error:', error.message);
            return null;
          }
        }

        // More Axios patterns for detection
        export const axiosInstance = axios.create({
          baseURL: 'https://api.example.com',
          timeout: 5000,
          headers: {
            'X-Custom-Header': 'testing'
          }
        });
      `,

      'src/index.js': `
        import './styles.css';
        import { fetchData, postData, axiosInstance } from './api';

        async function init() {
          const resultDiv = document.createElement('div');
          resultDiv.className = 'result';
          document.body.appendChild(resultDiv);

          // Trigger some axios requests that will fail
          // (good for detection, no need for success)
          try {
            await fetchData();
            await postData();
            await axiosInstance.get('/test');
          } catch (error) {
            console.log('Expected errors:', error);
          }

          // Add some ES6+ features for Babel to transform
          const numbers = [1, 2, 3];
          const doubled = numbers?.map(n => n * 2);
          const sum = doubled.reduce((a, b) => a + b, 0);

          resultDiv.innerHTML = \`
            <h1>Test Results</h1>
            <p>Sum of doubled numbers: \${sum}</p>
            <p>Using optional chaining: \${numbers?.length}</p>
            <p>Using nullish coalescing: \${null ?? 'fallback'}</p>
          \`;
        }

        init();
      `,

      'src/styles.css': `
        .result {
          padding: 20px;
          margin: 20px;
          border: 1px solid #ccc;
          border-radius: 4px;
        }

        h1 {
          color: #333;
          font-family: sans-serif;
        }
      `,

      'webpack.config.js': `
        const path = require('path');
        const HtmlWebpackPlugin = require('html-webpack-plugin');

        module.exports = {
          entry: './src/index.js',
          output: {
            path: path.resolve(__dirname, 'dist'),
            filename: '[name].[contenthash].js',
            clean: true
          },
          module: {
            rules: [
              {
                test: /\\.js$/,
                exclude: /node_modules/,
                use: {
                  loader: 'babel-loader',
                  options: {
                    presets: ['@babel/preset-env']
                  }
                }
              },
              {
                test: /\\.css$/,
                use: ['style-loader', 'css-loader']
              }
            ]
          },
          plugins: [
            new HtmlWebpackPlugin({
              template: 'index.html'
            })
          ],
          optimization: {
            splitChunks: {
              chunks: 'all',
              cacheGroups: {
                vendor: {
                  test: /[\\\\/]node_modules[\\\\/]/,
                  name: 'vendors',
                  chunks: 'all'
                }
              }
            }
          }
        };
      `,

      'babel.config.js': `
        module.exports = {
          presets: [
            [
              '@babel/preset-env',
              {
                targets: '> 0.25%, not dead',
                useBuiltIns: 'usage',
                corejs: 3
              }
            ]
          ]
        };
      `,

      'index.html': `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <title>Webpack App</title>
          </head>
          <body>
            <div id="app"></div>
          </body>
        </html>
      `,
    },
  });

  it('should not detect any framework', async () => {
    expect(result.framework.name).toBe('unknown');
  });

  it('should not detect any ui library', async () => {
    expect(result.uiLibrary.name).toBe('unknown');
  });

  it('detects webpack bundler', async () => {
    expect(result.bundler.name).toBe('webpack');
    expect(result.bundler.confidence).toBeGreaterThanOrEqual(1);
  });

  it('detects babel transpiler', async () => {
    expect(result.transpiler.name).toBe('babel');
    expect(result.transpiler.confidence).toBeGreaterThanOrEqual(0.6);
  });

  it('detects axios usage', async () => {
    expect(result.httpClient.name).toBe('axios');
    expect(result.httpClient.confidence).toBeGreaterThanOrEqual(1);
  });
});
