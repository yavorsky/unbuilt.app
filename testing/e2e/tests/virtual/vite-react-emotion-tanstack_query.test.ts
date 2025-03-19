import { describe, expect, it } from 'vitest';
import { analyzeVirtualApp } from '../../testkits/virtual/index.js';

describe('detects vite with react, emotion, and react-query', async () => {
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
        '@tanstack/react-query': '^5.8.4',
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
            build: {
              rollupOptions: {
                output: {
                  manualChunks: {
                    'react': ['react', 'react-dom'],
                    'react-query': ['@tanstack/react-query'],
                    'emotion': ['@emotion/react', '@emotion/styled']
                  }
                }
              }
            }
          })
        `,
        'index.html': `
          <!DOCTYPE html>
          <html lang="en">
            <head>
              <meta charset="UTF-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              <title>Vite + React + Emotion + React Query</title>
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
          import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
          import App from './App'

          // Create a client
          const queryClient = new QueryClient({
            defaultOptions: {
              queries: {
                staleTime: 1000 * 60 * 5, // 5 minutes
                cacheTime: 1000 * 60 * 30, // 30 minutes
                refetchOnWindowFocus: false,
                retry: 1,
              },
            },
          })

          ReactDOM.createRoot(document.getElementById('root')).render(
            <React.StrictMode>
              <QueryClientProvider client={queryClient}>
                <App />
              </QueryClientProvider>
            </React.StrictMode>,
          )
        `,
        'src/App.jsx': `
          import { useState } from 'react'
          import { css } from '@emotion/react'
          import styled from '@emotion/styled'
          import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
          import Card from './components/Card'
          import TodoItem from './components/TodoItem'
          import { fetchTodos, updateTodo } from './api/mockApi'

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

          const TodoList = styled.div\`
            margin-top: 2rem;
            text-align: left;
            background: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            padding: 1.5rem;
          \`

          function App() {
            const [count, setCount] = useState(0)
            const queryClient = useQueryClient()

            // Use React Query to fetch todos
            const todosQuery = useQuery({
              queryKey: ['todos'],
              queryFn: fetchTodos,
            })

            // Use React Query mutation to update a todo
            const todoMutation = useMutation({
              mutationFn: updateTodo,
              onSuccess: () => {
                // Invalidate and refetch the todos query
                queryClient.invalidateQueries({ queryKey: ['todos'] })
              },
            })

            const handleToggleTodo = (id) => {
              const todo = todosQuery.data.find(todo => todo.id === id)
              todoMutation.mutate({ ...todo, completed: !todo.completed })
            }

            return (
              <Container>
                <Header>
                  <h1>Vite + React + Emotion + React Query</h1>
                </Header>

                <div>
                  <p
                    css={css\`
                      font-size: 1.1rem;
                      margin-bottom: 1rem;
                      color: #555;
                    \`}
                  >
                    This is a simple example for detecting Vite with React, Emotion, and React Query
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

                <TodoList>
                  <h2
                    css={css\`
                      margin-bottom: 1rem;
                      color: #333;
                    \`}
                  >
                    Todos
                  </h2>
                  {todosQuery.isLoading ? (
                    <div>Loading todos...</div>
                  ) : todosQuery.isError ? (
                    <div>Error loading todos: {todosQuery.error.message}</div>
                  ) : (
                    <>
                      <Button
                        onClick={() => todosQuery.refetch()}
                        disabled={todosQuery.isFetching}
                      >
                        {todosQuery.isFetching ? 'Refreshing...' : 'Refresh Todos'}
                      </Button>
                      <ul
                        css={css\`
                          list-style: none;
                          padding: 0;
                          margin-top: 1rem;
                        \`}
                      >
                        {todosQuery.data.map(todo => (
                          <TodoItem
                            key={todo.id}
                            todo={todo}
                            onToggle={handleToggleTodo}
                          />
                        ))}
                      </ul>
                    </>
                  )}
                </TodoList>

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
                  <Card
                    title="React Query"
                    description="Powerful async state management for React"
                    bgColor="#ff4154"
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
        'src/components/TodoItem.jsx': `
          import { css } from '@emotion/react'
          import styled from '@emotion/styled'

          const TodoItemContainer = styled.li\`
            padding: 0.75rem 0;
            border-bottom: 1px solid #eee;
            display: flex;
            align-items: center;
            transition: background-color 0.2s;

            &:hover {
              background-color: rgba(100, 108, 255, 0.05);
            }

            &:last-child {
              border-bottom: none;
            }
          \`

          const Checkbox = styled.input\`
            margin-right: 1rem;
            width: 18px;
            height: 18px;
            cursor: pointer;
          \`

          const TodoText = styled.span\`
            flex: 1;
            text-decoration: ${
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (props: any) => (props.completed ? 'line-through' : 'none')
            };
            color: ${
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (props: any) => (props.completed ? '#999' : '#333')
            };
          \`

          const TodoItem = ({ todo, onToggle }) => {
            return (
              <TodoItemContainer
                onClick={() => onToggle(todo.id)}
                css={css\`
                  cursor: pointer;
                \`}
              >
                <Checkbox
                  type="checkbox"
                  checked={todo.completed}
                  readOnly
                />
                <TodoText completed={todo.completed}>{todo.title}</TodoText>
              </TodoItemContainer>
            )
          }

          export default TodoItem
        `,
        'src/api/mockApi.js': `
          // Mock API functions that return promises with fake data

          // Simulate network delay
          const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

          export const fetchTodos = async () => {
            await delay(600)
            return [
              { id: 1, title: 'Learn React Query', completed: true },
              { id: 2, title: 'Build a todo app', completed: false },
              { id: 3, title: 'Style with Emotion', completed: true },
              { id: 4, title: 'Deploy to production', completed: false },
            ]
          }

          export const updateTodo = async (todo) => {
            await delay(300)
            console.log('Todo updated:', todo)
            return todo
          }
        `,
      },
    },
    { preserveFiles: true }
  );

  it('detects vite build tool', async () => {
    expect(result.bundler.name).toBe('vite');
    expect(result.bundler.confidence).toBeGreaterThanOrEqual(1);
    expect(
      result.bundler.secondaryMatches.rollup?.confidence
    ).toBeGreaterThanOrEqual(0.5);
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

  it('detects react-query state management library', async () => {
    expect(result.stateManagement.name).toBe('tanstackQuery');
    expect(result.stateManagement.confidence).toBeGreaterThanOrEqual(0.9);
    expect(result.stateManagement.secondaryMatches).toEqual({});
  });
});
