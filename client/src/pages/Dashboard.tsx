import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import QuickStats from "@/components/QuickStats";
import UploadZone from "@/components/UploadZone";
import PropertyCard from "@/components/PropertyCard";
import PropertyDetailDialog from "@/components/PropertyDetailDialog";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import { differenceInHours } from "date-fns";

// TODO: remove mock data when connecting to backend
const mockProperties: Array<{
  id: string;
  ownerName: string;
  buildingName: string;
  location: string;
  demolitionDate: Date;
  imageUrl?: string;
}> = [
  {
    id: "1",
    ownerName: "Sarah Parker",
    buildingName: "Storage Silo",
    location: "Dewstone Plains",
    demolitionDate: new Date(Date.now() + 2 * 60 * 60 * 1000),
    imageUrl: "https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=800",
  },
  {
    id: "2",
    ownerName: "Michael Chen",
    buildingName: "Trade Warehouse",
    location: "Windscour Savannah",
    demolitionDate: new Date(Date.now() + 20 * 60 * 60 * 1000),
    imageUrl: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800",
  },
  {
    id: "3",
    ownerName: "Emma Wilson",
    buildingName: "Farmhouse Estate",
    location: "Marianople",
    demolitionDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
  },
  {
    id: "4",
    ownerName: "James Rodriguez",
    buildingName: "Merchant Shop",
    location: "Solzreed Peninsula",
    demolitionDate: new Date(Date.now() + 18 * 60 * 60 * 1000),
  },
  {
    id: "5",
    ownerName: "Lisa Anderson",
    buildingName: "Crafting Hall",
    location: "Tigerspine Mountains",
    demolitionDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
  },
  {
    id: "6",
    ownerName: "David Kim",
    buildingName: "Auction House",
    location: "Two Crowns",
    demolitionDate: new Date(Date.now() - 1 * 60 * 60 * 1000),
  },
];

export default function Dashboard() {
  const { toast } = useToast();
  const [properties, setProperties] = useState(mockProperties);
  const [showUpload, setShowUpload] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showPropertyDetail, setShowPropertyDetail] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<typeof mockProperties[0] | null>(null);
  const [confirmationMode, setConfirmationMode] = useState<"new" | "update">("new");
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | undefined>();
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleUpload = (file: File) => {
    setIsProcessing(true);
    // TODO: Implement actual AI processing with OpenAI
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

  const handleNavigate = (propertyId: string) => {
    const property = properties.find(p => p.id === propertyId);
    if (property) {
      setSelectedProperty(property);
      setShowPropertyDetail(true);
    }
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
    p.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const urgentCount = properties.filter(
    p => differenceInHours(p.demolitionDate, new Date()) <= 24 && differenceInHours(p.demolitionDate, new Date()) > 0
  ).length;

  const upcomingCount = properties.filter(
    p => differenceInHours(p.demolitionDate, new Date()) > 24
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
              placeholder="Search by building, owner, or location..."
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
                onNavigate={handleNavigate}
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

      {selectedProperty && (
        <PropertyDetailDialog
          open={showPropertyDetail}
          onClose={() => {
            setShowPropertyDetail(false);
            setSelectedProperty(null);
          }}
          property={selectedProperty}
        />
      )}
    </div>
  );
}
