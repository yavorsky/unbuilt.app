'use client';

import {
  getTechnologyMetaForType,
  TechnologyMetaResults,
} from '@/app/utils/get-technology-meta';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { AnalysisTechnologies } from '@unbuilt/analyzer';
import { useRouter } from 'next/navigation';

export function TableTechnologies<
  T extends AnalysisTechnologies,
  M extends TechnologyMetaResults<T>,
>({
  features,
  type,
}: {
  features: { name: string; count: number }[];
  type: T;
}) {
  const router = useRouter();

  return (
    <Table>
      <TableHeader>
        <TableRow className="border-none select-none hover:bg-transparent">
          <TableHead className="w-[200px]"></TableHead>
          <TableHead className="text-right">Used By</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {features.map((item) => {
          const meta = getTechnologyMetaForType(type, item.name as M);

          return (
            <TableRow
              key={item.name}
              className="border-border/50 cursor-pointer text-lg p-4 hover:bg-trasnparent group"
              onClick={() => {
                router.push(`/technologies/${type}/${item.name}`);
              }}
            >
              <TableCell className="text-base text-foreground/90 group-hover:underline">
                {meta?.name}
              </TableCell>
              <TableCell className="text-right text-foreground/90">
                {item.count}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
