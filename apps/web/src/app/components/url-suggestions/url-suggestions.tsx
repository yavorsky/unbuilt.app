import { useAnalysisForm } from '@/app/contexts/analysis-form/use-analysis-form';
import { Button } from '@/components/ui';

const urlSuggestionsList = [
  'nextjs.org',
  'react.dev',
  'vuejs.org',
  'stripe.com',
  'github.com',
  'wix.com',
  'shopify.com',
  'nytimes.com',
];

export const URLSuggestions = () => {
  const { touched, changeUrl } = useAnalysisForm();

  if (touched) {
    return;
  }

  return (
    <div className="flex-0 mt-16 flex justify-center items-center relative flex-col">
      <span className="text-foreground/40 mb-6">
        Or try some popular options:
      </span>
      <div className="grid grid-cols-4 max-[640px]:grid-cols-2 gap-3">
        {urlSuggestionsList.map((url) => (
          <Button
            className="bg-muted text-foreground/60 hover:text-foreground shadow-none"
            variant="secondary"
            key={url}
            onClick={() => {
              changeUrl(url);
            }}
          >
            {url}
          </Button>
        ))}
      </div>
    </div>
  );
};
