import PropertyCard from '../PropertyCard';

export default function PropertyCardExample() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 max-w-6xl">
      <PropertyCard
        id="1"
        ownerName="John Smith"
        buildingName="Storage Silo"
        demolitionDate={new Date(Date.now() + 2 * 60 * 60 * 1000)}
        status="confirmed"
      />
      <PropertyCard
        id="2"
        ownerName="Jane Doe"
        buildingName="Merchant Warehouse"
        demolitionDate={new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)}
        status="pending"
      />
      <PropertyCard
        id="3"
        ownerName="Bob Wilson"
        buildingName="Farmhouse"
        demolitionDate={new Date(Date.now() - 1 * 60 * 60 * 1000)}
        status="reminded"
      />
    </div>
  );
}
