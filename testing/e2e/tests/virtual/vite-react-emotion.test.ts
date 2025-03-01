import { describe, expect, it } from 'vitest';
import { analyzeVirtualApp } from '../../testkits/virtual/index.js';

describe('detects vite with react and emotion', async () => {
  const result = await analyzeVirtualApp(
    {
      outDir: 'dist',
      buildCommand: 'vite build',
      env: {
        VITE_DEBUG: 'true',
      },
      dependencies: {
        react: '^18.2.0',
        'react-dom': '^18.2.0',
        '@emotion/react': '^11.11.3',
        '@emotion/styled': '^11.11.0',
        '@vitejs/plugin-react': '^4.2.1',
        vite: '^5.0.10',
      },
      files: {
        'vite.config.js': `
          import { defineConfig } from 'vite'
          import react from '@vitejs/plugin-react'

          // https://vitejs.dev/config/
          export default defineConfig({
            plugins: [
              react({
                jsxImportSource: '@emotion/react',
                babel: {
                  plugins: ['@emotion/babel-plugin']
                }
              })
            ],
          })
        `,
        'index.html': `
          <!DOCTYPE html>
          <html lang="en">
            <head>
              <meta charset="UTF-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              <title>Vite + React + Emotion</title>
            </head>
            <body>
              <div id="root"></div>
              <script type="module" src="/src/main.jsx"></script>
            </body>
          </html>
        `,
        'src/main.jsx': `
          import React from 'react'
          import ReactDOM from 'react-dom/client'
          import App from './App'

          ReactDOM.createRoot(document.getElementById('root')).render(
            <React.StrictMode>
              <App />
            </React.StrictMode>,
          )
        `,
        'src/App.jsx': `
          import { useState } from 'react'
          import { css } from '@emotion/react'
          import styled from '@emotion/styled'
          import Card from './components/Card'

          // Emotion styled component
          const Container = styled.div\`
            max-width: 800px;
            margin: 0 auto;
            padding: 2rem;
            text-align: center;
          \`

          const Header = styled.header\`
            margin-bottom: 2rem;

            h1 {
              font-size: 2.5rem;
              color: #333;
            }
          \`

          const Button = styled.button\`
            background-color: ${
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (props: any) => (props.primary ? '#646cff' : 'transparent')
            };
            color: ${
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (props: any) => (props.primary ? 'white' : '#646cff')
            };
            border: 1px solid #646cff;
            border-radius: 8px;
            padding: 0.6em 1.2em;
            font-size: 1em;
            font-weight: 500;
            font-weight: 500;
            font-family: inherit;
            cursor: pointer;
            transition: border-color 0.25s, background-color 0.25s;
            margin: 0 0.5rem;

            &:hover {
              border-color: #747bff;
              background-color: ${
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (props: any) =>
                  props.primary ? '#747bff' : 'rgba(100, 108, 255, 0.1)'
              };
            }

            &:focus,
            &:focus-visible {
              outline: 4px auto -webkit-focus-ring-color;
            }
          \`

          const CardGrid = styled.div\`
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 2rem;
            margin-top: 2rem;
          \`

          function App() {
            const [count, setCount] = useState(0)

            return (
              <Container>
                <Header>
                  <h1>Vite + React + Emotion</h1>
                </Header>

                <div>
                  <p
                    css={css\`
                      font-size: 1.1rem;
                      margin-bottom: 1rem;
                      color: #555;
                    \`}
                  >
                    This is a simple example for detecting Vite with React and Emotion
                  </p>
                  <div>
                    <Button onClick={() => setCount(count => count - 1)}>Decrement</Button>
                    <span
                      css={css\`
                        display: inline-block;
                        padding: 0.5rem 1rem;
                        font-weight: bold;
                      \`}
                    >
                      {count}
                    </span>
                    <Button primary onClick={() => setCount(count => count + 1)}>Increment</Button>
                  </div>
                </div>

                <CardGrid>
                  <Card
                    title="Vite"
                    description="Next Generation Frontend Tooling"
                    bgColor="#747bff"
                  />
                  <Card
                    title="React"
                    description="JavaScript library for building user interfaces"
                    bgColor="#61dafb"
                  />
                  <Card
                    title="Emotion"
                    description="CSS-in-JS library designed for high performance"
                    bgColor="#d36ac2"
                  />
                </CardGrid>
              </Container>
            )
          }

          export default App
        `,
        'src/components/Card.jsx': `
          import { css } from '@emotion/react'
          import styled from '@emotion/styled'

          const CardContainer = styled.div\`
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            padding: 1.5rem;
            transition: transform 0.3s, box-shadow 0.3s;

            &:hover {
              transform: translateY(-5px);
              box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
            }
          \`

          const Icon = styled.div\`
            width: 50px;
            height: 50px;
            background-color: ${
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (props: any) => props.color || '#646cff'
            };
            border-radius: 50%;
            margin: 0 auto 1rem;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 1.5rem;
            font-weight: bold;
          \`

          const Card = ({ title, description, bgColor }) => {
            return (
              <CardContainer>
                <Icon color={bgColor}>
                  {title.charAt(0)}
                </Icon>
                <h2
                  css={css\`
                    font-size: 1.25rem;
                    margin-bottom: 0.5rem;
                    color: #333;
                  \`}
                >
                  {title}
                </h2>
                <p
                  css={css\`
                    color: #666;
                    font-size: 0.9rem;
                    line-height: 1.5;
                  \`}
                >
                  {description}
                </p>
              </CardContainer>
            )
          }

          export default Card
        `,
      },
    },
    { preserveFiles: true }
  );

  it('detects vite build tool', async () => {
    expect(result.bundler.name).toBe('vite');
    expect(result.bundler.confidence).toBeGreaterThanOrEqual(1);
    expect(result.bundler.secondaryMatches).toEqual({});
  });

  it('detects react ui library', async () => {
    expect(result.uiLibrary.name).toBe('react');
    expect(result.uiLibrary.confidence).toBeGreaterThanOrEqual(1);
    expect(result.uiLibrary.secondaryMatches).toEqual({});
  });

  it('detects emotion css-in-js library', async () => {
    expect(result.stylingProcessor.name).toBe('emotion');
    expect(result.stylingProcessor.confidence).toBeGreaterThanOrEqual(0.9);
    expect(result.stylingProcessor.secondaryMatches).toEqual({});
  });
});
