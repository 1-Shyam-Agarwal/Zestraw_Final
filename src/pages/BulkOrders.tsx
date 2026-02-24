import { Layout } from "@/components/Layout";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";
import { ChevronRight, Leaf, Truck, BarChart3 } from "lucide-react";
import wholesaleHero from "@/assets/bulkorder.webp";

import { validateEmail } from "@/lib/utils";

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };

const pricingTiers = [
  { category: "Standard Plates (6, 8, 10 inch)", moq: "5,000 Units", lead: "10-14 Days", price: "₹2.50 - ₹6.00" },
  { category: "Deep Bowls (250ml - 500ml)", moq: "3,500 Units", lead: "10-12 Days", price: "₹3.00 - ₹7.50" },
  { category: "Compartment Trays", moq: "3,000 Units", lead: "20-24 Days", price: "₹6.00 - ₹12.00" },
  { category: "Custom Molds & Sizes", moq: "25,000 Units", lead: "45-60 Days", price: "Custom Quote" },
];

export default function BulkOrdersPage() {
  const [formData, setFormData] = useState({
    businessName: "", businessType: "", fullName: "", email: "",
    volume: "", leadTime: "", products: [] as string[], customDesign: false, brandingReqs: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic required field validation
    if (!formData.businessName || !formData.fullName || !formData.email || !formData.volume) {
      toast.error("Incomplete Inquiry", {
        description: "Please provide your business name, contact info, and expected volume."
      });
      return;
    }

    // Email format validation
    if (!validateEmail(formData.email)) {
      toast.error("Invalid Business Email", {
        description: "Please enter a valid work email address (e.g., name@company.com).",
      });
      return;
    }

    // Product selection validation
    if (formData.products.length === 0) {
      toast.error("Product Interest Required", {
        description: "Please select at least one product category you are interested in."
      });
      return;
    }

    setLoading(true);
    // Simulate enterprise API call
    await new Promise(r => setTimeout(r, 2000));
    setLoading(false);

    toast.success("Inquiry Submitted Successfully!", {
      description: "Our enterprise team will review your proposal and contact you within 24 hours.",
      duration: 5000
    });

    // Reset form after success
    setFormData({
      businessName: "", businessType: "", fullName: "", email: "",
      volume: "", leadTime: "", products: [], customDesign: false, brandingReqs: "",
    });
  };

  const toggleProduct = (product: string) => {
    setFormData(prev => ({
      ...prev,
      products: prev.products.includes(product) ? prev.products.filter(p => p !== product) : [...prev.products, product],
    }));
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-secondary py-20">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap--2 items-center">

            {/* Left Content */}
            <div className="max-w-xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Elevate Your Brand with{" "}
                <span className="text-gradient-primary">
                  Eco-Conscious
                </span>{" "}
                Dining.
              </h1>

              <p className="text-muted-foreground mb-8">
                Amplify your sustainability efforts with ZESTRAW's premium
                rice-straw tableware. Custom-branded, biodegradable, and designed
                for the high-volume demands of modern hospitality.
              </p>

              <div className="flex flex-wrap gap-4">
                <a
                  href="#quote-form"
                  className="px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold text-sm"
                >
                  Request Enterprise Quote
                </a>

                <button className="px-6 py-3 rounded-full border border-border font-semibold text-sm hover:bg-accent transition-colors">
                  ↓ Download B2B Catalog
                </button>
              </div>

              <p className="text-xs text-muted-foreground mt-5">
                Trusted by <strong>20+</strong> Hotels & Restaurants across India
              </p>
            </div>

            {/* Right Image */}
            <div className="relative">
              <img
                src={wholesaleHero}
                alt="Wholesale dining"
                className="w-full h-[400px] md:h-[500px] object-cover rounded-3xl"
              />
            </div>

          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <Truck className="w-6 h-6" />, title: "Enterprise Logistics", desc: "Reliable supply with fixed delivery times. Storage options and regular deliveries to keep your business running smoothly." },
              { icon: <Leaf className="w-6 h-6" />, title: "Custom Branding", desc: "Add your logo with laser or mold printing. Turn your tableware into a strong brand identity for your customers." },
              { icon: <BarChart3 className="w-6 h-6" />, title: "Impact Reporting", desc: "Get quarterly reports showing your CO₂ reduction and parali impact based on your order volume." },
            ].map((f) => (
              <div key={f.title} className="text-center">
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-primary mx-auto mb-4">{f.icon}</div>
                <h3 className="font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote Form */}
      <section id="quote-form" className="py-16">
        <div className="container mx-auto px-6 max-w-2xl">
          <div className="bg-card rounded-2xl border border-border p-8">
            <h2 className="text-2xl font-bold text-center mb-2">Request a Wholesale Quote</h2>
            <p className="text-sm text-muted-foreground text-center mb-8">Our enterprise team will get back to you with a custom proposal within 24 hours.</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Business Name</label>
                  <input type="text" placeholder="e.g. Green Earth Hotels" value={formData.businessName}
                    onChange={(e) => setFormData(p => ({ ...p, businessName: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Business Type</label>
                  <input type="text" placeholder="e.g. Hotel Chain" value={formData.businessType}
                    onChange={(e) => setFormData(p => ({ ...p, businessType: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Full Name</label>
                  <input type="text" placeholder="Jane Doe" value={formData.fullName}
                    onChange={(e) => setFormData(p => ({ ...p, fullName: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Work Email</label>
                  <input type="email" placeholder="jane@company.com" value={formData.email}
                    onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Est. Monthly Volume</label>
                  <input type="text" placeholder="e.g. 5000" value={formData.volume}
                    onChange={(e) => setFormData(p => ({ ...p, volume: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Preferred Lead Time</label>
                  <input type="text" placeholder="e.g. Under 3 weeks" value={formData.leadTime}
                    onChange={(e) => setFormData(p => ({ ...p, leadTime: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Products of Interest</label>
                <div className="flex flex-wrap gap-3">
                  {["Plates", "Bowls", "Trays", "Cutlery"].map((p) => (
                    <label key={p} className="flex items-center gap-2 text-sm cursor-pointer">
                      <input type="checkbox" checked={formData.products.includes(p)} onChange={() => toggleProduct(p)} className="w-4 h-4 rounded border-border text-primary" />
                      {p}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm cursor-pointer mb-2">
                  <input type="checkbox" checked={formData.customDesign} onChange={(e) => setFormData(p => ({ ...p, customDesign: e.target.checked }))} className="w-4 h-4 rounded border-border text-primary" />
                  I'm interested in custom logo embossing
                </label>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Branding Requirements</label>
                <textarea
                  placeholder="Tell us about your specific needs or branding requirements..."
                  value={formData.brandingReqs}
                  onChange={(e) => setFormData(p => ({ ...p, brandingReqs: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-60"
              >
                {loading ? <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" /> : "Submit Inquiry"}
              </button>
              <p className="text-[10px] text-muted-foreground text-center">By submitting, you agree to our B2B Privacy Policy and Terms of Service.</p>
            </form>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary py-16 text-center">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-primary-foreground mb-4">Ready to make the switch?</h2>
          <p className="text-primary-foreground/80 mb-8 max-w-md mx-auto">Join the growing network of conscious hospitality leaders in India. Let's build a greener future, one plate at a time.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/shop" className="px-6 py-3 rounded-full bg-card text-foreground font-semibold text-sm">Contact Sales Team</Link>
            <button className="px-6 py-3 rounded-full border border-primary-foreground/30 text-primary-foreground font-semibold text-sm">Live Chat</button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
