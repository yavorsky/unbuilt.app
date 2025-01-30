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
      <div className="flex flex-col p-2 lg:p-8 md:p-8 pt-20">
        <div className="text-center mt-2 mb-10 lg:mt-16 lg:mb-16 md:mt-16 md:mb-16">
          <div className="flex items-center justify-center gap-2 mb-6">
            {/* <Image
              src="/icon.svg"
              alt="Unbuilt app icon"
              width={40}
              height={40}
              className="text-white mr-2 hidden lg:inline md:inline"
            /> */}
            <h1 className="text-4xl font-bold text-foreground">
              Unbuilt<span className="text-foreground/80">.app</span>
            </h1>
          </div>
          <p className="text-lg text-gray-400 max-w-md mx-auto">
            Unbuilding the web, piece by piece.
            <br />
            See the exact technologies powering any web app. <br />
          </p>
        </div>

        <div className="flex-0 flex justify-center items-center relative">
          <Card className="w-full max-w-md bg-muted backdrop-blur-sm border-border transition-all duration-100 z-10 flex flex-col justify-around">
            <CardHeader className="pb-3 mb-0">
              <CardDescription className="text-foreground/50">
                Enter URL of the app to be <b>unbuilt</b>
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
