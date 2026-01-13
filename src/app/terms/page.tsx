export default function TermsPage() {
  return (
    <div className="min-h-screen bg-canvas pt-32 pb-24 px-4 md:px-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-display text-5xl mb-12">Terms of Service</h1>
        
        <div className="prose prose-neutral font-utility text-sm leading-relaxed space-y-8">
          <section>
            <h2 className="font-display text-2xl mb-4">1. Acceptance of Terms</h2>
            <p className="text-neutral-600">
              By accessing and using the Velancis website and services, you accept and agree to be bound by the terms and provisions of this agreement.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl mb-4">2. Use of Service</h2>
            <p className="text-neutral-600">
              You agree to use our services only for lawful purposes and in accordance with these Terms. You are responsible for maintaining the confidentiality of your account information.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl mb-4">3. Products and Orders</h2>
            <p className="text-neutral-600">
              All products are subject to availability. We reserve the right to discontinue any product at any time. Prices are subject to change without notice.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl mb-4">4. Shipping and Returns</h2>
            <p className="text-neutral-600">
              Velancis offers complimentary shipping on all orders. Returns are accepted within 30 days of purchase for items in original condition.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl mb-4">5. Contact</h2>
            <p className="text-neutral-600">
              For questions about these Terms, please contact us at legal@velancis.com
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
