import { describe, expect, it } from 'vitest';
import { analyzeVirtualApp } from '../../testkits/virtual/index.js';

describe('detects next.js with react, tailwind, shadcn/ui and direct radix usage', async () => {
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
        tailwindcss: '3.4.1',
        'tailwindcss-animate': '1.0.7',
        postcss: '8.4.32',
        autoprefixer: '10.4.16',
        'class-variance-authority': '0.7.0',
        clsx: '2.0.0',
        'tailwind-merge': '2.1.0',
        'lucide-react': '0.469.0',
        '@radix-ui/react-dialog': '1.1.6',
        '@radix-ui/react-slot': '1.1.2',
        '@radix-ui/react-dropdown-menu': '2.1.6',
        '@radix-ui/react-toggle': '1.1.2',
        '@radix-ui/react-tooltip': '1.1.8',
        '@radix-ui/react-avatar': '1.1.3',
      },
      files: {
        'tailwind.config.js': `
          /** @type {import('tailwindcss').Config} */
          module.exports = {
            darkMode: ["class"],
            content: [
              './pages/**/*.{ts,tsx}',
              './components/**/*.{ts,tsx}',
              './app/**/*.{ts,tsx}',
              './src/**/*.{ts,tsx}',
            ],
            theme: {
              container: {
                center: true,
                padding: "2rem",
                screens: {
                  "2xl": "1400px",
                },
              },
              extend: {
                colors: {
                  border: "hsl(var(--border))",
                  input: "hsl(var(--input))",
                  ring: "hsl(var(--ring))",
                  background: "hsl(var(--background))",
                  foreground: "hsl(var(--foreground))",
                  primary: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                  },
                  secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                  },
                  destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                  },
                  muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                  },
                  accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                  },
                  popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                  },
                  card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                  },
                },
                borderRadius: {
                  lg: "var(--radius)",
                  md: "calc(var(--radius) - 2px)",
                  sm: "calc(var(--radius) - 4px)",
                },
                keyframes: {
                  "accordion-down": {
                    from: { height: 0 },
                    to: { height: "var(--radix-accordion-content-height)" },
                  },
                  "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: 0 },
                  },
                },
                animation: {
                  "accordion-down": "accordion-down 0.2s ease-out",
                  "accordion-up": "accordion-up 0.2s ease-out",
                },
              },
            },
            plugins: [require("tailwindcss-animate")],
          }
        `,
        'postcss.config.js': `
          module.exports = {
            plugins: {
              tailwindcss: {},
              autoprefixer: {},
            },
          }
        `,
        'src/lib/utils.ts': `
          import { type ClassValue, clsx } from "clsx"
          import { twMerge } from "tailwind-merge"

          export function cn(...inputs: ClassValue[]) {
            return twMerge(clsx(inputs))
          }
        `,
        'src/components/ui/button.tsx': `
          import * as React from "react"
          import { Slot } from "@radix-ui/react-slot"
          import { cva, type VariantProps } from "class-variance-authority"

          import { cn } from "@/lib/utils"

          const buttonVariants = cva(
            "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
            {
              variants: {
                variant: {
                  default: "bg-primary text-primary-foreground hover:bg-primary/90",
                  destructive:
                    "bg-destructive text-destructive-foreground hover:bg-destructive/90",
                  outline:
                    "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
                  secondary:
                    "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                  ghost: "hover:bg-accent hover:text-accent-foreground",
                  link: "text-primary underline-offset-4 hover:underline",
                },
                size: {
                  default: "h-10 px-4 py-2",
                  sm: "h-9 rounded-md px-3",
                  lg: "h-11 rounded-md px-8",
                  icon: "h-10 w-10",
                },
              },
              defaultVariants: {
                variant: "default",
                size: "default",
              },
            }
          )

          export interface ButtonProps
            extends React.ButtonHTMLAttributes<HTMLButtonElement>,
              VariantProps<typeof buttonVariants> {
            asChild?: boolean
          }

          const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
            ({ className, variant, size, asChild = false, ...props }, ref) => {
              const Comp = asChild ? Slot : "button"
              return (
                <Comp
                  className={cn(buttonVariants({ variant, size, className }))}
                  ref={ref}
                  {...props}
                />
              )
            }
          )
          Button.displayName = "Button"

          export { Button, buttonVariants }
        `,
        'src/components/ui/dialog.tsx': `
          import * as React from "react"
          import * as DialogPrimitive from "@radix-ui/react-dialog"
          import { X } from "lucide-react"

          import { cn } from "@/lib/utils"

          const Dialog = DialogPrimitive.Root

          const DialogTrigger = DialogPrimitive.Trigger

          const DialogPortal = DialogPrimitive.Portal

          const DialogClose = DialogPrimitive.Close

          const DialogOverlay = React.forwardRef<
            React.ElementRef<typeof DialogPrimitive.Overlay>,
            React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
          >(({ className, ...props }, ref) => (
            <DialogPrimitive.Overlay
              ref={ref}
              className={cn(
                "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
                className
              )}
              {...props}
            />
          ))
          DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

          const DialogContent = React.forwardRef<
            React.ElementRef<typeof DialogPrimitive.Content>,
            React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
          >(({ className, children, ...props }, ref) => (
            <DialogPortal>
              <DialogOverlay />
              <DialogPrimitive.Content
                ref={ref}
                className={cn(
                  "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
                  className
                )}
                {...props}
              >
                {children}
                <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close</span>
                </DialogPrimitive.Close>
              </DialogPrimitive.Content>
            </DialogPortal>
          ))
          DialogContent.displayName = DialogPrimitive.Content.displayName

          const DialogHeader = ({
            className,
            ...props
          }: React.HTMLAttributes<HTMLDivElement>) => (
            <div
              className={cn(
                "flex flex-col space-y-1.5 text-center sm:text-left",
                className
              )}
              {...props}
            />
          )
          DialogHeader.displayName = "DialogHeader"

          const DialogFooter = ({
            className,
            ...props
          }: React.HTMLAttributes<HTMLDivElement>) => (
            <div
              className={cn(
                "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
                className
              )}
              {...props}
            />
          )
          DialogFooter.displayName = "DialogFooter"

          const DialogTitle = React.forwardRef<
            React.ElementRef<typeof DialogPrimitive.Title>,
            React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
          >(({ className, ...props }, ref) => (
            <DialogPrimitive.Title
              ref={ref}
              className={cn(
                "text-lg font-semibold leading-none tracking-tight",
                className
              )}
              {...props}
            />
          ))
          DialogTitle.displayName = DialogPrimitive.Title.displayName

          const DialogDescription = React.forwardRef<
            React.ElementRef<typeof DialogPrimitive.Description>,
            React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
          >(({ className, ...props }, ref) => (
            <DialogPrimitive.Description
              ref={ref}
              className={cn("text-sm text-muted-foreground", className)}
              {...props}
            />
          ))
          DialogDescription.displayName = DialogPrimitive.Description.displayName

          export {
            Dialog,
            DialogPortal,
            DialogOverlay,
            DialogClose,
            DialogTrigger,
            DialogContent,
            DialogHeader,
            DialogFooter,
            DialogTitle,
            DialogDescription,
          }
        `,
        'src/components/DirectRadixToggle.tsx': `
          import React from 'react'
          import * as Toggle from '@radix-ui/react-toggle'
          import { Star } from 'lucide-react'
          import { cn } from '@/lib/utils'

          const DirectRadixToggle = () => {
            return (
              <Toggle.Root
                className={cn(
                  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors",
                  "data-[state=on]:bg-amber-500 data-[state=on]:text-white",
                  "hover:bg-amber-100 hover:text-amber-900",
                  "focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2",
                  "disabled:pointer-events-none disabled:opacity-50",
                  "h-10 px-3 py-2 bg-transparent border border-amber-300"
                )}
                aria-label="Toggle favorite"
              >
                <Star className="h-5 w-5" />
                <span className="ml-2">Favorite</span>
              </Toggle.Root>
            )
          }

          export default DirectRadixToggle
        `,
        'src/components/DirectRadixTooltip.tsx': `
          import React from 'react'
          import * as Tooltip from '@radix-ui/react-tooltip'
          import { Info } from 'lucide-react'

          const DirectRadixTooltip = () => {
            return (
              <Tooltip.Provider>
                <Tooltip.Root>
                  <Tooltip.Trigger asChild>
                    <button className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 text-blue-500 hover:bg-blue-200">
                      <Info className="h-4 w-4" />
                    </button>
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Content
                      className="data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade text-violet11 select-none rounded-md bg-white px-4 py-2.5 text-sm leading-none shadow-md will-change-[transform,opacity] border border-gray-200"
                      sideOffset={5}
                    >
                      Direct Radix UI Tooltip Component
                      <Tooltip.Arrow className="fill-white" />
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>
              </Tooltip.Provider>
            )
          }

          export default DirectRadixTooltip
        `,
        'src/components/DirectRadixAvatar.tsx': `
          import React from 'react'
          import * as Avatar from '@radix-ui/react-avatar'

          const DirectRadixAvatar = () => {
            return (
              <div className="flex gap-5">
                <Avatar.Root className="inline-flex items-center justify-center align-middle overflow-hidden select-none w-10 h-10 rounded-full bg-gray-100">
                  <Avatar.Image
                    className="h-full w-full object-cover"
                    src="https://github.com/radix-ui.png"
                    alt="Radix UI"
                  />
                  <Avatar.Fallback className="w-full h-full flex items-center justify-center bg-white text-gray-600 text-sm font-medium">
                    RX
                  </Avatar.Fallback>
                </Avatar.Root>
              </div>
            )
          }

          export default DirectRadixAvatar
        `,
        'src/app/globals.css': `
          @tailwind base;
          @tailwind components;
          @tailwind utilities;

          @layer base {
            :root {
              --background: 0 0% 100%;
              --foreground: 222.2 84% 4.9%;

              --card: 0 0% 100%;
              --card-foreground: 222.2 84% 4.9%;

              --popover: 0 0% 100%;
              --popover-foreground: 222.2 84% 4.9%;

              --primary: 222.2 47.4% 11.2%;
              --primary-foreground: 210 40% 98%;

              --secondary: 210 40% 96.1%;
              --secondary-foreground: 222.2 47.4% 11.2%;

              --muted: 210 40% 96.1%;
              --muted-foreground: 215.4 16.3% 46.9%;

              --accent: 210 40% 96.1%;
              --accent-foreground: 222.2 47.4% 11.2%;

              --destructive: 0 84.2% 60.2%;
              --destructive-foreground: 210 40% 98%;

              --border: 214.3 31.8% 91.4%;
              --input: 214.3 31.8% 91.4%;
              --ring: 222.2 84% 4.9%;

              --radius: 0.5rem;
            }

            .dark {
              --background: 222.2 84% 4.9%;
              --foreground: 210 40% 98%;

              --card: 222.2 84% 4.9%;
              --card-foreground: 210 40% 98%;

              --popover: 222.2 84% 4.9%;
              --popover-foreground: 210 40% 98%;

              --primary: 210 40% 98%;
              --primary-foreground: 222.2 47.4% 11.2%;

              --secondary: 217.2 32.6% 17.5%;
              --secondary-foreground: 210 40% 98%;

              --muted: 217.2 32.6% 17.5%;
              --muted-foreground: 215 20.2% 65.1%;

              --accent: 217.2 32.6% 17.5%;
              --accent-foreground: 210 40% 98%;

              --destructive: 0 62.8% 30.6%;
              --destructive-foreground: 210 40% 98%;

              --border: 217.2 32.6% 17.5%;
              --input: 217.2 32.6% 17.5%;
              --ring: 212.7 26.8% 83.9%;
            }
          }

          @layer base {
            * {
              @apply border-border;
            }
            body {
              @apply bg-background text-foreground;
            }
          }
        `,
        'src/app/layout.tsx': `
          import "./globals.css"
          import type { Metadata } from "next"
          import * as TooltipPrimitive from '@radix-ui/react-tooltip'

          export const metadata: Metadata = {
            title: "Next.js with Tailwind CSS, shadcn/ui and Radix UI",
            description: "A sample app for testing style detection",
          }

          export default function RootLayout({
            children,
          }: {
            children: React.ReactNode
          }) {
            return (
              <html lang="en">
                <body>
                  <TooltipPrimitive.Provider>
                    {children}
                  </TooltipPrimitive.Provider>
                </body>
              </html>
            )
          }
        `,
        'src/app/page.tsx': `
          'use client'

          import { useState } from "react"
          import { Landmark, Network, Moon, Sun } from "lucide-react";

          import { Button } from "@/components/ui/button"
          import {
            Dialog,
            DialogContent,
            DialogDescription,
            DialogFooter,
            DialogHeader,
            DialogTitle,
            DialogTrigger,
          } from "@/components/ui/dialog"
          import DirectRadixToggle from "@/components/DirectRadixToggle"
          import DirectRadixTooltip from "@/components/DirectRadixTooltip"
          import DirectRadixAvatar from "@/components/DirectRadixAvatar"

          export default function Home() {
            const [open, setOpen] = useState(false)

            return (
              <main className="flex min-h-screen flex-col items-center justify-center p-24">
                <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
                  <h1 className="text-4xl font-bold mb-6 text-center">
                    Next.js with Tailwind CSS, shadcn/ui and Radix UI
                  </h1>

                  <div className="bg-white/30 p-8 rounded-lg shadow-md backdrop-blur-sm">
                    <h2 className="text-2xl font-semibold mb-4">Style Detection Test</h2>
                    <p className="mb-6 text-gray-700">
                      This is a sample application to test the detection of Tailwind CSS, shadcn/ui components, and direct Radix UI usage.
                    </p>

                    <div className="flex space-x-4 mb-6">
                      <Landmark size={32} />
                      <Moon size={32} />
                      <Sun size={32} />
                    </div>

                    <div className="mb-8">
                      <h3 className="text-lg font-medium mb-3">Direct Radix UI Components</h3>
                      <div className="flex flex-wrap items-center gap-4">
                        <DirectRadixToggle />
                        <DirectRadixTooltip />
                        <DirectRadixAvatar />
                      </div>
                    </div>

                    <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0 mb-8">
                      <Button variant="default">Primary Button</Button>
                      <Button variant="secondary">Secondary Button</Button>
                      <Button variant="outline">Outline Button</Button>
                      <Button variant="destructive">Destructive Button</Button>

                      <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                          <Button variant="outline">Open Dialog</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>Example Dialog</DialogTitle>
                            <DialogDescription>
                              This is a shadcn/ui Dialog component built with Radix UI primitives.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="py-4">
                            <p className="text-sm text-gray-500">
                              This dialog demonstrates the usage of shadcn/ui components with Tailwind CSS styling.
                            </p>
                          </div>
                          <DialogFooter>
                            <Network size={22} />
                            <Button onClick={() => setOpen(false)}>Close</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-4 border rounded-md bg-gray-50">
                        <h3 className="font-medium mb-2">Tailwind Features</h3>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                          <li>Utility-first CSS</li>
                          <li>Responsive design with breakpoints</li>
                          <li>Custom color palette</li>
                          <li>Theme configuration</li>
                        </ul>
                      </div>
                      <div className="p-4 border rounded-md bg-gray-50">
                        <h3 className="font-medium mb-2">Component Features</h3>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                          <li>shadcn/ui components</li>
                          <li>Direct Radix UI primitives</li>
                          <li>Accessible components</li>
                          <li>Variant support with cva</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </main>
            )
          }
        `,
        'next.config.js': `
          /** @type {import('next').NextConfig} */
          const nextConfig = {
            webpack: (config, { isServer, webpack }) => {
              // Configure explicit bundle splitting
              config.optimization.splitChunks = {
                chunks: 'all',
                cacheGroups: {
                  // Radix UI components in their own bundle
                  radix: {
                    test: /[\\/]node_modules[\\/]@radix-ui[\\/]/,
                    name: 'radix',
                    priority: 20,
                    enforce: true,
                  },
                  // Lucide icons in their own bundle
                  lucide: {
                    test: /[\\/]node_modules[\\/]lucide-react[\\/]/,
                    name: 'lucide',
                    priority: 20,
                    enforce: true,
                  },
                  // All other third-party dependencies in a vendor bundle
                  vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendor',
                    priority: 10,
                    enforce: true,
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
            "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
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

  it('detects tailwind css', async () => {
    expect(result.stylingLibraries.items.tailwindCSS).toBeTruthy();
    expect(
      result.stylingLibraries.items.tailwindCSS.confidence
    ).toBeGreaterThanOrEqual(1);
  });

  it('detects shadcn/ui component library', async () => {
    expect(result.stylingLibraries.items.shadcn).toBeTruthy();
    expect(
      result.stylingLibraries.items.shadcn.confidence
    ).toBeGreaterThanOrEqual(1);
  });

  it('detects shadcn/ui component library', async () => {
    expect(result.stylingLibraries.items.shadcn).toBeTruthy();
    expect(
      result.stylingLibraries.items.shadcn.confidence
    ).toBeGreaterThanOrEqual(1);
  });

  it('detects radix ui library', async () => {
    expect(result.stylingLibraries.items.radix).toBeTruthy();
    expect(
      result.stylingLibraries.items.radix.confidence
    ).toBeGreaterThanOrEqual(1);
  });

  it('detects lucide icons library', async () => {
    expect(result.stylingLibraries.items.lucide).toBeTruthy();
    expect(
      result.stylingLibraries.items.lucide.confidence
    ).toBeGreaterThanOrEqual(1);
  });
});
