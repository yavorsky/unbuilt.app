import { useAnalysisForm } from '@/app/contexts/analysis-form/use-analysis-form';
import { Button } from '@/components/ui';

const urlSuggestionsList = [
  'vercel.com',
  'unbuilt.app',
  'lightest.app',
  'mentor.sh',
];

export const URLSuggestions = ({
  onChangeUrl,
}: {
  onChangeUrl: (url: string) => void;
}) => {
  const { touched } = useAnalysisForm();

  return (
    <div
      data-state={touched ? 'touched' : 'untouched'}
      className="flex-0 mt-0 flex justify-center items-center relative flex-col data-[state=touched]:invisible"
    >
      <span className="text-foreground/40 mb-4">
        Or try some popular options:
      </span>
      <div className="grid grid-cols-4 max-[640px]:grid-cols-2 gap-3">
        {urlSuggestionsList.map((url) => (
          <Button
            className="bg-muted text-foreground/60 hover:text-foreground shadow-none"
            variant="secondary"
            key={url}
            onClick={() => {
              onChangeUrl(url);
            }}
          >
            {url}
          </Button>
        ))}
      </div>
    </div>
  );
};
