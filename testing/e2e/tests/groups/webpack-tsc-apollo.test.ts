// testing/e2e/tests/webpack-ts-apollo.test.ts
import { describe, expect, it } from 'vitest';
import { analyzeVirtualApp } from '../../testkits/virtual-app/index.js';

describe('detects webpack, typescript and apollo in vanilla app', async () => {
  const result = await analyzeVirtualApp({
    outDir: 'dist',
    buildCommand: 'webpack --mode production',
    dependencies: {
      typescript: 'latest',
      webpack: 'latest',
      'webpack-cli': 'latest',
      '@apollo/client': 'latest',
      graphql: 'latest',
      'ts-loader': 'latest',
      'html-webpack-plugin': 'latest',
    },
    files: {
      'src/types.ts': `
        export interface User {
          id: string;
          name: string;
          email: string;
        }

        export interface Post {
          id: string;
          title: string;
          content: string;
          author: User;
        }

        export type PostsResponse = {
          posts: Post[];
        };
      `,

      'src/client.ts': `
        import {
          ApolloClient,
          InMemoryCache,
          gql,
          ApolloLink,
          HttpLink
        } from '@apollo/client/core';

        const httpLink = new HttpLink({
          uri: 'http://example.com/graphql'
        });

        const authLink = new ApolloLink((operation, forward) => {
          operation.setContext({
            headers: {
              authorization: localStorage.getItem('token') || ''
            }
          });
          return forward(operation);
        });

        export const client = new ApolloClient({
          link: authLink.concat(httpLink),
          cache: new InMemoryCache(),
          defaultOptions: {
            watchQuery: {
              fetchPolicy: 'cache-and-network'
            }
          }
        });

        export const POSTS_QUERY = gql\`
          query Posts {
            posts {
              id
              title
              content
              author {
                id
                name
                email
              }
            }
          }
        \`;

        export const CREATE_POST = gql\`
          mutation CreatePost($title: String!, $content: String!) {
            createPost(title: $title, content: $content) {
              id
              title
              content
              author {
                id
                name
                email
              }
            }
          }
        \`;
      `,

      'src/index.ts': `
        import { client, POSTS_QUERY, CREATE_POST } from './client';
        import type { PostsResponse } from './types';

        class PostsManager {
          private readonly client = client;

          async fetchPosts(): Promise<void> {
            try {
              const { data, error } = await this.client.query({
                query: POSTS_QUERY
              });

              if (error) {
                console.error('Error fetching posts:', error);
              }

              if (data) {
                this.displayPosts(data.posts);
              }
            } catch (error) {
              console.error('Failed to fetch posts:', error);
            }
          }

          private displayPosts(posts: PostsResponse['posts']): void {
            const container = document.getElementById('posts-container');
            if (!container) return;

            posts.forEach(post => {
              const element = document.createElement('div');
              element.innerHTML = \`
                <h2>\${post.title}</h2>
                <p>\${post.content}</p>
                <small>By: \${post.author.name}</small>
              \`;
              container.appendChild(element);
            });
          }

          async createPost(title: string, content: string): Promise<void> {
            try {
              const { data, errors } = await this.client.mutate({
                mutation: CREATE_POST,
                variables: { title, content }
              });

              if (errors) {
                console.error('Error creating post:', errors);
              }
            } catch (error) {
              console.error('Failed to create post:', error);
            }
          }
        }

        const manager = new PostsManager();
        manager.fetchPosts();
      `,

      'public/index.html': `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8">
            <title>Posts App</title>
          </head>
          <body>
            <div id="posts-container"></div>
          </body>
        </html>
      `,

      'webpack.config.js': `
        const path = require('path');
        const HtmlWebpackPlugin = require('html-webpack-plugin');

        module.exports = {
          entry: './src/index.ts',
          output: {
            path: path.resolve(__dirname, 'dist'),
            filename: '[name].[contenthash].js',
            clean: true
          },
          resolve: {
            extensions: ['.ts', '.js']
          },
          module: {
            rules: [
              {
                test: /\\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
              }
            ]
          },
          plugins: [
            new HtmlWebpackPlugin({
              template: path.resolve(__dirname, 'public/index.html'),
              inject: true
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

      'tsconfig.json': `
        {
          "compilerOptions": {
            "target": "es2020",
            "module": "es2020",
            "lib": ["es2020", "dom"],
            "strict": true,
            "esModuleInterop": true,
            "skipLibCheck": true,
            "forceConsistentCasingInFileNames": true,
            "moduleResolution": "node"
          },
          "include": ["src/**/*"]
        }
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

  it('detects typescript transpiler', async () => {
    expect(result.transpiler.name).toBe('typescript');
    expect(result.transpiler.confidence).toBeGreaterThanOrEqual(1);
  });

  it('detects apollo client usage', async () => {
    expect(result.httpClient.name).toBe('apollo');
    expect(result.httpClient.confidence).toBeGreaterThanOrEqual(1);
  });
});
