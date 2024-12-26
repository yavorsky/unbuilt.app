'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '@/components/ui/card';
import Image from 'next/image';
import { AnalyzeForm } from '../components/analyzer-form/analyze-form';
import { URLSuggestions } from '../components/url-suggestions/url-suggestions';
import { AnalysisFormProvider } from '../contexts/analysis-form';

export default function Root() {
  return (
    <AnalysisFormProvider initialUrl="">
      <div className="flex flex-col p-8 pt-20">
        <div className="text-center mt-16 mb-16">
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
            Unbuilding the web, piece by piece.
            <br />
            See the exact technologies powering any web app.{' '}
            <i>Free of charge!</i>
          </p>
        </div>

        <div className="flex-0 flex justify-center items-center relative">
          <Card className="w-full max-w-md bg-gray-900/30 backdrop-blur-sm border-gray-800 transition-all duration-100 h-48 z-10 flex flex-col justify-around">
            <CardHeader className="pb-3 mb-0">
              <CardDescription className="text-foreground/40">
                Fill the page url you want to be <b>unbuilt</b>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AnalyzeForm />
            </CardContent>
          </Card>
        </div>
        <URLSuggestions />
      </div>
    </AnalysisFormProvider>
  );
}
