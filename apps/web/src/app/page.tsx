'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { AnalyzeForm } from './components/AnalyzeForm/AnalyzeForm';

export default function TechStackAnalyzer() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 p-8">
      <Card className="w-full max-w-md bg-gray-900 border-gray-800 transition-all duration-100">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-bold text-white">
            Unbuilt<span className="text-2xl text-slate-300"> app</span>
          </CardTitle>
          <CardDescription className="text-gray-400">
            Analyze the technical stack of any website
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AnalyzeForm />
        </CardContent>
      </Card>
    </div>
  );
}
