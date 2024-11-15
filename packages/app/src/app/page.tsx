'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { AnalyzeForm } from './components/AnalyzeForm/AnalyzeForm'

export default function TechStackAnalyzer() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-5">
      <Card className="w-full max-w-md bg-transparent text-white">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Unbuilt<span className='text-2xl text-slate-300'> app</span></CardTitle>
          <CardDescription className="text-gray-400">Analyze the technical stack of any website</CardDescription>
        </CardHeader>
        <CardContent>
          <AnalyzeForm />
        </CardContent>
      </Card>
    </div>
  )
}
