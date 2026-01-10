import TextReveal from "@/components/ui/TextReveal";
import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-canvas pt-32 pb-24">
       
       {/* Hero Text */}
       <div className="max-w-[1920px] mx-auto px-4 md:px-12 mb-32">
            <div className="max-w-4xl">
                <TextReveal className="font-display text-4xl md:text-7xl leading-tight mb-8">
                    BegOnShop redefines modern luxury through a synthesis of structure, void, and pure materiality.
                </TextReveal>
                <TextReveal className="font-utility text-sm md:text-lg uppercase tracking-widest text-neutral-500" delay={0.5}>
                    ESTABLISHED 2026. DIGITAL NATIVE.
                </TextReveal>
            </div>
       </div>

       {/* Large Image */}
       <div className="w-full h-[80vh] relative mb-32 overflow-hidden">
            <Image
                src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2070&auto=format&fit=crop"
                alt="Atelier"
                fill
                className="object-cover"
            />
       </div>

       {/* Narrative Columns */}
       <div className="max-w-[1920px] mx-auto px-4 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-32">
            <div>
                <h3 className="font-display text-3xl mb-6">The Philosophy</h3>
                <p className="font-utility text-sm leading-8 text-neutral-600">
                    We believe in the power of the object. A bag is not merely a container; it is an extension of the self, a guardian of secrets, and a statement of intent. Our design language strips away the superfluous to reveal the essential architecture of form.
                </p>
            </div>
            <div>
                <h3 className="font-display text-3xl mb-6">The Craft</h3>
                <p className="font-utility text-sm leading-8 text-neutral-600">
                    Sourced from the finest tanneries and constructed with surgical precision, each piece is a testament to uncompromising quality. We reject varied embellishment in favor of stark, powerful silhouettes that command attention through silence.
                </p>
            </div>
       </div>

       {/* Team / Creative Direction */}
       <div className="max-w-[1920px] mx-auto px-4 md:px-12 mt-32 md:mt-48">
            <h3 className="font-display text-3xl md:text-5xl mb-16 text-center">The Maison</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { name: "Elena V.", role: "Creative Director", img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop" },
                    { name: "Adrian K.", role: "Head of Atelier", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1887&auto=format&fit=crop" },
                    { name: "Sophina M.", role: "Lead Artisan", img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop" },
                ].map((member) => (
                    <div key={member.name} className="group cursor-default">
                        <div className="relative w-full aspect-[3/4] mb-6 overflow-hidden bg-neutral-100">
                             <Image 
                                src={member.img} 
                                alt={member.name} 
                                fill 
                                className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                             />
                        </div>
                        <h4 className="font-display text-xl">{member.name}</h4>
                        <p className="font-utility text-xs text-neutral-500 uppercase tracking-widest mt-1">{member.role}</p>
                    </div>
                ))}
            </div>
       </div>

    </div>
  );
}
