import Image from "next/image";

const STORES = [
  {
    city: "Dhaka",
    address: "Gulshan City Center, Level 3, Plot 15, Gulshan-2",
    hours: "10:00 AM - 9:00 PM",
    phone: "+880 1700-000001",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070"
  },
  {
    city: "Chittagong",
    address: "Agrabad Commercial Area, Bay Tower, Floor 2",
    hours: "10:00 AM - 8:00 PM",
    phone: "+880 1700-000002",
    image: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?q=80&w=2070"
  },
  {
    city: "Sylhet",
    address: "Zindabazar, Heritage Plaza, Ground Floor",
    hours: "11:00 AM - 8:00 PM",
    phone: "+880 1700-000003",
    image: "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?q=80&w=2070"
  },
];

export default function StoresPage() {
  return (
    <div className="min-h-screen bg-canvas pt-32 pb-24 px-4 md:px-12">
      <div className="max-w-[1920px] mx-auto">
        <div className="text-center mb-24">
          <h1 className="font-display text-5xl md:text-8xl mb-6">Boutiques</h1>
          <p className="font-utility text-xs tracking-widest uppercase text-neutral-500">
            Visit us and experience Velancis in person
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {STORES.map((store) => (
            <div key={store.city} className="group">
              <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100 mb-6">
                <Image
                  src={store.image}
                  alt={store.city}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <h3 className="font-display text-2xl mb-2">{store.city}</h3>
              <div className="font-utility text-xs space-y-2 text-neutral-600">
                <p>{store.address}</p>
                <p>{store.hours}</p>
                <p>{store.phone}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-24 pt-16 border-t border-neutral-200">
          <p className="font-utility text-xs tracking-widest uppercase text-neutral-500 mb-4">
            Can&apos;t visit in person?
          </p>
          <p className="font-display text-2xl">
            Shop online with complimentary shipping worldwide
          </p>
        </div>
      </div>
    </div>
  );
}
