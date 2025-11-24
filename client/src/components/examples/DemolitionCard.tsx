import DemolitionCard from '../DemolitionCard';

export default function DemolitionCardExample() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <DemolitionCard
        id="1"
        propertyAddress="123 Main Street, Downtown"
        demolitionDate={new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)}
        status="confirmed"
      />
      <DemolitionCard
        id="2"
        propertyAddress="456 Oak Avenue, Riverside District"
        demolitionDate={new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)}
        status="reminded"
      />
      <DemolitionCard
        id="3"
        propertyAddress="789 Pine Road, Westside"
        demolitionDate={new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)}
        status="pending"
      />
    </div>
  );
}
