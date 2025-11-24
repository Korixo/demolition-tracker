import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import QuickStats from "@/components/QuickStats";
import UploadZone from "@/components/UploadZone";
import PropertyCard from "@/components/PropertyCard";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import { differenceInHours } from "date-fns";

// TODO: remove mock data when connecting to backend
const mockProperties: Array<{
  id: string;
  ownerName: string;
  buildingName: string;
  demolitionDate: Date;
  status: "pending" | "confirmed" | "reminded" | "completed";
}> = [
  {
    id: "1",
    ownerName: "Sarah Parker",
    buildingName: "Storage Silo",
    demolitionDate: new Date(Date.now() + 2 * 60 * 60 * 1000),
    status: "confirmed",
  },
  {
    id: "2",
    ownerName: "Michael Chen",
    buildingName: "Trade Warehouse",
    demolitionDate: new Date(Date.now() + 20 * 60 * 60 * 1000),
    status: "reminded",
  },
  {
    id: "3",
    ownerName: "Emma Wilson",
    buildingName: "Farmhouse Estate",
    demolitionDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    status: "pending",
  },
  {
    id: "4",
    ownerName: "James Rodriguez",
    buildingName: "Merchant Shop",
    demolitionDate: new Date(Date.now() + 18 * 60 * 60 * 1000),
    status: "confirmed",
  },
  {
    id: "5",
    ownerName: "Lisa Anderson",
    buildingName: "Crafting Hall",
    demolitionDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
    status: "pending",
  },
  {
    id: "6",
    ownerName: "David Kim",
    buildingName: "Auction House",
    demolitionDate: new Date(Date.now() - 1 * 60 * 60 * 1000),
    status: "reminded",
  },
];

export default function Dashboard() {
  const { toast } = useToast();
  const [properties, setProperties] = useState(mockProperties);
  const [showUpload, setShowUpload] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationMode, setConfirmationMode] = useState<"new" | "update">("new");
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | undefined>();
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleUpload = (file: File) => {
    setIsProcessing(true);
    // TODO: Implement actual AI processing
    setTimeout(() => {
      setIsProcessing(false);
      setConfirmationMode("new");
      setSelectedPropertyId(undefined);
      setShowConfirmation(true);
      setShowUpload(false);
    }, 2000);
  };

  const handleReupload = (propertyId: string) => {
    const property = properties.find(p => p.id === propertyId);
    if (!property) return;

    // Simulate file picker and AI re-processing
    setIsProcessing(true);
    setSelectedPropertyId(propertyId);
    
    setTimeout(() => {
      setIsProcessing(false);
      setConfirmationMode("update");
      setShowConfirmation(true);
      toast({
        title: "Image processed",
        description: "Review the updated information for " + property.buildingName,
      });
    }, 2000);
  };

  const handleDelete = (propertyId: string) => {
    const property = properties.find(p => p.id === propertyId);
    setProperties(properties.filter(p => p.id !== propertyId));
    
    toast({
      title: "Property deleted",
      description: property ? `${property.buildingName} has been removed.` : "Property removed",
    });
  };

  const filteredProperties = properties.filter((p) =>
    p.buildingName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.ownerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const urgentCount = properties.filter(
    p => differenceInHours(p.demolitionDate, new Date()) <= 24 && differenceInHours(p.demolitionDate, new Date()) > 0
  ).length;

  const upcomingCount = properties.filter(
    p => differenceInHours(p.demolitionDate, new Date()) > 24 && p.status !== 'completed'
  ).length;

  // Sort: urgent first, then by date
  const sortedProperties = [...filteredProperties].sort((a, b) => {
    const aHours = differenceInHours(a.demolitionDate, new Date());
    const bHours = differenceInHours(b.demolitionDate, new Date());
    const aUrgent = aHours <= 24 && aHours > 0;
    const bUrgent = bHours <= 24 && bHours > 0;
    
    if (aUrgent && !bUrgent) return -1;
    if (!aUrgent && bUrgent) return 1;
    return a.demolitionDate.getTime() - b.demolitionDate.getTime();
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 md:px-6 py-6 space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold" data-testid="text-page-title">Property Demolitions</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Track and manage demolition notices
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

        <QuickStats
          totalProperties={properties.length}
          urgent={urgentCount}
          upcoming={upcomingCount}
        />

        {showUpload && (
          <UploadZone onUpload={handleUpload} isProcessing={isProcessing} />
        )}

        <div className="space-y-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by building or owner..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
              data-testid="input-search"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {sortedProperties.map((property) => (
              <PropertyCard
                key={property.id}
                {...property}
                onDelete={handleDelete}
                onReupload={handleReupload}
              />
            ))}
          </div>

          {sortedProperties.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              No properties found
            </div>
          )}
        </div>
      </main>

      <ConfirmationDialog
        open={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        mode={confirmationMode}
        propertyId={selectedPropertyId}
        extractedData={{
          propertyAddress: confirmationMode === "update" 
            ? properties.find(p => p.id === selectedPropertyId)?.buildingName + " - Owner: " + properties.find(p => p.id === selectedPropertyId)?.ownerName
            : "Storage Silo - Owner: John Smith",
          demolitionDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          extractedText: "MISSED PAYMENT NOTICE\n\nBuilding: Storage Silo\nOwner: John Smith\nDemolition: March 15, 2024 at 10:00 AM\n\nPlease pay taxes immediately.",
        }}
      />
    </div>
  );
}
