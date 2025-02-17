// testing/e2e/tests/esbuild-jquery.test.ts
import { describe, expect, it } from 'vitest';
import { analyzeVirtualApp } from '../../testkits/virtual/index.js';

describe('detects esbuild with jquery, superagent and mobx', async () => {
  const result = await analyzeVirtualApp(
    {
      outDir: 'dist',
      buildCommand:
        'mkdir -p dist && cp index.html dist/ && esbuild src/index.js src/vendors.js --bundle --outdir=dist --minify',
      dependencies: {
        esbuild: 'latest',
        jquery: 'latest',
        superagent: 'latest',
        mobx: 'latest',
      },
      files: {
        'src/vendors.js': `
        export { default as $ } from 'jquery';
        export { default as request } from 'superagent';
        export { makeAutoObservable, runInAction } from 'mobx';
      `,

        'src/index.js': `
        import { $, request, makeAutoObservable, runInAction } from './vendors.js';

        class TodoStore {
          todos = [];
          isLoading = false;
          error = null;

          constructor() {
            makeAutoObservable(this);
          }

          async fetchTodos() {
            this.isLoading = true;
            this.error = null;

            try {
              const response = await request
                .get('https://api.example.com/todos')
                .set('Accept', 'application/json');

              runInAction(() => {
                this.todos = response.body;
                this.isLoading = false;
              });
            } catch (error) {
              runInAction(() => {
                this.error = error.message;
                this.isLoading = false;
              });
            }
          }

          addTodo(title) {
            this.todos.push({ id: Date.now(), title, completed: false });
          }

          toggleTodo(id) {
            const todo = this.todos.find(t => t.id === id);
            if (todo) {
              todo.completed = !todo.completed;
            }
          }
        }

        const store = new TodoStore();

        // jQuery DOM manipulation
        $(() => {
          const $list = $('#todo-list');
          const $input = $('#todo-input');
          const $addButton = $('#add-todo');
          const $fetchButton = $('#fetch-todos');
          const $status = $('#status');

          function renderTodos() {
            $list.empty();
            store.todos.forEach(todo => {
              $list.append(\`
                <li data-id="\${todo.id}" class="\${todo.completed ? 'completed' : ''}">
                  \${todo.title}
                  <button class="toggle">Toggle</button>
                </li>
              \`);
            });
          }

          $addButton.on('click', () => {
            const title = $input.val().trim();
            if (title) {
              store.addTodo(title);
              $input.val('');
              renderTodos();
            }
          });

          $list.on('click', '.toggle', function() {
            const id = $(this).parent().data('id');
            store.toggleTodo(id);
            renderTodos();
          });

          $fetchButton.on('click', async () => {
            $status.text('Loading...');
            await store.fetchTodos();
            $status.text(store.error || '');
            renderTodos();
          });

          // Additional jQuery and Superagent patterns
          $.ajax({
            url: '/api/test',
            method: 'POST',
            data: { test: true }
          });

          request
            .post('/api/items')
            .send({ name: 'test' })
            .set('X-API-Key', 'foobar')
            .end((err, res) => {
              if (res) console.log(res.body);
            });
        });
      `,

        'index.html': `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <title>Todo App</title>
          </head>
          <body>
            <div id="app">
              <input type="text" id="todo-input" placeholder="New todo">
              <button id="add-todo">Add</button>
              <button id="fetch-todos">Fetch</button>
              <div id="status"></div>
              <ul id="todo-list"></ul>
            </div>
            <script type="module" src="vendors.js"></script>
            <script type="module" src="index.js"></script>
          </body>
        </html>
      `,
      },
    },
    { preserveFiles: true }
  );

  it('detects esbuild bundler', async () => {
    expect(result.bundler.name).toBe('esbuild');
    expect(result.bundler.confidence).toBeGreaterThanOrEqual(1);
  });

  it('detects jquery ui library', async () => {
    expect(result.uiLibrary.name).toBe('jQuery');
    expect(result.uiLibrary.confidence).toBeGreaterThanOrEqual(1);
  });

  it('detects superagent http client', async () => {
    expect(result.httpClient.name).toBe('superagent');
    expect(result.httpClient.confidence).toBeGreaterThanOrEqual(1);
  });

  it('detects mobx state management', async () => {
    expect(result.stateManagement.name).toBe('mobx');
    expect(result.stateManagement.confidence).toBeGreaterThanOrEqual(1);
  });

  it('detects amd modules', async () => {
    expect(result.modules.name).toBe('amd');
    expect(result.modules.confidence).toBeGreaterThanOrEqual(1);
  });
});
