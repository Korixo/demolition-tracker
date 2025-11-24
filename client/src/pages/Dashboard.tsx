import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Plus, Search, LayoutGrid, List } from "lucide-react";
import Header from "@/components/Header";
import DashboardStats from "@/components/DashboardStats";
import UploadZone from "@/components/UploadZone";
import DemolitionCard from "@/components/DemolitionCard";
import DemolitionTable from "@/components/DemolitionTable";
import ReminderSidebar from "@/components/ReminderSidebar";
import ConfirmationDialog from "@/components/ConfirmationDialog";

// TODO: remove mock data when connecting to backend
const mockDemolitions: Array<{
  id: string;
  propertyAddress: string;
  demolitionDate: Date;
  status: "pending" | "confirmed" | "reminded" | "completed";
}> = [
  {
    id: "1",
    propertyAddress: "123 Main Street, Downtown District",
    demolitionDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    status: "confirmed",
  },
  {
    id: "2",
    propertyAddress: "456 Oak Avenue, Riverside Area",
    demolitionDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    status: "reminded",
  },
  {
    id: "3",
    propertyAddress: "789 Pine Road, Westside Community",
    demolitionDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    status: "pending",
  },
  {
    id: "4",
    propertyAddress: "321 Elm Street, Northgate",
    demolitionDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
    status: "confirmed",
  },
  {
    id: "5",
    propertyAddress: "654 Maple Drive, Eastwood",
    demolitionDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
    status: "pending",
  },
  {
    id: "6",
    propertyAddress: "987 Cedar Lane, Southpark",
    demolitionDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    status: "reminded",
  },
];

const mockReminders = [
  {
    id: "1",
    propertyAddress: "123 Main Street, Downtown District",
    demolitionDate: new Date(Date.now() + 2 * 60 * 60 * 1000),
    reminderType: "3h" as const,
  },
  {
    id: "2",
    propertyAddress: "456 Oak Avenue, Riverside Area",
    demolitionDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
    reminderType: "1h" as const,
  },
  {
    id: "3",
    propertyAddress: "987 Cedar Lane, Southpark",
    demolitionDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    reminderType: "3h" as const,
  },
];

export default function Dashboard() {
  const [showUpload, setShowUpload] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  const handleUpload = (file: File) => {
    setIsProcessing(true);
    // TODO: Implement actual AI processing
    setTimeout(() => {
      setIsProcessing(false);
      setShowConfirmation(true);
      setShowUpload(false);
    }, 2000);
  };

  const filteredDemolitions = mockDemolitions.filter((d) =>
    d.propertyAddress.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6 space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold" data-testid="text-page-title">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Manage your property demolition notices
            </p>
          </div>
          <Button
            onClick={() => setShowUpload(!showUpload)}
            data-testid="button-new-notice"
          >
            <Plus className="h-4 w-4 mr-2" />
            Upload Notice
          </Button>
        </div>

        <DashboardStats
          totalProperties={mockDemolitions.length}
          upcomingDemolitions={mockDemolitions.filter(d => d.status !== 'completed').length}
          alerts={mockReminders.length}
          completed={mockDemolitions.filter(d => d.status === 'completed').length}
        />

        {showUpload && (
          <UploadZone onUpload={handleUpload} isProcessing={isProcessing} />
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search properties..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                  data-testid="input-search"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={viewMode === "grid" ? "secondary" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("grid")}
                  data-testid="button-view-grid"
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "table" ? "secondary" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("table")}
                  data-testid="button-view-table"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {viewMode === "grid" ? (
              <div className="grid gap-4 md:grid-cols-2">
                {filteredDemolitions.map((demolition) => (
                  <DemolitionCard key={demolition.id} {...demolition} />
                ))}
              </div>
            ) : (
              <DemolitionTable demolitions={filteredDemolitions} />
            )}
          </div>

          <div className="lg:col-span-1">
            <ReminderSidebar reminders={mockReminders} />
          </div>
        </div>
      </main>

      <ConfirmationDialog
        open={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        extractedData={{
          propertyAddress: "123 Main Street, Downtown",
          demolitionDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          extractedText: "MISSED PAYMENT NOTICE\n\nProperty: 123 Main Street\nDemolition Date: March 15, 2024 at 10:00 AM\n\nPlease contact us immediately if you have questions.",
        }}
      />
    </div>
  );
}
