export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-canvas pt-32 pb-24 px-4 md:px-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-display text-5xl mb-12">Privacy Policy</h1>
        
        <div className="prose prose-neutral font-utility text-sm leading-relaxed space-y-8">
          <section>
            <h2 className="font-display text-2xl mb-4">Information We Collect</h2>
            <p className="text-neutral-600">
              We collect information you provide directly to us, including name, email address, shipping address, and payment information when you make a purchase.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl mb-4">How We Use Your Information</h2>
            <p className="text-neutral-600">
              We use the information we collect to process transactions, send order confirmations, respond to your requests, and improve our services.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl mb-4">Information Sharing</h2>
            <p className="text-neutral-600">
              We do not sell, trade, or otherwise transfer your personal information to outside parties except as necessary to fulfill your orders and provide our services.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl mb-4">Security</h2>
            <p className="text-neutral-600">
              We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl mb-4">Contact Us</h2>
            <p className="text-neutral-600">
              If you have questions about this Privacy Policy, please contact us at privacy@velancis.com
            </p>
          </section>
        </div>

        <p className="font-utility text-xs text-neutral-400 uppercase tracking-widest mt-16">
          Last updated: January 2026
        </p>
      </div>
    </div>
  );
}
