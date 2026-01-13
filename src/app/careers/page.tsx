import Image from "next/image";

const POSITIONS = [
  {
    title: "Senior Artisan - Leather Goods",
    department: "Atelier",
    location: "Dhaka",
    type: "Full-time"
  },
  {
    title: "E-commerce Manager",
    department: "Digital",
    location: "Remote",
    type: "Full-time"
  },
  {
    title: "Visual Merchandiser",
    department: "Retail",
    location: "Chittagong",
    type: "Full-time"
  },
  {
    title: "Brand Ambassador",
    department: "Retail",
    location: "Multiple Locations",
    type: "Part-time"
  },
];

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-canvas pt-32 pb-24">
      {/* Hero */}
      <div className="relative h-[60vh] w-full mb-24">
        <Image
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069"
          alt="Velancis Careers"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="font-display text-5xl md:text-8xl mb-6">Careers</h1>
            <p className="font-utility text-xs tracking-widest uppercase">
              Join the Velancis family
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 md:px-12">
        <div className="mb-24">
          <h2 className="font-display text-3xl mb-6">Work With Us</h2>
          <p className="font-utility text-sm leading-relaxed text-neutral-600 max-w-2xl">
            At Velancis, we believe that exceptional products are created by exceptional people. 
            We&apos;re looking for passionate individuals who share our commitment to craftsmanship, 
            innovation, and excellence.
          </p>
        </div>

        <div>
          <h2 className="font-display text-3xl mb-8">Open Positions</h2>
          <div className="space-y-4">
            {POSITIONS.map((position) => (
              <div 
                key={position.title}
                className="border border-neutral-200 p-6 hover:border-black transition-colors cursor-pointer group"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-display text-xl group-hover:translate-x-2 transition-transform">
                      {position.title}
                    </h3>
                    <p className="font-utility text-xs text-neutral-500 mt-1">
                      {position.department} • {position.location} • {position.type}
                    </p>
                  </div>
                  <span className="font-utility text-xs uppercase tracking-widest">
                    Apply →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-24 pt-16 border-t border-neutral-200 text-center">
          <p className="font-utility text-xs tracking-widest uppercase text-neutral-500 mb-4">
            Don&apos;t see a perfect fit?
          </p>
          <p className="font-display text-2xl mb-8">
            Send your CV to careers@velancis.com
          </p>
        </div>
      </div>
    </div>
  );
}
