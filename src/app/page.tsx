'use client'

import { ChangeEvent, useState } from 'react'
import { Loader2, ArrowLeft } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

type TechStack = {
  Framework: string[];
  Styling: string[];
  Language: string[];
  'UI Library': string[];
}

// Simulated function to get tech stack (replace with actual implementation in a real app)
const getTechStack = async (url: string): Promise<TechStack> => {
  console.log(url);
  await new Promise(resolve => setTimeout(resolve, 3000)) // Simulate a 3-second delay
  return {
    Framework: ["Next.js"],
    Styling: ["Tailwind CSS"],
    Language: ["TypeScript"],
    'UI Library': ["React"],
  }
}

export default function TechStackAnalyzer() {
  const [url, setUrl] = useState('https://')
  const [isLoading, setIsLoading] = useState(false)
  const [techStack, setTechStack] = useState<TechStack | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const stack = await getTechStack(url)
      setTechStack(stack)
    } catch (error) {
      console.error('Error fetching tech stack:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setUrl('')
    setTechStack(null)
  }

  const handleUrlUpdate = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    console.log(value, 'value');
    const url = `https://${value.replace(/h?t?t?p?s?\:?\/?\/?/, '')}`
    console.log(url);
    setUrl(url);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-5">
      <Card className="w-full max-w-md bg-transparent text-white">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Unbuilt</CardTitle>
          <CardDescription className="text-gray-400">Analyze the technical stack of any website</CardDescription>
        </CardHeader>
        <CardContent>
          <div>{'Artem <3 Dasha!!!'}</div>
          {/* {!techStack && !isLoading && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="url"
                placeholder="https://example.com"
                value={url}
                onChange={handleUrlUpdate}
                required
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              />
              <Button  type="submit"  className="w-full bg-blue-500 hover:bg-blue-700 text-white">
                Analyze
              </Button>
            </form>
          )}

          {isLoading && (
            <div className="flex flex-col items-center justify-center space-y-4 py-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              <p className="text-gray-400">Analyzing {url}...</p>
            </div>
          )}

          {!isLoading && techStack && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold">Results for {url}</h3>
                <Button variant="ghost" size="icon" onClick={handleReset}>
                  <ArrowLeft className="h-4 w-4" />
                  <span className="sr-only">Back</span>
                </Button>
              </div>
              {Object.entries(techStack).map(([category, technologies]) => (
                <div key={category}>
                  <h4 className="text-lg font-medium text-gray-300 mb-2">{category}:</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {technologies.map((tech, index) => (
                      <li key={index} className="text-blue-400">{tech}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )} */}
        </CardContent>
      </Card>
    </div>
  )
}