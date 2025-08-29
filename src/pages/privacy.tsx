// PokeTeko – Customer Service Pages
// Framework-agnostic React pages using Tailwind + shadcn/ui classes
// Split these into /privacy, /terms, and /shipping routes as needed.
// Last updated: 2025-08-29

import React from "react";
import { Separator } from "@/components/ui/separator";
import { HashLink } from 'react-router-hash-link';

/* ========================= PRIVACY POLICY ========================= */
export const PrivacyPolicy: React.FC = () => {
  return (
    <main className="container mx-auto max-w-3xl px-4 py-12 text-foreground">
      <h1 className="text-3xl md:text-4xl font-bold">Privacy Policy</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: August 29, 2025</p>

      <Separator className="my-6" />

      <section className="space-y-4">
        <p>
          This Privacy Policy explains how <strong>PokeTeko</strong> ("we", "us", or "our")
          collects, uses, and shares information when you visit or make a purchase from our
          website. We are committed to handling your information responsibly and transparently.
        </p>

        <h2 id="info-we-collect" className="text-xl font-semibold">Information We Collect</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Email address</strong>: collected when you create an account, place an order,
            or contact us. We use this to send order confirmations/updates and respond to support
            requests.
          </li>
          <li>
            <strong>Checkout details used to fulfill a purchase</strong> (e.g., shipping name,
            address, and payment method details): these are <em>used only for the transaction</em>
            and fulfillment and are <em>not stored</em> by us beyond what is required to complete
            the order and maintain basic records required by law or our payment processor.
          </li>
          <li>
            <strong>Technical essentials</strong>: like session cookies needed for cart and checkout
            to function. We do not use advertising cookies.
          </li>
        </ul>

        <h2 id="how-we-use" className="text-xl font-semibold">How We Use Information</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>To process and fulfill orders, including shipping and delivery updates.</li>
          <li>To communicate with you about your orders or support inquiries.</li>
          <li>To maintain the security and integrity of our website and checkout.</li>
        </ul>

        <h2 id="third-parties" className="text-xl font-semibold">Third-Party Services</h2>
        <p>We share information with trusted providers strictly to operate our store:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Stripe</strong> – secure payment processing. Your payment details are sent
            directly to Stripe and are not stored on our servers.</li>
          <li><strong>Supabase</strong> – database and authentication services for account and order
            data we need to operate the store.</li>
          <li><strong>Printful</strong> – on-demand apparel production and fulfillment. We provide
            order details required to make and ship your apparel purchases.</li>
          <li><strong>PSA</strong> – card-related fulfillment. We provide the minimum details needed
            to complete and ship card-related orders.</li>
        </ul>
        <p>
          These providers process your data pursuant to their own privacy policies. We only transmit
          the minimum information necessary to provide the requested service.
        </p>

        <h2 id="retention" className="text-xl font-semibold">Data Retention</h2>
        <p>
          We retain email addresses and essential order records as needed for our legitimate
          business purposes (such as support, bookkeeping, and legal compliance). We do not store
          payment card numbers. Shipping and payment details submitted at checkout are used
          transiently for the transaction.
        </p>

        <h2 id="your-rights" className="text-xl font-semibold">Your Rights</h2>
        <p>
          Depending on your location, you may have rights to access, correct, or delete your
          information. To exercise these rights, please reach out via our
          <HashLink to="/services#contact" className="text-primary underline"> Contact Us</HashLink>
          page. We will verify your request and respond within a reasonable time.
        </p>

        <h2 id="security" className="text-xl font-semibold">Security</h2>
        <p>
          We use reasonable administrative, technical, and physical safeguards to protect your
          information. No method of transmission or storage is 100% secure, and we cannot guarantee
          absolute security.
        </p>

        <h2 id="children" className="text-xl font-semibold">Children’s Privacy</h2>
        <p>
          Our site is available for general audiences and has no special restrictions; however,
          purchases must be made by adults or with parental consent.
        </p>

        <h2 id="changes" className="text-xl font-semibold">Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy to reflect operational, legal, or regulatory changes.
          The updated version will be posted here with a new “Last updated” date.
        </p>

        <h2 id="contact" className="text-xl font-semibold">Contact</h2>
        <p>
          Questions? Head to <HashLink to="/services#contact" className="text-primary underline">Contact Us</HashLink>.
        </p>
      </section>
    </main>
  );
};

