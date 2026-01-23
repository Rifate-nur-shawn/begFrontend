import Hero from "@/components/home/Hero";
import FeaturedGrid from "@/components/home/FeaturedGrid";
import NewArrivals from "@/components/home/NewArrivals";

export default function Home() {
  return (
    <div className="min-h-screen">
       <Hero />
       <NewArrivals />
       <FeaturedGrid />
       {/* Footer will go here later */}
    </div>
  );
}
