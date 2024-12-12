'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '@/components/ui/card';
import Image from 'next/image';
import { AnalyzeForm } from '../components/analyzer-form/analyze-form';

export default function Root() {
  return (
    <div className="min-h-screen flex flex-col p-8">
      <div className="text-center mt-16 mb-32">
        <div className="flex items-center justify-center gap-2 mb-6">
          <Image
            src="/icon.svg"
            alt="Unbuilt app icon"
            width={40}
            height={40}
            className="text-white mr-2"
          />
          <h1 className="text-4xl font-bold text-white">
            Unbuilt<span className="text-slate-300"> app</span>
          </h1>
        </div>
        <p className="text-lg text-gray-400 max-w-md mx-auto">
          Discover the magic behind any website. Instantly reveal frameworks,
          tools, and technologies powering your favorite web apps.
        </p>
      </div>

      <div className="flex-0 flex justify-center">
        <Card className="w-full max-w-md bg-gray-900 border-gray-800 transition-all duration-100 h-48">
          <CardHeader className="pb-2 mb-0">
            <CardDescription className="text-gray-400">
              Page url to be <b>unbuilt</b>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AnalyzeForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
