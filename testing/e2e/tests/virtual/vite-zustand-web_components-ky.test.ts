import { describe, expect, it } from 'vitest';
import { analyzeVirtualApp } from '../../testkits/virtual/index.js';
import { omit } from 'lodash-es';

describe('detects vite with zustand, web components and ky', async () => {
  const result = await analyzeVirtualApp(
    {
      outDir: 'dist',
      buildCommand: 'vite build',
      env: {
        VITE_DEBUG: 'true',
      },
      dependencies: {
        vite: '6.1.1',
        zustand: '5.0.3',
        ky: '1.1.3',
        lit: '3.1.0',
        '@webcomponents/custom-elements': '1.6.0',
      },
      packageJson: {
        type: 'module',
      },
      files: {
        'vite.config.js': `
          import { defineConfig } from 'vite';

          export default defineConfig({
            build: {
              target: 'esnext',
              rollupOptions: {
                output: {
                  manualChunks: (id) => {
                    // Create a separate chunk for zustand
                    if (id.includes('node_modules/zustand')) {
                      return 'vendor_zustand';
                    }

                    // Create a separate chunk for ky
                    if (id.includes('node_modules/ky')) {
                      return 'vendor_ky';
                    }

                    // Optionally group other vendor dependencies
                    if (id.includes('node_modules')) {
                      return 'vendor'; // All other dependencies
                    }
                  }
                }
              }
            },
          });
        `,
        'index.html': `
          <!DOCTYPE html>
          <html lang="en">
            <head>
              <meta charset="UTF-8" />
              <link rel="icon" type="image/svg+xml" href="/vite.svg" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              <title>Vite + Zustand + Web Components + Ky</title>
              <script type="module" src="/src/main.js"></script>
              <style>
                :root {
                  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
                  line-height: 1.5;
                  font-weight: 400;

                  color: #213547;
                  background-color: #ffffff;

                  font-synthesis: none;
                  text-rendering: optimizeLegibility;
                  -webkit-font-smoothing: antialiased;
                  -moz-osx-font-smoothing: grayscale;
                }

                body {
                  margin: 0;
                  display: flex;
                  place-items: center;
                  min-width: 320px;
                  min-height: 100vh;
                }

                #app {
                  max-width: 1280px;
                  margin: 0 auto;
                  padding: 2rem;
                  text-align: center;
                }
              </style>
            </head>
            <body>
              <div id="app">
                <app-header></app-header>
                <user-list></user-list>
                <data-loader url="https://api.example.com/nonexistent"></data-loader>
                <counter-component></counter-component>
                <theme-toggler></theme-toggler>
              </div>
            </body>
          </html>
        `,
        'src/main.js': `
          import './components/AppHeader.js';
          import './components/UserList.js';
          import './components/DataLoader.js';
          import './components/Counter.js';
          import './components/ThemeToggler.js';
          import { useStore } from './store.js';

          // Initialize the store
          const { initializeStore } = useStore.getState();
          initializeStore();
        `,
        'src/store.js': `
          import { create } from 'zustand';

          export const useStore = create((set, get) => ({
            count: 0,
            users: [],
            isLoading: false,
            error: null,
            theme: 'light',

            // Counter actions
            increment: () => set(state => ({ count: state.count + 1 })),
            decrement: () => set(state => ({ count: state.count - 1 })),
            reset: () => set({ count: 0 }),

            // User actions
            setUsers: (users) => set({ users }),
            setLoading: (isLoading) => set({ isLoading }),
            setError: (error) => set({ error }),

            // Theme actions
            toggleTheme: () => set(state => ({
              theme: state.theme === 'light' ? 'dark' : 'light'
            })),

            // Initialization
            initializeStore: () => {
              console.log('Store initialized');
              // You could load initial data here
            }
          }));
        `,
        'src/api.js': `
          import ky from 'ky';

          // Create a custom ky instance with default options
          export const api = ky.create({
            timeout: 10000,
            hooks: {
              beforeRequest: [
                request => {
                  request.headers.set('Content-Type', 'application/json');
                }
              ],
              afterResponse: [
                (_request, _options, response) => {
                  // You could do something with every response here
                  console.log(\`Response status: \${response.status}\`);
                }
              ]
            }
          });

          export async function fetchData(url) {
            try {
              return await api.get(url).json();
            } catch (error) {
              console.log('Fetch error gracefully handled:', error.message);
              // Return empty data instead of throwing
              return { data: [], message: 'Failed to fetch data' };
            }
          }

          export async function createResource(url, data) {
            try {
              return await api.post(url, { json: data }).json();
            } catch (error) {
              console.log('Create error gracefully handled:', error.message);
              return { success: false, message: 'Failed to create resource' };
            }
          }

          export async function updateResource(url, data) {
            try {
              return await api.put(url, { json: data }).json();
            } catch (error) {
              console.log('Update error gracefully handled:', error.message);
              return { success: false, message: 'Failed to update resource' };
            }
          }
        `,
        'src/components/AppHeader.js': `
          import { LitElement, html, css } from 'lit';
          import { useStore } from '../store.js';

          export class AppHeader extends LitElement {
            static styles = css\`
              :host {
                display: block;
                margin-bottom: 2rem;
              }

              h1 {
                font-size: 2.4rem;
                margin-bottom: 0.5rem;
              }

              .subtitle {
                color: #888;
                font-size: 1.2rem;
              }

              .dark-theme {
                color: #ffffff;
              }
            \`;

            constructor() {
              super();
              this.theme = 'light';

              // Subscribe to theme changes in the store
              useStore.subscribe(
                state => {
                  this.theme = state.theme;
                  this.requestUpdate();
                }
              );
            }

            render() {
              return html\`
                <div>
                  <h1 class=\${this.theme === 'dark' ? 'dark-theme' : ''}>
                    Vite + Zustand + Web Components + Ky
                  </h1>
                  <p class="subtitle">A modern web application stack</p>
                </div>
              \`;
            }
          }

          customElements.define('app-header', AppHeader);
        `,
        'src/components/Counter.js': `
          import { LitElement, html, css } from 'lit';
          import { useStore } from '../store.js';

          export class Counter extends LitElement {
            static styles = css\`
              :host {
                display: block;
                margin: 2rem 0;
                padding: 1rem;
                border: 1px solid #ddd;
                border-radius: 8px;
              }

              .count {
                font-size: 2rem;
                font-weight: bold;
                margin: 1rem 0;
              }

              button {
                background-color: #646cff;
                color: white;
                border: none;
                padding: 0.5rem 1rem;
                border-radius: 4px;
                margin: 0 0.5rem;
                cursor: pointer;
                font-size: 1rem;
                transition: background-color 0.2s;
              }

              button:hover {
                background-color: #535bf2;
              }

              button.reset {
                background-color: #888;
              }

              button.reset:hover {
                background-color: #666;
              }
            \`;

            constructor() {
              super();
              this.count = 0;

              // Subscribe to store changes
              useStore.subscribe(
                state => {
                  this.count = state.count;
                  this.requestUpdate();
                }
              );
            }

            increment() {
              useStore.getState().increment();
            }

            decrement() {
              useStore.getState().decrement();
            }

            reset() {
              useStore.getState().reset();
            }

            render() {
              return html\`
                <div>
                  <h2>Counter Component</h2>
                  <div class="count">\${this.count}</div>
                  <div>
                    <button @click=\${this.decrement}>-</button>
                    <button @click=\${this.reset} class="reset">Reset</button>
                    <button @click=\${this.increment}>+</button>
                  </div>
                </div>
              \`;
            }
          }

          customElements.define('counter-component', Counter);
        `,
        'src/components/UserList.js': `
          import { LitElement, html, css } from 'lit';
          import { useStore } from '../store.js';

          export class UserList extends LitElement {
            static styles = css\`
              :host {
                display: block;
                margin: 2rem 0;
              }

              .user-list {
                list-style: none;
                padding: 0;
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                gap: 1rem;
              }

              .user-card {
                border: 1px solid #ddd;
                border-radius: 8px;
                padding: 1rem;
                text-align: left;
              }

              .empty-state {
                color: #888;
                font-style: italic;
              }

              .name {
                font-weight: bold;
                margin-bottom: 0.5rem;
              }

              .email {
                color: #666;
                font-size: 0.9rem;
              }
            \`;

            constructor() {
              super();
              this.users = [];

              // Subscribe to store changes
              useStore.subscribe(
                state => {
                  this.users = state.users;
                  this.requestUpdate();
                }
              );
            }

            render() {
              return html\`
                <div>
                  <h2>User List</h2>

                  \${this.users.length === 0
                    ? html\`<p class="empty-state">No users found</p>\`
                    : html\`
                        <ul class="user-list">
                          \${this.users.map(user => html\`
                            <li class="user-card">
                              <div class="name">\${user.name}</div>
                              <div class="email">\${user.email}</div>
                            </li>
                          \`)}
                        </ul>
                      \`
                  }
                </div>
              \`;
            }
          }

          customElements.define('user-list', UserList);
        `,
        'src/components/DataLoader.js': `
          import { LitElement, html, css } from 'lit';
          import { fetchData } from '../api.js';
          import { useStore } from '../store.js';

          export class DataLoader extends LitElement {
            static properties = {
              url: { type: String },
              isLoading: { type: Boolean },
              hasError: { type: Boolean },
              errorMessage: { type: String }
            };

            static styles = css\`
              :host {
                display: block;
                margin: 2rem 0;
                padding: 1rem;
                border: 1px solid #ddd;
                border-radius: 8px;
              }

              button {
                background-color: #646cff;
                color: white;
                border: none;
                padding: 0.5rem 1rem;
                border-radius: 4px;
                cursor: pointer;
                font-size: 1rem;
              }

              button:hover {
                background-color: #535bf2;
              }

              button:disabled {
                background-color: #cccccc;
                cursor: not-allowed;
              }

              .status {
                margin-top: 1rem;
                padding: 0.5rem;
                border-radius: 4px;
              }

              .error {
                background-color: #ffeded;
                color: #e53935;
                border: 1px solid #ffcdd2;
              }

              .loading {
                background-color: #e3f2fd;
                color: #1976d2;
                border: 1px solid #bbdefb;
              }

              .success {
                background-color: #e8f5e9;
                color: #388e3c;
                border: 1px solid #c8e6c9;
              }
            \`;

            constructor() {
              super();
              this.url = '';
              this.isLoading = false;
              this.hasError = false;
              this.errorMessage = '';

              // Initialize with store state
              const state = useStore.getState();
              this.isLoading = state.isLoading;
              this.hasError = !!state.error;
              this.errorMessage = state.error;

              // Subscribe to store changes
              useStore.subscribe(
                state => {
                  this.isLoading = state.isLoading;
                  this.hasError = !!state.error;
                  this.errorMessage = state.error;
                  this.requestUpdate();
                }
              );
            }

            async loadData() {
              const { setLoading, setUsers, setError } = useStore.getState();

              // Update loading state
              setLoading(true);
              setError(null);
              this.hasError = false;

              try {
                const response = await fetchData(this.url);

                // Handle the response - even if it's our graceful error response
                if (response.message && response.message.includes('Failed')) {
                  // This is our gracefully handled error
                  setError('Failed to load users. Please try again later.');
                  setUsers([]);
                } else {
                  // Success case - but for our test, this won't happen
                  // since we're using a nonexistent URL
                  setUsers(response.data || []);
                }
              } catch (error) {
                // This shouldn't happen due to our error handling in fetchData
                // But just in case
                setError('An unexpected error occurred');
              } finally {
                setLoading(false);
              }
            }

            render() {
              return html\`
                <div>
                  <h2>Data Loader</h2>
                  <button
                    @click=\${this.loadData}
                    ?disabled=\${this.isLoading}
                  >
                    \${this.isLoading ? 'Loading...' : 'Load Users'}
                  </button>

                  \${this.isLoading
                    ? html\`<div class="status loading">Loading data...</div>\`
                    : this.hasError
                      ? html\`<div class="status error">\${this.errorMessage}</div>\`
                      : null
                  }
                </div>
              \`;
            }
          }

          customElements.define('data-loader', DataLoader);
        `,
        'src/components/ThemeToggler.js': `
          import { LitElement, html, css } from 'lit';
          import { useStore } from '../store.js';

          export class ThemeToggler extends LitElement {
            static styles = css\`
              :host {
                display: block;
                margin: 2rem 0;
              }

              .theme-toggle {
                background-color: #f5f5f5;
                border: 1px solid #ddd;
                border-radius: 8px;
                padding: 1rem;
                display: flex;
                flex-direction: column;
                align-items: center;
              }

              .switch {
                position: relative;
                display: inline-block;
                width: 60px;
                height: 34px;
                margin: 1rem 0;
              }

              .switch input {
                opacity: 0;
                width: 0;
                height: 0;
              }

              .slider {
                position: absolute;
                cursor: pointer;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: #ccc;
                transition: .4s;
                border-radius: 34px;
              }

              .slider:before {
                position: absolute;
                content: "";
                height: 26px;
                width: 26px;
                left: 4px;
                bottom: 4px;
                background-color: white;
                transition: .4s;
                border-radius: 50%;
              }

              input:checked + .slider {
                background-color: #2196F3;
              }

              input:checked + .slider:before {
                transform: translateX(26px);
              }

              .theme-label {
                margin-top: 0.5rem;
                font-weight: bold;
              }
            \`;

            constructor() {
              super();
              this.theme = 'light';

              // Subscribe to theme changes in the store
              useStore.subscribe(
                state => {
                  this.theme = state.theme;
                  this.requestUpdate();
                }
              );
            }

            toggleTheme() {
              useStore.getState().toggleTheme();
            }

            render() {
              return html\`
                <div class="theme-toggle">
                  <h2>Theme Settings</h2>
                  <label class="switch">
                    <input
                      type="checkbox"
                      ?checked=\${this.theme === 'dark'}
                      @change=\${this.toggleTheme}
                    >
                    <span class="slider"></span>
                  </label>
                  <div class="theme-label">
                    Current theme: \${this.theme === 'dark' ? 'Dark' : 'Light'}
                  </div>
                </div>
              \`;
            }
          }

          customElements.define('theme-toggler', ThemeToggler);
        `,
        'public/vite.svg': `
          <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--logos" width="31.88" height="32" preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 257"><defs><linearGradient id="IconifyId1813088fe1fbc01fb466" x1="-.828%" x2="57.636%" y1="7.652%" y2="78.411%"><stop offset="0%" stop-color="#41D1FF"></stop><stop offset="100%" stop-color="#BD34FE"></stop></linearGradient><linearGradient id="IconifyId1813088fe1fbc01fb467" x1="43.376%" x2="50.316%" y1="2.242%" y2="89.03%"><stop offset="0%" stop-color="#FFEA83"></stop><stop offset="8.333%" stop-color="#FFDD35"></stop><stop offset="100%" stop-color="#FFA800"></stop></linearGradient></defs><path fill="url(#IconifyId1813088fe1fbc01fb466)" d="M255.153 37.938L134.897 252.976c-2.483 4.44-8.862 4.466-11.382.048L.875 37.958c-2.746-4.814 1.371-10.646 6.827-9.67l120.385 21.517a6.537 6.537 0 0 0 2.322-.004l117.867-21.483c5.438-.991 9.574 4.796 6.877 9.62Z"></path><path fill="url(#IconifyId1813088fe1fbc01fb467)" d="M185.432.063L96.44 17.501a3.268 3.268 0 0 0-2.634 3.014l-5.474 92.456a3.268 3.268 0 0 0 3.997 3.378l24.777-5.718c2.318-.535 4.413 1.507 3.936 3.838l-7.361 36.047c-.495 2.426 1.782 4.5 4.151 3.78l15.304-4.649c2.372-.72 4.652 1.36 4.15 3.788l-11.698 56.621c-.732 3.542 3.979 5.473 5.943 2.437l1.313-2.028l72.516-144.72c1.215-2.423-.88-5.186-3.54-4.672l-25.505 4.922c-2.396.462-4.435-1.77-3.759-4.114l16.646-57.705c.677-2.35-1.37-4.583-3.769-4.113Z"></path></svg>
        `,
      },
    },
    { preserveFiles: true }
  );

  it('detects vite build tool', async () => {
    expect(result.bundler.name).toBe('vite');
    expect(result.bundler.confidence).toBeGreaterThanOrEqual(2);
    expect(result.bundler.secondaryMatches?.rollup?.confidence).toBeGreaterThan(
      1
    );
  });

  it('detects zustand state management', async () => {
    expect(result.stateManagement.name).toBe('zustand');
    expect(result.stateManagement.confidence).toBeGreaterThanOrEqual(0.9);
    expect(result.stateManagement.secondaryMatches).toEqual({});
  });

  it('detects web components', async () => {
    expect(result.uiLibrary.name).toBe('webComponents');
    expect(result.uiLibrary.confidence).toBeGreaterThanOrEqual(0.9);
  });

  it('detects ky http client', async () => {
    expect(result.httpClient.name).toBe('ky');
    expect(result.httpClient.confidence).toBeGreaterThanOrEqual(0.9);
    expect(
      result.httpClient.secondaryMatches.fetch?.confidence
    ).toBeGreaterThanOrEqual(0.8);
    expect(omit(result.httpClient.secondaryMatches, ['fetch'])).toEqual({});
  });
});
