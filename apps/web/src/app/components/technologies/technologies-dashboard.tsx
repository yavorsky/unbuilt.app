import { TechnologyStats } from '@/lib/types';
import { TechnologyTypeSection } from './technology-type-section';
import * as features from '@unbuilt/features';
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
  console.log(stats);
  return (
    <div className="container mx-auto bg-[rgb(3,7,18)] text-white">
      <h1 className="text-3xl font-bold mb-6">Technologies</h1>
      <h4 className="text-xl font-bold text-foreground/70 mb-6">
        All supported technologies with basic usage stats
      </h4>
      <div className="grid grid-cols-1 gap-6 pt-4">
        {sections.map((section) => {
          const statsForType = stats[section.key];
          const metaForType = mapValues(features[section.key].meta, (item) =>
            pick(item, ['name'])
          );

          return (
            <div
              key={section.key}
              className="col-span-1 sm:col-span-1 lg:col-span-2"
            >
              <TechnologyTypeSection
                key={section.type}
                title={section.title}
                type={section.type}
                meta={metaForType}
                data={statsForType || {}}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
