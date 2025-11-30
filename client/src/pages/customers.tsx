import Layout from "@/components/layout";
import { useReportStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";

export default function Customers() {
  const { reports } = useReportStore();

  // Group reports by agent (priimki)
  const agentActivity: Record<string, any[]> = {};

  reports.forEach(report => {
    report.priimki.forEach(agent => {
      if (!agentActivity[agent]) {
        agentActivity[agent] = [];
      }
      agentActivity[agent].push(report);
    });
  });

  const agents = Object.keys(agentActivity).sort();

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Agents & Customers</h1>
          <p className="text-muted-foreground mt-2">
            Activity log grouped by agent.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {agents.length === 0 ? (
            <div className="col-span-full text-center py-12 text-muted-foreground border rounded-lg border-dashed">
              No agent activity recorded yet.
            </div>
          ) : (
            agents.map(agent => (
              <Card key={agent} className="overflow-hidden">
                <CardHeader className="bg-muted/50 pb-4">
                  <CardTitle className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm">
                      {agent.substring(0, 2).toUpperCase()}
                    </div>
                    {agent}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y">
                    {agentActivity[agent].map(report => (
                      <div key={report.id} className="p-4 hover:bg-muted/20 transition-colors text-sm">
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-medium">{report.lokacija}</span>
                          <span className="text-xs text-muted-foreground">{format(new Date(report.created_at), "MMM d")}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground mt-2">
                          <div className="flex items-center gap-1">
                             <span className="w-2 h-2 rounded-full bg-green-500"></span>
                             Fix: {report.fix}
                          </div>
                          <div className="flex items-center gap-1">
                             <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                             Mob: {report.mob}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}
