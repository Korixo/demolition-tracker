import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Demolition } from "@shared/schema";
import Header from "@/components/Header";
import QuickStats from "@/components/QuickStats";
import UploadZone from "@/components/UploadZone";
import PropertyCard from "@/components/PropertyCard";
import PropertyDetailDialog from "@/components/PropertyDetailDialog";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import { differenceInHours } from "date-fns";

export default function Dashboard() {
  const { toast } = useToast();
  
  // Fetch properties from backend
  const { data: properties = [], isLoading } = useQuery<Demolition[]>({
    queryKey: ["/api/demolitions"],
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/demolitions/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/demolitions"] });
    },
  });
  const [showUpload, setShowUpload] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showPropertyDetail, setShowPropertyDetail] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Demolition | null>(null);
  const [confirmationMode, setConfirmationMode] = useState<"new" | "update">("new");
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | undefined>();
  const [extractedData, setExtractedData] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleUpload = async (file: File) => {
    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to process image');
      }

      const data = await response.json();
      setExtractedData(data);
      setConfirmationMode("new");
      setSelectedPropertyId(undefined);
      setShowConfirmation(true);
      setShowUpload(false);
    } catch (error) {
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to process image",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReupload = (propertyId: string) => {
    setSelectedPropertyId(propertyId);
    setShowUpload(true);
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
    deleteMutation.mutate(propertyId, {
      onSuccess: () => {
        toast({
          title: "Property deleted",
          description: property ? `${property.buildingName} has been removed.` : "Property removed",
        });
      },
    });
  };

  const handleConfirmExtraction = async (data: any) => {
    try {
      const payload = {
        buildingName: data.propertyAddress,
        demolitionDate: data.demolitionDate.toISOString(),
        extractedText: extractedData?.extractedData?.extractedText,
      };

      if (confirmationMode === "update" && selectedPropertyId) {
        await apiRequest("PATCH", `/api/demolitions/${selectedPropertyId}`, payload);
      } else {
        await apiRequest("POST", "/api/demolitions", payload);
      }
      
      queryClient.invalidateQueries({ queryKey: ["/api/demolitions"] });
      
      toast({
        title: confirmationMode === "update" ? "Property updated" : "Property created",
        description: "Demolition notice saved successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save demolition",
        variant: "destructive",
      });
    }
  };

  const filteredProperties = properties.filter((p) =>
    p.buildingName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.ownerName && p.ownerName.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (p.location && p.location.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const urgentCount = properties.filter(
    p => {
      const demoDate = new Date(p.demolitionDate);
      const hours = differenceInHours(demoDate, new Date());
      return hours <= 24 && hours > 0;
    }
  ).length;

  const upcomingCount = properties.filter(
    p => {
      const demoDate = new Date(p.demolitionDate);
      return differenceInHours(demoDate, new Date()) > 24;
    }
  ).length;

  // Sort: urgent first, then by date
  const sortedProperties = [...filteredProperties].sort((a, b) => {
    const aDate = new Date(a.demolitionDate);
    const bDate = new Date(b.demolitionDate);
    const aHours = differenceInHours(aDate, new Date());
    const bHours = differenceInHours(bDate, new Date());
    const aUrgent = aHours <= 24 && aHours > 0;
    const bUrgent = bHours <= 24 && bHours > 0;
    
    if (aUrgent && !bUrgent) return -1;
    if (!aUrgent && bUrgent) return 1;
    return aDate.getTime() - bDate.getTime();
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

          {isLoading ? (
            <div className="text-center py-12 text-muted-foreground">
              Loading properties...
            </div>
          ) : (
            <>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {sortedProperties.map((property) => (
                  <PropertyCard
                    key={property.id}
                    id={property.id}
                    ownerName={property.ownerName || undefined}
                    buildingName={property.buildingName}
                    location={property.location || undefined}
                    demolitionDate={new Date(property.demolitionDate)}
                    imageUrl={property.imageUrl || undefined}
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
            </>
          )}
        </div>
      </main>

      {extractedData && (
        <ConfirmationDialog
          open={showConfirmation}
          onClose={() => {
            setShowConfirmation(false);
            setExtractedData(null);
          }}
          mode={confirmationMode}
          propertyId={selectedPropertyId}
          onConfirm={handleConfirmExtraction}
          extractedData={{
            propertyAddress: extractedData.extractedData?.buildingName || "Unknown Building",
            demolitionDate: extractedData.extractedData?.demolitionDate 
              ? new Date(extractedData.extractedData.demolitionDate)
              : new Date(),
            extractedText: extractedData.extractedData?.extractedText || "",
            imageUrl: extractedData.imageUrl,
          }}
        />
      )}

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
