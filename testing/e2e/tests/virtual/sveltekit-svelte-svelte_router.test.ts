import { describe, expect, it } from 'vitest';
import { analyzeVirtualApp } from '../../testkits/virtual/index.js';
import { getPort } from '../../testkits/virtual/get-port.js';

describe('detects sveltekit with svelte and routing', async () => {
  const port = await getPort();

  const result = await analyzeVirtualApp(
    {
      outDir: '.svelte-kit',
      buildCommand: 'vite build',
      startCommand: 'vite preview',
      port,
      env: {
        SVELTEKIT_DEBUG: 'true',
      },
      dependencies: {
        '@sveltejs/adapter-auto': '^3.0.0',
        '@sveltejs/kit': '^2.0.0',
        '@sveltejs/vite-plugin-svelte': '^3.0.0',
        svelte: '^4.2.7',
        vite: '^5.0.3',
      },
      packageJson: {
        private: true,
        type: 'module',
      },
      files: {
        'svelte.config.js': `
          import adapter from '@sveltejs/adapter-auto';
          import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

          /** @type {import('@sveltejs/kit').Config} */
          const config = {
            // Consult https://kit.svelte.dev/docs/integrations#preprocessors
            // for more information about preprocessors
            preprocess: vitePreprocess(),

            kit: {
              // adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
              // If your environment is not supported, or you settled on a specific environment, switch out the adapter.
              // See https://kit.svelte.dev/docs/adapters for more information about adapters.
              adapter: adapter()
            }
          };

          export default config;
        `,
        'vite.config.js': `
          import { defineConfig } from 'vite';
          import { sveltekit } from '@sveltejs/kit/vite';

          export default defineConfig({
            preview: {
              port: ${port},
            },
            server: {
              port: ${port},
            },
            plugins: [sveltekit()]
          });
        `,
        'src/app.html': `
          <!DOCTYPE html>
          <html lang="en">
            <head>
              <meta charset="utf-8" />
              <link rel="icon" href="%sveltekit.assets%/favicon.png" />
              <meta name="viewport" content="width=device-width, initial-scale=1" />
              %sveltekit.head%
            </head>
            <body data-sveltekit-preload-data="hover">
              <div style="display: contents">%sveltekit.body%</div>
            </body>
          </html>
        `,
        'src/routes/+layout.svelte': `
          <script>
            import { page } from '$app/stores';
            import { base } from '$app/paths';
          </script>

          <nav>
            <div class="nav-container">
              <a href="{base}/" class="home" class:active={$page.url.pathname === '/'}>Home</a>
              <a href="{base}/about" class:active={$page.url.pathname === '/about'}>About</a>
              <a href="{base}/contact" class:active={$page.url.pathname === '/contact'}>Contact</a>
              <a href="{base}/blog" class:active={$page.url.pathname.startsWith('/blog')}>Blog</a>
            </div>
          </nav>

          <main>
            <slot />
          </main>

          <footer>
            <p>© 2025 SvelteKit Demo</p>
          </footer>

          <style>
            nav {
              background-color: #ff3e00;
              padding: 1rem;
            }

            .nav-container {
              max-width: 1200px;
              margin: 0 auto;
              display: flex;
              gap: 1rem;
            }

            a {
              color: white;
              text-decoration: none;
              padding: 0.5rem 1rem;
              border-radius: 4px;
              transition: background-color 0.2s;
            }

            a:hover {
              background-color: rgba(255, 255, 255, 0.1);
            }

            a.active {
              background-color: rgba(255, 255, 255, 0.2);
              font-weight: bold;
            }

            main {
              max-width: 1200px;
              margin: 2rem auto;
              padding: 0 1rem;
            }

            footer {
              text-align: center;
              padding: 2rem;
              color: #888;
            }
          </style>
        `,
        'src/routes/+layout.js': `
          export const prerender = true;
          export const ssr = true;

          export const load = ({ url }) => {
            return {
              currentPath: url.pathname
            };
          };
        `,
        'src/routes/+page.svelte': `
          <script>
            import { fly } from 'svelte/transition';
            import Counter from '../components/Counter.svelte';
          </script>

          <svelte:head>
            <title>Home | SvelteKit Demo</title>
          </svelte:head>

          <div class="container" in:fly={{ y: 20, duration: 500 }}>
            <h1>Welcome to SvelteKit</h1>

            <p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

            <div class="counter-container">
              <Counter />
            </div>

            <div class="grid">
              <a href="/about" class="card">
                <h2>About →</h2>
                <p>Learn more about our company and mission.</p>
              </a>

              <a href="/contact" class="card">
                <h2>Contact →</h2>
                <p>Get in touch with our team.</p>
              </a>

              <a href="/blog" class="card">
                <h2>Blog →</h2>
                <p>Read our latest articles and updates.</p>
              </a>
            </div>
          </div>

          <style>
            .container {
              text-align: center;
              padding: 2rem 0;
            }

            h1 {
              color: #ff3e00;
              font-size: 3rem;
              margin-bottom: 1rem;
            }

            p {
              margin-bottom: 2rem;
            }

            .counter-container {
              margin: 2rem 0;
            }

            .grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
              gap: 1.5rem;
              margin-top: 2rem;
            }

            .card {
              border: 1px solid #eaeaea;
              border-radius: 10px;
              padding: 1.5rem;
              text-align: left;
              text-decoration: none;
              color: inherit;
              transition: color 0.15s ease, border-color 0.15s ease;
            }

            .card:hover,
            .card:focus,
            .card:active {
              color: #ff3e00;
              border-color: #ff3e00;
            }
          </style>
        `,
        'src/routes/about/+page.svelte': `
          <script>
            import { fade } from 'svelte/transition';
          </script>

          <svelte:head>
            <title>About | SvelteKit Demo</title>
          </svelte:head>

          <div class="about-page" in:fade={{ duration: 300 }}>
            <h1>About Us</h1>

            <p>This is a demo application to showcase SvelteKit's capabilities.</p>

            <div class="features">
              <div class="feature">
                <h2>Fast</h2>
                <p>SvelteKit builds optimized, fast-loading applications.</p>
              </div>

              <div class="feature">
                <h2>Simple</h2>
                <p>Developer-friendly with an intuitive file-based routing system.</p>
              </div>

              <div class="feature">
                <h2>Powerful</h2>
                <p>Full-featured framework with SSR, CSR, and more.</p>
              </div>
            </div>
          </div>

          <style>
            .about-page {
              max-width: 800px;
              margin: 0 auto;
            }

            h1 {
              color: #ff3e00;
              margin-bottom: 1rem;
            }

            p {
              margin-bottom: 2rem;
            }

            .features {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
              gap: 2rem;
              margin-top: 2rem;
            }

            .feature {
              padding: 1.5rem;
              border-radius: 8px;
              background-color: #f9f9f9;
            }

            .feature h2 {
              color: #ff3e00;
              margin-bottom: 0.5rem;
            }
          </style>
        `,
        'src/routes/contact/+page.svelte': `
          <script>
            import { slide } from 'svelte/transition';
            let name = '';
            let email = '';
            let message = '';
            let submitted = false;

            function handleSubmit() {
              // In a real app, you would send this data to a server
              console.log({ name, email, message });
              submitted = true;
            }
          </script>

          <svelte:head>
            <title>Contact | SvelteKit Demo</title>
          </svelte:head>

          <div class="contact-page" in:slide={{ duration: 300 }}>
            <h1>Contact Us</h1>

            {#if !submitted}
              <form on:submit|preventDefault={handleSubmit}>
                <div class="form-group">
                  <label for="name">Name</label>
                  <input
                    id="name"
                    type="text"
                    bind:value={name}
                    required
                  />
                </div>

                <div class="form-group">
                  <label for="email">Email</label>
                  <input
                    id="email"
                    type="email"
                    bind:value={email}
                    required
                  />
                </div>

                <div class="form-group">
                  <label for="message">Message</label>
                  <textarea
                    id="message"
                    bind:value={message}
                    rows="5"
                    required
                  ></textarea>
                </div>

                <button type="submit">Send Message</button>
              </form>
            {:else}
              <div class="success-message">
                <h2>Thank you for your message!</h2>
                <p>We'll get back to you soon.</p>
                <button on:click={() => submitted = false}>Send Another Message</button>
              </div>
            {/if}
          </div>

          <style>
            .contact-page {
              max-width: 600px;
              margin: 0 auto;
            }

            h1 {
              color: #ff3e00;
              margin-bottom: 1.5rem;
            }

            .form-group {
              margin-bottom: 1.5rem;
            }

            label {
              display: block;
              margin-bottom: 0.5rem;
              font-weight: bold;
            }

            input, textarea {
              width: 100%;
              padding: 0.75rem;
              border: 1px solid #ddd;
              border-radius: 4px;
              font-size: 1rem;
              font-family: inherit;
            }

            button {
              background-color: #ff3e00;
              color: white;
              border: none;
              border-radius: 4px;
              padding: 0.75rem 1.5rem;
              font-size: 1rem;
              cursor: pointer;
              transition: background-color 0.2s;
            }

            button:hover {
              background-color: #e53700;
            }

            .success-message {
              text-align: center;
              padding: 2rem;
              background-color: #f5f5f5;
              border-radius: 8px;
            }

            .success-message h2 {
              color: #4caf50;
              margin-bottom: 1rem;
            }

            .success-message button {
              margin-top: 1.5rem;
            }
          </style>
        `,
        'src/routes/blog/+page.svelte': `
          <script>
            import { scale } from 'svelte/transition';

            // Simulating blog posts data
            const posts = [
              {
                id: 1,
                title: 'Getting Started with SvelteKit',
                excerpt: 'Learn how to set up your first SvelteKit project and explore its features.',
                date: '2025-01-15',
                slug: 'getting-started-with-sveltekit'
              },
              {
                id: 2,
                title: 'Understanding Svelte Routing',
                excerpt: 'A deep dive into the file-based routing system in SvelteKit.',
                date: '2025-02-02',
                slug: 'understanding-svelte-routing'
              },
              {
                id: 3,
                title: 'Working with Svelte Stores',
                excerpt: 'Learn how to manage state globally in your Svelte applications.',
                date: '2025-02-18',
                slug: 'working-with-svelte-stores'
              }
            ];
          </script>

          <svelte:head>
            <title>Blog | SvelteKit Demo</title>
          </svelte:head>

          <div class="blog-page" in:scale={{ duration: 300, start: 0.9 }}>
            <h1>Blog</h1>

            <div class="posts">
              {#each posts as post}
                <a href="/blog/{post.slug}" class="post">
                  <h2>{post.title}</h2>
                  <div class="meta">Published on {post.date}</div>
                  <p>{post.excerpt}</p>
                  <span class="read-more">Read more →</span>
                </a>
              {/each}
            </div>
          </div>

          <style>
            .blog-page {
              max-width: 800px;
              margin: 0 auto;
            }

            h1 {
              color: #ff3e00;
              margin-bottom: 2rem;
            }

            .posts {
              display: flex;
              flex-direction: column;
              gap: 2rem;
            }

            .post {
              padding: 1.5rem;
              border: 1px solid #eaeaea;
              border-radius: 8px;
              text-decoration: none;
              color: inherit;
              transition: transform 0.2s, box-shadow 0.2s;
            }

            .post:hover {
              transform: translateY(-5px);
              box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
            }

            .post h2 {
              color: #333;
              margin-bottom: 0.5rem;
            }

            .meta {
              color: #888;
              font-size: 0.875rem;
              margin-bottom: 1rem;
            }

            .read-more {
              display: inline-block;
              margin-top: 1rem;
              color: #ff3e00;
              font-weight: bold;
            }
          </style>
        `,
        'src/routes/blog/[slug]/+page.svelte': `
          <script>
            import { page } from '$app/stores';
            import { fade } from 'svelte/transition';

            // Simulating blog post data
            const posts = {
              'getting-started-with-sveltekit': {
                title: 'Getting Started with SvelteKit',
                date: '2025-01-15',
                content: \`
                  <p>SvelteKit is a framework for building web applications of all sizes, with a beautiful development experience and flexible filesystem-based routing.</p>

                  <p>Unlike single-page apps, SvelteKit doesn't compromise on SEO, progressive enhancement or the initial load experience — but unlike traditional server-rendered apps, navigation is instantaneous for that app-like feel.</p>

                  <h2>Installation</h2>

                  <p>To create a new project, run the following commands:</p>

                  <pre><code>npm create svelte@latest my-app
                  cd my-app
                  npm install
                  npm run dev</code></pre>

                  <p>This will scaffold a new project, install its dependencies, and start a development server on port 5173.</p>
                \`
              },
              'understanding-svelte-routing': {
                title: 'Understanding Svelte Routing',
                date: '2025-02-02',
                content: \`
                  <p>SvelteKit uses a file-based router, which means that the structure of your app is defined by the structure of your codebase.</p>

                  <h2>File-based Routing</h2>

                  <p>Routes are defined by creating directories and files in the <code>src/routes</code> directory of your project:</p>

                  <ul>
                    <li><code>src/routes/+page.svelte</code> - The home page</li>
                    <li><code>src/routes/about/+page.svelte</code> - The /about page</li>
                    <li><code>src/routes/blog/+page.svelte</code> - The /blog page</li>
                    <li><code>src/routes/blog/[slug]/+page.svelte</code> - The template for individual blog posts</li>
                  </ul>

                  <p>Dynamic parameters are indicated with brackets, like <code>[slug]</code>.</p>

                  <h2>Layouts</h2>

                  <p>You can define layouts using <code>+layout.svelte</code> files, which will wrap all pages in that directory and its subdirectories.</p>
                \`
              },
              'working-with-svelte-stores': {
                title: 'Working with Svelte Stores',
                date: '2025-02-18',
                content: \`
                  <p>Svelte comes with built-in store management that's lightweight yet powerful.</p>

                  <h2>What are Svelte stores?</h2>

                  <p>A store is simply an object with a <code>subscribe</code> method that allows interested parties to be notified whenever the store value changes.</p>

                  <h2>Writable stores</h2>

                  <p>The simplest type of store is the writable store, which can be created using the writable function from svelte/store:</p>

                  <pre><code>import { writable } from 'svelte/store';

                  const count = writable(0);</code></pre>

                  <p>You can then update the store using <code>set</code> and <code>update</code> methods:</p>

                  <pre><code>count.set(1);
                  count.update(n => n + 1);</code></pre>

                  <p>In a component, you can subscribe to the store and use its value:</p>

                  <pre><code>&lt;script&gt;
                    import { count } from './stores';
                    import { onDestroy } from 'svelte';

                    let value;

                    const unsubscribe = count.subscribe(n => {
                      value = n;
                    });

                    onDestroy(unsubscribe);
                  &lt;/script&gt;</code></pre>

                  <p>Or, more conveniently, with the auto-subscription syntax:</p>

                  <pre><code>&lt;script&gt;
                    import { count } from './stores';
                  &lt;/script&gt;

                  Count: {$count}</code></pre>
                \`
              }
            };

            // Get the current slug from the URL
            $: slug = $page.params.slug;
            $: post = posts[slug];
          </script>

          <svelte:head>
            {#if post}
              <title>{post.title} | SvelteKit Demo</title>
            {:else}
              <title>Post Not Found | SvelteKit Demo</title>
            {/if}
          </svelte:head>

          <div class="post-page" in:fade={{ duration: 300 }}>
            {#if post}
              <div class="post-header">
                <a href="/blog" class="back-link">← Back to blog</a>
                <h1>{post.title}</h1>
                <div class="meta">Published on {post.date}</div>
              </div>

              <div class="post-content">
                {@html post.content}
              </div>
            {:else}
              <div class="not-found">
                <h1>Post Not Found</h1>
                <p>Sorry, the post you're looking for doesn't exist.</p>
                <a href="/blog" class="back-link">← Back to blog</a>
              </div>
            {/if}
          </div>

          <style>
            .post-page {
              max-width: 800px;
              margin: 0 auto;
            }

            .post-header {
              margin-bottom: 2rem;
            }

            .back-link {
              display: inline-block;
              margin-bottom: 1rem;
              color: #666;
              text-decoration: none;
            }

            .back-link:hover {
              color: #ff3e00;
            }

            h1 {
              color: #333;
              margin-bottom: 0.5rem;
            }

            .meta {
              color: #888;
              font-size: 0.875rem;
            }

            .post-content {
              line-height: 1.6;
            }

            .post-content h2 {
              color: #ff3e00;
              margin: 2rem 0 1rem 0;
            }

            .post-content p {
              margin-bottom: 1rem;
            }

            .post-content pre {
              background-color: #f5f5f5;
              padding: 1rem;
              border-radius: 4px;
              overflow-x: auto;
              margin-bottom: 1.5rem;
            }

            .post-content ul {
              margin-bottom: 1.5rem;
              padding-left: 1.5rem;
            }

            .post-content li {
              margin-bottom: 0.5rem;
            }

            .not-found {
              text-align: center;
              padding: 3rem 0;
            }

            .not-found h1 {
              color: #ff3e00;
            }

            .not-found .back-link {
              display: block;
              margin-top: 1.5rem;
            }
          </style>
        `,
        'src/components/Counter.svelte': `
          <script>
            import { spring } from 'svelte/motion';

            let count = 0;

            // Create a spring for the count value
            const displayed_count = spring();

            // Update the spring whenever count changes
            $: displayed_count.set(count);

            function incrementCount() {
              count += 1;
            }

            function decrementCount() {
              count -= 1;
            }

            function resetCount() {
              count = 0;
            }
          </script>

          <div class="counter">
            <h2>Counter Component</h2>

            <div class="counter-value">{$displayed_count.toFixed(0)}</div>

            <div class="counter-buttons">
              <button on:click={decrementCount}>-</button>
              <button on:click={resetCount}>Reset</button>
              <button on:click={incrementCount}>+</button>
            </div>
          </div>

          <style>
            .counter {
              background-color: #f9f9f9;
              border-radius: 8px;
              padding: 1.5rem;
              display: inline-block;
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            }

            h2 {
              color: #ff3e00;
              margin-top: 0;
              margin-bottom: 1rem;
              font-size: 1.25rem;
            }

            .counter-value {
              font-size: 3rem;
              font-weight: bold;
              color: #333;
              margin: 1rem 0;
            }

            .counter-buttons {
              display: flex;
              gap: 0.5rem;
              justify-content: center;
            }

            button {
              background-color: #ff3e00;
              color: white;
              border: none;
              border-radius: 4px;
              padding: 0.5rem 1rem;
              font-size: 1rem;
              cursor: pointer;
              transition: background-color 0.2s;
            }

            button:hover {
              background-color: #e53700;
            }

            button:nth-child(2) {
              background-color: #666;
            }

            button:nth-child(2):hover {
              background-color: #555;
            }
          </style>
        `,
        'src/app.d.ts': `
          // See https://kit.svelte.dev/docs/types#app
          // for information about these interfaces
          declare global {
            namespace App {
              // interface Error {}
              // interface Locals {}
              // interface PageData {}
              // interface Platform {}
            }
          }

          export {};
        `,
        '.npmrc': `
          type=module
        `,
        'static/favicon.png': `/* Binary PNG content would go here */`,
      },
    },
    { preserveFiles: true }
  );

  it('detects sveltekit framework', async () => {
    expect(result.framework.name).toBe('sveltekit');
    expect(result.framework.confidence).toBeGreaterThanOrEqual(0.9);
    expect(result.framework.secondaryMatches).toEqual({});
  });

  it('detects svelte ui library', async () => {
    expect(result.uiLibrary.name).toBe('svelte');
    expect(result.uiLibrary.confidence).toBeGreaterThanOrEqual(1);
    expect(result.uiLibrary.secondaryMatches).toEqual({});
  });

  it('detects svelte routing', async () => {
    expect(result.router.name).toBe('svelteRouter');
    expect(result.router.confidence).toBeGreaterThanOrEqual(0.9);
    expect(result.router.secondaryMatches).toEqual({});
  });
});
