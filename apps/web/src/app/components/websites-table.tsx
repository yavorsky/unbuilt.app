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
            <TableCell className="font-medium">
              <a
                href={website.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors"
              >
                {website.url}
                <ExternalLinkIcon className="w-4 h-4" />
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
