import Hero from "@/components/home/Hero";
import FeaturedGrid from "@/components/home/FeaturedGrid";

export default function Home() {
  return (
    <div className="min-h-screen">
       <Hero />
       <FeaturedGrid />
       {/* Footer will go here later */}
    </div>
  );
}
