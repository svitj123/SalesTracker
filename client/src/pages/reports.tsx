import Layout from "@/components/layout";
import { useReportStore } from "@/lib/store";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

export default function Reports() {
  const { reports, deleteReport } = useReportStore();
  const { toast } = useToast();

  const handleDelete = (id: string) => {
    deleteReport(id);
    toast({
      title: "Report Deleted",
      description: "The report has been removed from the database.",
      variant: "destructive",
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
         <div>
          <h1 className="text-3xl font-bold tracking-tight">All Reports</h1>
          <p className="text-muted-foreground mt-2">
            History of all submitted weekly reports.
          </p>
        </div>

        <div className="rounded-md border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Agent</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Customers</TableHead>
                <TableHead className="text-right">Fix</TableHead>
                <TableHead className="text-right">Mob</TableHead>
                <TableHead className="text-right">Hours</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                    No reports found. Go to Home to add one.
                  </TableCell>
                </TableRow>
              ) : (
                reports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell className="font-medium">
                      {format(new Date(report.created_at), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell className="font-medium text-primary">
                      {report.agent || '-'}
                    </TableCell>
                    <TableCell>{report.lokacija}</TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap max-w-[200px]">
                        {report.priimki.slice(0, 3).map((p, i) => (
                          <span key={i} className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-semibold transition-colors border-transparent bg-secondary text-secondary-foreground">
                            {p}
                          </span>
                        ))}
                        {report.priimki.length > 3 && (
                           <span className="text-xs text-muted-foreground self-center">+{report.priimki.length - 3} more</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-mono">{report.fix}</TableCell>
                    <TableCell className="text-right font-mono">{report.mob}</TableCell>
                    <TableCell className="text-right font-mono">{report.ure}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleDelete(report.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </Layout>
  );
}
