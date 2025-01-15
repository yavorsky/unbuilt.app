import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { AnalysisKeys } from '@unbuilt/analyzer';
import { useRouter } from 'next/navigation';

export function TableTechnologies({
  features,
  type,
  meta,
}: {
  features: { name: string; count: number }[];
  type: AnalysisKeys;
  meta: Record<string, { name: string }> | undefined;
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
        {features.map((item) => (
          <TableRow
            key={item.name}
            className="border-border/50 cursor-pointer text-lg p-4 hover:bg-trasnparent group"
            onClick={() => {
              router.push(`/technologies/${type}/${item.name}`);
            }}
          >
            <TableCell className="text-base text-foreground/90 group-hover:underline">
              {meta?.[item.name]?.name}
            </TableCell>
            <TableCell className="text-right text-foreground/90">
              {item.count}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
