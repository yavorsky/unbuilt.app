import { TechnologyStats } from '@/types';
import { TechnologyTypeSection } from './technology-section';
import * as features from '@unbuilt/features';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { mapValues, pick } from 'lodash-es';

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
  { title: 'Minifiers', type: 'minifier', key: 'minifier' },
  { title: 'Translations', type: 'translations', key: 'translations' },
] as const;

export function TechnologiesDashboard({ stats }: { stats: TechnologyStats }) {
  return (
    <Tabs defaultValue={sections[0].key} className="container mx-auto px-4">
      <div>
        <h1 className="text-3xl font-bold mb-6">Technologies</h1>
        <h4 className="text-xl font-bold text-foreground/70 mb-6">
          All supported technologies with basic usage stats
        </h4>
      </div>
      <TabsList className="gap-2 bg-transparent">
        {sections.map((section) => {
          return (
            <TabsTrigger
              value={section.key}
              key={section.key}
              className="rounded-lg aria-selected:bg-secondary hover:text-foreground"
            >
              {section.title}
            </TabsTrigger>
          );
        })}
      </TabsList>
      <div className="grid grid-cols-1 gap-6 pt-4">
        {sections.map((section) => {
          const statsForType = stats[section.key];
          const metaForType = mapValues(features[section.type].meta, (item) =>
            pick(item, ['name'])
          );

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
                meta={metaForType}
                data={statsForType || {}}
              />
            </TabsContent>
          );
        })}
      </div>
    </Tabs>
  );
}