/* ========================= TERMS OF SERVICE ========================= */
export const TermsOfService: React.FC = () => {
  return (
    <main className="container mx-auto max-w-3xl px-4 py-12 text-foreground">
      <h1 className="text-3xl md:text-4xl font-bold">Terms of Service</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: August 29, 2025</p>

      <Separator className="my-6" />

      <section className="space-y-4">
        <p>
          Welcome to <strong>PokeTeko</strong>. By accessing or using our website and services,
          you agree to these Terms of Service ("Terms"). If you do not agree, please do not use the
          site.
        </p>

        <h2 id="use" className="text-xl font-semibold">Use of the Site</h2>
        <p>
          There are no special restrictions on browsing or using the site. You agree not to use the
          site in any unlawful or harmful manner and to respect others’ rights.
        </p>

        <h2 id="products" className="text-xl font-semibold">Products, Orders & Pricing</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>We sell Pokémon cards and Pokémon-themed apparel.</li>
          <li>All prices are shown in USD and are subject to change without notice.</li>
          <li>
            We reserve the right to refuse or cancel any order for reasons including suspected
            fraud, inventory issues, or errors. If your order is cancelled after your card has been
            charged, we will issue a prompt refund.
          </li>
          <li>Taxes and shipping fees are calculated at checkout when applicable.</li>
        </ul>

        <h2 id="shipping" className="text-xl font-semibold">Shipping & Risk of Loss</h2>
        <p>
          Title and risk of loss pass to you when we deliver the order to the carrier. We are not
          liable for delays, loss, or damage that occur in transit. Please consider using tracked
          and/or insured shipping options at checkout.
        </p>

        <h2 id="returns" className="text-xl font-semibold">Returns & Refunds</h2>
        <p>
          We do not accept returns and do not offer refunds <em>unless</em> the issue is our fault
          (for example, an order mix-up or we shipped the wrong item). See our
          <HashLink to="/shipping#returns" className="text-primary underline"> Shipping, Returns & Refunds</HashLink>
          page for details and how to report a problem.
        </p>

        <h2 id="third-parties" className="text-xl font-semibold">Third-Party Services</h2>
        <p>
          We use Stripe for payments; Supabase for database/auth; Printful for apparel fulfillment;
          and PSA for card fulfillment. Your use of those services may be subject to their terms and
          policies.
        </p>

        <h2 id="ip" className="text-xl font-semibold">Intellectual Property</h2>
        <p>
          All content on this site (text, images, logos, etc.) is owned by PokeTeko or its
          licensors and is protected by applicable laws. Pokémon, Nintendo, and Game Freak are
          trademarks of their respective owners. PokeTeko is not affiliated with or endorsed by
          Nintendo/Game Freak/The Pokémon Company.
        </p>

        <h2 id="disclaimers" className="text-xl font-semibold">Disclaimers & Limitation of Liability</h2>
        <p>
          To the fullest extent permitted by law, our site and products are provided "as is" without
          warranties of any kind. PokeTeko will not be liable for any indirect, incidental,
          consequential, or punitive damages arising from your use of the site or products.
        </p>

        <h2 id="law" className="text-xl font-semibold">Governing Law</h2>
        <p>
          These Terms are governed by the laws of the State of California, without regard to its
          conflict of law rules, and applicable U.S. federal law. Venue for disputes will be the
          state or federal courts located in Alameda County, California.
        </p>

        <h2 id="changes" className="text-xl font-semibold">Changes to the Terms</h2>
        <p>
          We may update these Terms from time to time. Continued use after changes take effect means
          you accept the revised Terms.
        </p>

        <h2 id="contact" className="text-xl font-semibold">Contact</h2>
        <p>
          For questions about these Terms, please reach out via our
          <HashLink to="/services#contact" className="text-primary underline"> Contact Us</HashLink> page.
        </p>
      </section>
    </main>
  );
};

