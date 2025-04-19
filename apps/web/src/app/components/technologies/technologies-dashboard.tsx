import { TechnologyTypeSection } from './technology-section';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const sections = [
  { title: 'Frameworks', type: 'framework', key: 'framework' },
  { title: 'UI Libraries', type: 'uiLibrary', key: 'uiLibrary' },
  {
    title: 'State Management',
    type: 'stateManagement',
    key: 'stateManagement',
  },
  { title: 'HTTP Clients', type: 'httpClient', key: 'httpClient' },
  { title: 'Bundlers', type: 'bundler', key: 'bundler' },
  { title: 'Routers', type: 'router', key: 'router' },
  { title: 'Transpilers', type: 'transpiler', key: 'transpiler' },
  { title: 'Monitoring', type: 'monitoring', key: 'monitoring' },
  { title: 'Platforms', type: 'platform', key: 'platform' },
  { title: 'Analytics', type: 'analytics', key: 'analytics' },
  { title: 'Minifiers', type: 'minifier', key: 'minifier' },
  { title: 'Translations', type: 'translations', key: 'translations' },
] as const;

export function TechnologiesDashboard() {
  return (
    <Tabs defaultValue={sections[0].key} className="container mx-auto px-4">
      <div>
        <h1 className="text-3xl font-bold mb-6">Technologies</h1>
        <h4 className="text-xl font-bold text-foreground/70 mb-6">
          All supported technologies with basic usage stats
        </h4>
      </div>
      <div className="relative w-full">
        <div className="w-full overflow-x-auto pb-2 no-scrollbar">
          <TabsList className="w-max min-w-full gap-2 bg-transparent flex justify-start">
            {sections.map((section) => {
              return (
                <TabsTrigger
                  value={section.key}
                  key={section.key}
                  className="shrink-0 rounded-lg whitespace-nowrap aria-selected:bg-secondary hover:text-foreground"
                >
                  {section.title}
                </TabsTrigger>
              );
            })}
          </TabsList>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 pt-4">
        {sections.map((section) => {
          return (
            <TabsContent
              value={section.type}
              key={section.key}
              className="col-span-1 sm:col-span-1 lg:col-span-2"
            >
              <TechnologyTypeSection
                key={section.key}
                title={section.title}
                type={section.type}
              />
            </TabsContent>
          );
        })}
      </div>
    </Tabs>
  );
}
