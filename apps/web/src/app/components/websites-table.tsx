import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { WebsiteData } from '@/lib/api/get-technology-websites';
import { ExternalLinkIcon } from 'lucide-react';

interface WebsiteTableProps {
  data: WebsiteData[];
  formatDate: (date: string) => string;
}

export function WebsitesTable({ data, formatDate }: WebsiteTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Website</TableHead>
          <TableHead>Analyzed</TableHead>
          <TableHead className="w-[50px]">Confidence</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((website) => (
          <TableRow key={website.id}>
            <TableCell className="text-xl">
              <a
                href={website.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-1 text-sm text-foreground/80 hover:text-foreground transition-colors"
              >
                {website.url}
                <ExternalLinkIcon className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            </TableCell>
            <TableCell>{formatDate(website?.analyzed_at)}</TableCell>
            <TableCell>{website.confidence}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
