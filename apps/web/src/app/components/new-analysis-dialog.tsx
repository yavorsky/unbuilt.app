import { Button } from '@/components/ui';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Repeat2Icon } from 'lucide-react';
import { AnalyzeForm } from './analyzer-form';
import { AnalysisFormProvider } from '../contexts/analysis-form';

export function NewAnalysisDialog({
  initialUrl = '',
  selectOnOpen = false,
}: {
  initialUrl: string;
  selectOnOpen?: boolean;
}) {
  return (
    <AnalysisFormProvider initialUrl={initialUrl}>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="link"
            className="text-foreground/80 hover:text-foreground text-base"
          >
            <span>New Analysis</span>
            <Repeat2Icon className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[450px] rounded-lg">
          <DialogHeader>
            <DialogTitle>New Analysis</DialogTitle>
            <DialogDescription>
              Unbuild <b>{initialUrl}</b> again to refresh results or unbuild
              another app. The process will take up to 10 seconds depends on
              service queue.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <AnalyzeForm
                buttonClassName="bg-primary text-primary-foreground hover:bg-primary/90"
                selectOnOpen={selectOnOpen}
                forceNewAnalysis
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AnalysisFormProvider>
  );
}
