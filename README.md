# unbuilt.app

An open-source web tool that displays "unbuilt" websites to reveal their tech stack in real-time. Takes seconds to analyze bundled and minfied codebase and to detect modern and legacy technologies by url.

**🚀 Live at: [https://unbuilt.app](https://unbuilt.app)**

> ⚠️ **Beta Status**: The application is currently in beta. We're actively improving detection patterns based on usage data, stability and any issues.

## What is unbuilt.app?

unbuilt.app is a reverse engineering tool for the modern web. While developers build applications with various frameworks and libraries, we help to see it  **unbuilt** and reveal what's under the hood in real-time.

- **100% Open Source** - Anyone can contribute new detection patterns to identify additional frameworks, libraries, and tools
- **Completely Free** - No premium plans or usage limits. I'm making it for fun, not for profit
- **Modern Real-time Detection** - Identifies cutting-edge technologies like Vite, Turbopack, Next.js, SWC, React Compiler, Server Actions, and more
- **Lightning Fast** - Analysis takes just seconds to complete
- **Queue-Based Architecture** - Ensures stability even under heavy load
- **Extensible by Design** - Built with clear pattern APIs for easy contributions
- **Tested** - We are testing most of technologies (every soon) to ensure accuracy, false positive patterns absence and detection performance.
- **Fast and Cachable** - Uses cache to get unfinished analysis results or recent ones.

## Detection Categories

On the current stage, unbuilt.app deconstructs websites to reveal technologies across these categories:

- **Bundlers** - Webpack, Vite, Rollup, Parcel, etc.
- **UI Libraries** - React, Vue, Angular, Svelte, etc.
- **Frameworks** - Next.js, Vitepress, Nuxt.js, Storybook, Remix, etc.
- **Minifiers** - Terser, UglifyJS, etc.
- **Styling Processors** - Sass, Less, PostCSS, etc.
- **Module Systems** - CommonJS, ES Modules, AMD, etc.
- **UI Libraries** - Material UI, Chakra UI, Tailwind, etc.
- **State Management** - Redux, MobX, Zustand, etc.
- **HTTP Clients** - Axios, Fetch, SuperAgent, etc.
- **Routers** - React Router, Vue Router, Next.js internal router, etc.
- **Translation Libraries** - i18next, react-intl, etc.
- **Date Libraries** - Moment.js, date-fns, Luxon, etc.
- **Styling Libraries** - TailwindCSS, MUI, Lucide, shadcn/ui, etc.
- **Transpilers** - Babel, SWC, TypeScript, etc.
- **Platforms** - Wix, Weebly, Webflow, Squarespace, Shopify, etc.
- **Unbuilt Resources** - Js/CSS/HTML files, DOM elements, etc.
- Much more categories in the future. With open-source approach, I hope to have more patterns to cover.

> The list of supported technologies within each category is continuously expanding.

## Tech Stack

unbuilt.app itself is built with:

- Next.js for web application and analyzer backend service
- React for web interface
- Turbopack as a build tool...
- 🥱 Ok, why to list everything here, when you can check it on [unbuilt unbuilt.app](https://unbuilt.app/analysis/a9abcd3b-aac0-4c96-a835-7d7756594916)!

> Yes, we've unbuilt ourselves too! We practice what we preach.

## Repository Structure

The project is organized as a monorepo using Turborepo with the following structure:

```
unbuild.app/
├── apps/
│   └── web/           # Next.js application + unbuilding service
│
├── packages/
│   ├── analyzer/      # Core analysis engine
│   ├── features/      # Technology detection patterns
│   ├── helpers/       # Browser and CLI interaction utilities
│   ├── resources/     # Resource collection entities
│   └── testing/       # Testing utilities
```

## Contributing / Running Locally

We welcome contributions from the community! Help us see the web unbuilt together by checking out our [CONTRIBUTING.md](CONTRIBUTING.md) guide for detailed information on:

- Creating Issues (RFCs)
- Pull Request process
- Feature Pattern API
- Testing your contributions

Your help makes unbuilt.app better for everyone!

## Coming Soon

- Browser Extension - Unbuild any site as you browse
- CLI Application - Unbuild from your terminal
- Additional Detection Categories - Expand our unbuilding capabilities


## Contact
- [Artem Yavorskyi](https://yavorsky.org)

We'll add more contact information as the project evolves.

## License

This project is licensed under the [MIT License](LICENSE) - see the LICENSE file for details.