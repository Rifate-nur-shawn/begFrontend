import Image from "next/image";

export default function SustainabilityPage() {
  return (
    <div className="min-h-screen bg-canvas">
      {/* Hero */}
      <div className="relative h-screen w-full flex items-center justify-center">
        <Image
          src="https://images.unsplash.com/photo-1518558997970-4ddc236affcd?q=80&w=2070"
          alt="Sustainability"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 text-center text-white max-w-3xl px-4">
          <h1 className="font-display text-5xl md:text-8xl mb-6">Sustainability</h1>
          <p className="font-utility text-xs tracking-widest uppercase">
            Our commitment to a better future
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 md:px-12 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 mb-24">
          <div>
            <h2 className="font-display text-3xl mb-6">Ethical Sourcing</h2>
            <p className="font-utility text-sm leading-relaxed text-neutral-600">
              Every material in our products is carefully sourced from certified suppliers 
              who share our values. Our leather comes from tanneries that meet the highest 
              environmental and ethical standards.
            </p>
          </div>
          <div>
            <h2 className="font-display text-3xl mb-6">Artisan Communities</h2>
            <p className="font-utility text-sm leading-relaxed text-neutral-600">
              We work directly with artisan communities, ensuring fair wages and safe 
              working conditions. Our partnerships preserve traditional craftsmanship 
              while supporting local economies.
            </p>
          </div>
          <div>
            <h2 className="font-display text-3xl mb-6">Carbon Neutral</h2>
            <p className="font-utility text-sm leading-relaxed text-neutral-600">
              We&apos;re committed to achieving carbon neutrality by 2028. We offset our 
              current emissions through verified carbon projects and continuously work 
              to reduce our environmental footprint.
            </p>
          </div>
          <div>
            <h2 className="font-display text-3xl mb-6">Circular Design</h2>
            <p className="font-utility text-sm leading-relaxed text-neutral-600">
              Our products are designed to last generations, not seasons. We offer 
              repair services to extend product life and a take-back program for 
              responsible end-of-life handling.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="border-t border-b border-neutral-200 py-16">
          <div className="grid grid-cols-3 text-center">
            <div>
              <p className="font-display text-5xl md:text-7xl">100%</p>
              <p className="font-utility text-xs tracking-widest uppercase text-neutral-500 mt-2">
                Ethically Sourced
              </p>
            </div>
            <div>
              <p className="font-display text-5xl md:text-7xl">0</p>
              <p className="font-utility text-xs tracking-widest uppercase text-neutral-500 mt-2">
                Single-Use Plastics
              </p>
            </div>
            <div>
              <p className="font-display text-5xl md:text-7xl">85%</p>
              <p className="font-utility text-xs tracking-widest uppercase text-neutral-500 mt-2">
                Recycled Packaging
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mt-16">
          <p className="font-utility text-xs tracking-widest uppercase text-neutral-500">
            Questions about our sustainability practices?
          </p>
          <p className="font-display text-2xl mt-4">
            sustainability@velancis.com
          </p>
        </div>
      </div>
    </div>
  );
}
