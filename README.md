# unbuilt.app

An open-source web tool that displays "unbuilt" websites to reveal their tech stack in real-time. Takes seconds to analyze bundled and minified code to detect modern and legacy technologies by URL.

**🚀 Live at: [https://unbuilt.app](https://unbuilt.app)**

> ⚠️ **Beta Status**: The application is currently in beta. We're actively improving detection patterns based on usage data, stability and any issues.

## What is unbuilt.app?

unbuilt.app is a reverse engineering tool for the modern web. While developers build applications with various frameworks and libraries, we help to see it **unbuilt** and reveal what's under the hood in real-time.

## Why Choose Unbuilt?

- **Real-Time Code Analysis** - Unlike alternative tools that use static signatures, we deconstruct websites in real-time. It allows to have analysis for any web application and latest available technologies.
- **100% Open Source** - Every pattern is transparent and community-driven, unlike closed-source alternatives
- **Completely Free** - No premium plans, usage limits, or restricted features that plague other tools
- **Lightning Fast** - Analysis takes just seconds instead of minutes with competing solutions
- **Modern Tech Focus** - Specialized in detecting cutting-edge frameworks and tools that other analyzers miss
- **Evidence-Based Results** - We only report technologies with verifiable code evidence, not guesswork
- **Queue-Based Architecture** - Ensures stability even under heavy load
- **Intelligent Caching** - Immediate results for previously analyzed sites with ability to get fresh analysis any time
- **Community-Driven** - Patterns are continuously improved by developers like you
- **Can Run Local Analysis** - Run complete website analysis via CLI tool without sending data to external servers (and browser extension coming soon)

## How We Compare

| Feature                | Unbuilt                                          | Other Alternatives |
|------------------------|--------------------------------------------------|--------------------|
| Detection Method       | Real-time code execution with pattern-based detection | Primarily pattern-based detection |
| Data Relevance         | Fresh analysis can be triggered any time         | Often rely on pre-saved data or hardcoded values from user reports |
| Source Code            | 100% open-source                                 | Mix of open and closed source solutions |
| Price                  | Completely free, no usage limits                 | Often freemium with paid tiers for advanced features |
| Community Contribution | Direct pattern contributions encouraged          | Typically limited to issue reporting |
| Modern Tech Focus      | Specialized in detecting cutting-edge frameworks | Varies, often slower to detect newest technologies |
| Detection Transparency | Clear evidence for each detected technology      | Often limited visibility into detection reasoning |
| Analysis Speed         | Results typically in under 10 seconds            | Varies by tool and website complexity |
| Local Analysis         | Comprehensive CLI tool with full capabilities    | Available in some tools with varying capabilities |

## Detection Categories

unbuilt.app deconstructs websites to reveal technologies across these categories:

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
- **Analytics** - Google Analytics, Mixpanel, Umami, Microsoft Clarity, etc.
- **Styling Libraries** - TailwindCSS, MUI, Lucide, shadcn/ui, etc.
- **Transpilers** - Babel, SWC, TypeScript, etc.
- **Platforms** - Wix, Weebly, Webflow, Squarespace, Shopify, etc.
- **Unbuilt Resources** - Js/CSS/HTML files, DOM elements, etc.

> The list of supported technologies within each category is continuously expanding.

## Unbuilt Ecosystem

Analyze web technologies across multiple platforms:

- **Web Application** - Quick analysis via browser at [unbuilt.app](https://unbuilt.app)
- **CLI Tool** - Analyze sites directly from your terminal
- **Coming Soon: Browser Extension** - Analyze sites as you browse, even behind authentication

### CLI Tool Installation

```bash
npm install -g @unbuilt/cli
```

### CLI Usage

```bash
unbuilt <url>
```

Check more details in the [CLI documentation](./apps/cli/README.md).

## Tech Stack

Why list everything here when you can check it on [unbuilt unbuilt.app](https://unbuilt.app/analysis/f280c84c-3168-46c3-ae2d-becfd002e7fd)!

> Yes, we've unbuilt ourselves too! We practice what we preach.

## Contributing / Running Locally

We welcome contributions from the community! Help us see the web unbuilt together by checking out our [CONTRIBUTING.md](CONTRIBUTING.md) guide for detailed information on:

- Creating Issues (RFCs)
- Pull Request process
- Feature Pattern API
- Testing your contributions

Your help makes unbuilt.app better for everyone!

## Coming Soon

- Browser Extension - Unbuild any site as you browse
- Additional Detection Categories - Expand our unbuilding capabilities
- Technology Versions - Detect major or even minor/patch versions of specific technologies

## Contact
- [Artem Yavorskyi](https://yavorsky.org)

We'll add more contact information as the project evolves.

## License

This project is licensed under the [MIT License](LICENSE) - see the LICENSE file for details.