/* ============ SHIPPING, RETURNS & REFUNDS (incl. fulfillment) ============ */
export const ShippingReturns: React.FC = () => {
  return (
    <main className="container mx-auto max-w-3xl px-4 py-12 text-foreground">
      <h1 className="text-3xl md:text-4xl font-bold">Shipping, Returns & Refunds</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: August 29, 2025</p>

      <Separator className="my-6" />

      <nav className="mb-6">
        <ul className="flex flex-wrap gap-3 text-sm">
          <li><HashLink to="#shipping" className="underline text-primary">Shipping</HashLink></li>
          <li><HashLink to="#fulfillment" className="underline text-primary">Fulfillment Partners</HashLink></li>
          <li><HashLink to="#returns" className="underline text-primary">Returns</HashLink></li>
          <li><HashLink to="#report-issue" className="underline text-primary">Report an Issue</HashLink></li>
        </ul>
      </nav>

      <section id="shipping" className="space-y-4">
        <h2 className="text-xl font-semibold">Shipping</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Shipping methods and rates are displayed at checkout.</li>
          <li>Processing time: most in-stock items ship within 2–4 business days.</li>
          <li>
            Tracking: most orders include tracking. You will receive an email with tracking details
            once your order ships.
          </li>
          <li>
            Risk of loss passes to you when we hand your package to the carrier. We are not liable
            for delays, loss, or damage that occur in transit.
          </li>
          <li>
            International orders (if offered) may be subject to customs duties/taxes payable by the
            recipient.
          </li>
        </ul>
      </section>

      <section id="fulfillment" className="space-y-4 mt-8">
        <h2 className="text-xl font-semibold">Fulfillment Partners</h2>
        <p>
          We partner with trusted providers to fulfill certain products:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Printful</strong> handles production and shipment of apparel. Apparel items may
            ship separately from card orders.
          </li>
          <li>
            <strong>PSA</strong> assists with card-related fulfillment. Lead times may vary based on
            product type and availability.
          </li>
        </ul>
      </section>

      <section id="returns" className="space-y-4 mt-8">
        <h2 className="text-xl font-semibold">Returns & Refunds</h2>
        <p>
          We do not accept returns and do not offer refunds <em>unless</em> the issue is our fault
          (e.g., an order mix-up or we shipped the wrong item). If we determine the issue was on our
          end, we will either send the correct replacement or issue a refund at our discretion.
        </p>
        <p>
          Transit issues (delay, loss, or damage) are the responsibility of the carrier. Please
          consider insured shipping options at checkout. If a package is marked delivered but you did
          not receive it, contact the carrier first and then reach out to us with the case number.
        </p>
        <p>
          <strong>Non-returnable/non-refundable items include:</strong> correctly fulfilled card
          orders, correctly fulfilled apparel, custom or made-to-order items, and any opened
          products.
        </p>
      </section>

      <section id="report-issue" className="space-y-4 mt-8">
        <h2 className="text-xl font-semibold">How to Report an Issue (Order Mix-up)</h2>
        <ol className="list-decimal pl-6 space-y-2">
          <li>Contact us within 7 days of delivery with your order number.</li>
          <li>Include clear photos of the items received and the packing slip.</li>
          <li>
            Keep all packaging until we confirm next steps. If we are at fault, we will provide a
            prepaid return label (if a return is required) or ship a replacement.
          </li>
        </ol>
        <p>
          Start here: <HashLink to="/services#contact" className="text-primary underline">Contact Us</HashLink>.
        </p>
      </section>

      <Separator className="my-8" />

      <section className="space-y-2 text-xs text-muted-foreground">
        <p>
          Note: Some regions provide consumer rights that cannot be waived. Nothing in this page is
          intended to limit rights you may have under applicable law.
        </p>
      </section>
    </main>
  );
};

/* ========================= USAGE NOTES ========================= */
// Example Next.js route files:
//  - app/privacy/page.tsx: export { PrivacyPolicy as default } from "@/app/(routes)/legal-pages";
//  - app/terms/page.tsx:   export { TermsOfService as default } from "@/app/(routes)/legal-pages";
//  - app/shipping/page.tsx: export { ShippingReturns as default } from "@/app/(routes)/legal-pages";

export default PrivacyPolicy;
