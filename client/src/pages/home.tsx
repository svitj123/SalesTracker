import { useState } from "react";
import Layout from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { parseReport, ParsedReport } from "@/lib/parser";
import { useReportStore } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, CheckCircle2, ArrowRight } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useLocation } from "wouter";
import { v4 as uuidv4 } from 'uuid';

export default function Home() {
  const [text, setText] = useState("");
  const [parsed, setParsed] = useState<ParsedReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const addReport = useReportStore((state) => state.addReport);
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const handleParse = () => {
    if (!text.trim()) {
      setParsed(null);
      return;
    }
    try {
      const result = parseReport(text);
      setParsed(result);
      setError(null);
    } catch (e) {
      setParsed(null);
      setError("Could not parse report. Please check the format.");
    }
  };

  const handleSave = () => {
    if (!parsed) return;

    addReport({
      id: uuidv4(),
      created_at: new Date().toISOString(),
      ...parsed,
      raw_text: text,
    });

    toast({
      title: "Report Saved",
      description: `Sales report for ${parsed.lokacija} has been added.`,
    });

    setText("");
    setParsed(null);
    setLocation("/dashboard");
  };

  return (
    <Layout>
      <div className="space-y-6 max-w-3xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">New Report</h1>
          <p className="text-muted-foreground mt-2">
            Paste your weekly agent sales report below. The system will automatically parse the data.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Raw Input</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder={`Brezovica
Obiskani: 13
Odzvani: 6
Fix: 2
Mob: 3
VS: 1
TW: 1
Ure: 4,5
(Žitko, Ožegović)`}
                  className="min-h-[300px] font-mono text-sm"
                  value={text}
                  onChange={(e) => {
                    setText(e.target.value);
                    // Debounce parse could go here, but manual for now is fine or effect
                    if (e.target.value.trim() === "") setParsed(null);
                  }}
                  onKeyUp={handleParse}
                />
              </CardContent>
            </Card>
            
            <Button 
              className="w-full" 
              size="lg" 
              onClick={handleParse}
              variant="outline"
            >
              Check Format
            </Button>
          </div>

          <div className="space-y-4">
             <Card className="h-full flex flex-col">
              <CardHeader>
                <CardTitle>Preview</CardTitle>
                <CardDescription>Verify the extracted data before saving</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {!parsed && !error && (
                  <div className="h-full flex items-center justify-center text-muted-foreground text-sm italic">
                    Waiting for input...
                  </div>
                )}

                {parsed && (
                  <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
                    <div className="p-4 bg-accent/20 rounded-lg border border-accent/20">
                      <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider text-xs mb-1">Location</div>
                      <div className="text-2xl font-bold text-primary">{parsed.lokacija}</div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-card border rounded-md">
                        <div className="text-xs text-muted-foreground">Obiskani</div>
                        <div className="text-lg font-semibold">{parsed.obiskani}</div>
                      </div>
                      <div className="p-3 bg-card border rounded-md">
                        <div className="text-xs text-muted-foreground">Odzvani</div>
                        <div className="text-lg font-semibold">{parsed.odzvani}</div>
                      </div>
                      <div className="p-3 bg-green-50 dark:bg-green-950/20 border border-green-100 dark:border-green-900 rounded-md">
                        <div className="text-xs text-green-600 dark:text-green-400">Fix (Sales)</div>
                        <div className="text-lg font-bold text-green-700 dark:text-green-300">{parsed.fix}</div>
                      </div>
                      <div className="p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900 rounded-md">
                        <div className="text-xs text-blue-600 dark:text-blue-400">Mob (Sales)</div>
                        <div className="text-lg font-bold text-blue-700 dark:text-blue-300">{parsed.mob}</div>
                      </div>
                      <div className="p-3 bg-card border rounded-md">
                        <div className="text-xs text-muted-foreground">VS</div>
                        <div className="text-lg font-semibold">{parsed.vs}</div>
                      </div>
                      <div className="p-3 bg-card border rounded-md">
                        <div className="text-xs text-muted-foreground">TW</div>
                        <div className="text-lg font-semibold">{parsed.tw}</div>
                      </div>
                    </div>

                    <div>
                      <div className="text-xs text-muted-foreground mb-2">Agents</div>
                      <div className="flex flex-wrap gap-2">
                        {parsed.priimki.map((name, i) => (
                          <span key={i} className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-xs font-medium">
                            {name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
             </Card>
             
             <Button 
               className="w-full" 
               size="lg" 
               onClick={handleSave} 
               disabled={!parsed}
             >
               <CheckCircle2 className="mr-2 h-4 w-4" />
               Add Report
             </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
