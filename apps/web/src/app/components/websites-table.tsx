import { TooltipTrigger, Tooltip, TooltipContent } from '@/components/ui';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { WebsiteData } from '@/server/api/get-technology-websites';
import { TooltipProvider } from '@radix-ui/react-tooltip';
import { ExternalLinkIcon } from 'lucide-react';

interface WebsiteTableProps {
  data: WebsiteData[];
  formatDate: (date: string) => string;
}

export function WebsitesTable({ data, formatDate }: WebsiteTableProps) {
  return (
    <TooltipProvider>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Website</TableHead>
            <TableHead>Analyzed</TableHead>
            <TableHead className="w-[100px] items-end">Confidence</TableHead>
            <TableHead className="w-[50px]">Analyzis</TableHead>
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
              <TableCell>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <a
                      href={`/analysis/${website.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-1 text-sm text-foreground/80 hover:text-foreground transition-colors"
                    >
                      {`...${website.id.slice(-7)}`}
                      <ExternalLinkIcon className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  </TooltipTrigger>
                  <TooltipContent>
                    Navigate to analysis: {website.id}
                  </TooltipContent>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TooltipProvider>
  );
}
