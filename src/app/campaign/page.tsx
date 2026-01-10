import HorizontalScroll from "@/components/brand/HorizontalScroll";
import Image from "next/image";

const CAMPAIGN_IMAGES = [
  { src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop", caption: "Look 01" },
  { src: "https://images.unsplash.com/photo-1529139574466-a302d2052574?q=80&w=1964&auto=format&fit=crop", caption: "Look 02" },
  { src: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1888&auto=format&fit=crop", caption: "Look 03" },
  { src: "https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?q=80&w=2070&auto=format&fit=crop", caption: "Look 04" },
  { src: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop", caption: "Look 05" },
];

export default function CampaignPage() {
  return (
    <div className="bg-canvas">
       {/* Intro */}
       <div className="h-screen flex items-center justify-center bg-canvas">
            <h1 className="font-display text-6xl md:text-9xl text-center leading-none">
                THE<br/>CAMPAIGN
            </h1>
       </div>

       {/* Horizontal Scroll Section */}
       <HorizontalScroll className="gap-12 pl-12 md:pl-32">
            {/* Title Card */}
             <div className="relative h-[60vh] w-[400px] md:w-[600px] flex items-end shrink-0">
                 <p className="font-display text-6xl md:text-8xl text-white">
                    FALL<br/>WINTER
                 </p>
             </div>

             {/* Images */}
            {CAMPAIGN_IMAGES.map((img, i) => (
                <div key={i} className="relative h-[60vh] w-[300px] md:w-[450px] shrink-0 bg-neutral-800">
                    <Image
                        src={img.src}
                        alt={img.caption}
                        fill
                        className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
                    />
                    <span className="absolute -bottom-10 left-0 font-utility text-xs text-white uppercase tracking-widest">
                        {img.caption}
                    </span>
                </div>
            ))}

            {/* End Card */}
            <div className="relative h-[60vh] w-[400px] flex items-center justify-center shrink-0">
                <p className="font-utility text-xs tracking-widest text-neutral-500 uppercase">
                    End of Lookbook
                </p>
            </div>
       </HorizontalScroll>

       {/* Outro */}
       <div className="h-[50vh] flex items-center justify-center bg-canvas">
            <p className="font-utility text-sm uppercase tracking-widest">
                Explore the Collection
            </p>
       </div>
    </div>
  );
}
