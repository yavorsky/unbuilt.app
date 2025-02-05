'use client';

import { AnalyzeForm } from '../components/analyzer-form/analyze-form';
import { URLSuggestions } from '../components/url-suggestions/url-suggestions';
import { AnalysisFormProvider } from '../contexts/analysis-form';
import { LogoIcon } from '../components/icons/logo';

export default function Root() {
  return (
    <AnalysisFormProvider initialUrl="">
      <div className="flex flex-col page gap-8 flex-1 p-2 md:p-8 mt-24 md:mt-0 md:justify-center justify-start">
        <div className="text-center">
          <div className="flex items-center justify-center flex-col mb-6">
            <div className="relative w-[120px] h-[120px] flex items-center justify-center flex-col gap-y-4">
              <div className="absolute -top-6 inset-0 bg-[#4455FF] opacity-20 rounded-full blur-xl" />
              <LogoIcon size={64} />
              <h1 className="text-4xl font-bold text-foreground">
                Unbuilt<span className="text-foreground/80">.app</span>
              </h1>
            </div>
          </div>
          <p className="text-lg text-foreground/50 max-w-md mx-auto">
            Unbuilding the web, piece by piece
            <br />
            See the exact technologies powering any web app
            <br />
          </p>
        </div>

        <div className="flex-0 flex justify-center items-center relative">
          <AnalyzeForm />
        </div>
        <URLSuggestions />
      </div>
    </AnalysisFormProvider>
  );
}
