import { Layout } from "@/components/Layout";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Leaf, Flame, ChevronRight, ChevronDown, Target, Eye } from "lucide-react";
import { useState } from "react";
import storyHero from "@/assets/parali.webp";
import paraliImage from "@/assets/parali-crisis.jpg";
import heroTableware from "@/assets/hero-tableware.jpg";
import bgImage from "@/assets/bg.webp";

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };
const stagger = { visible: { transition: { staggerChildren: 0.15 } } };

const faqs = [
  { q: "Is there any chemical binder used in ZESTRAW?", a: "No. Our innovation lies in the 'Natural Lignin Bond'. By applying specific pressure and temperature, we activate the natural lignin within the rice straw fibers, which acts as its own binder. This makes our plates 100% chemical-free and safe for direct food contact." },
  { q: "How do you support the farmers?", a: "We purchase rice straw directly from farmers at fair market rates, providing them an alternative income source instead of burning the residue." },
  { q: "Are the products microwave and oven safe?", a: "Yes, our products are heat-resistant up to 180°C (356°F), making them safe for microwave and conventional oven use." },
];

const processSteps = [
  { icon: "🌾", step: "STEP 01", title: "Collection", desc: "We source raw rice straw directly from farmers, preventing burning." },
  { icon: "⚙️", step: "STEP 02", title: "Processing", desc: "Straw is cleaned, crushed using mechanical energy." },
  { icon: "📊", step: "STEP 03", title: "Molding", desc: "High-pressure thermo-molding creates durable, water-resistant products." },
  { icon: "✓", step: "STEP 04", title: "Quality Control", desc: "Each piece is sterilized and checked for structural integrity." },
  { icon: "🌱", step: "STEP 05", title: "Composting", desc: "After use, it returns to the earth as nutrient-rich compost in 90 days." },
];

export default function OurStoryPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <Layout>
      {/* Hero */}
      <section className="relative h-[90vh] w-full overflow-hidden">

        {/* Background Image */}
        <img
          src={storyHero}
          alt="Rice fields"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/20"></div>

        {/* Gradient Fade (optional premium touch) */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/30"></div>

        {/* Content */}
        <div className="relative z-10 flex items-center h-full">
          <div className="container mx-auto px-6">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={stagger}
              className="max-w-2xl text-white"
            >
              <motion.h1
                variants={fadeUp}
                className="text-5xl md:text-7xl font-extrabold font-lora leading-tight tracking-tight"
              >
                From Smog To{" "}
                <span className="text-primary italic mt-3 block">
                  Sustainability.
                </span>
              </motion.h1>

              <motion.p
                variants={fadeUp}
                className="mt-6 text-lg md:text-xl text-gray-200 leading-relaxed"
              >
                Transforming agricultural waste into eco-friendly solutions that
                reduce pollution and build a cleaner tomorrow.
              </motion.p>

              <motion.div variants={fadeUp} className="mt-8">
                <Link
                  to="/impact"
                  className="inline-flex items-center gap-2 px-8 py-3 rounded-full 
            bg-primary text-primary-foreground font-semibold 
            shadow-lg hover:scale-105 hover:shadow-xl 
            transition-all duration-300"
                >
                  Our Mission →
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>

      </section>

      {/* Full Screen YouTube Video Section */}
      <section className="relative w-full h-screen">

        <iframe
          className="absolute top-0 left-0 w-full h-full"
          src="https://www.youtube.com/embed/eDsNyETrhE4?si=uKJoEMvq6B-5EHGu?autoplay=1&mute=1&controls=1&rel=0"
          title="YouTube video"
          frameBorder="0"
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
        ></iframe>

      </section>

      {/* Parali Crisis */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">The Problem</span>
              <h2 className="text-3xl font-bold mt-2 mb-4">The 'Parali' Crisis</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Every year, millions of tonnes of rice straw are burnt in the fields, choking India's air with toxic gases and particulate matter. In fact, parali (rice straw) burning contributes to a staggering 40% of Delhi's air pollution during peak seasons! This air pollution is CHOKING INDIA, costing the country a whopping 9% of its GDP every year. And if that's not enough, India's plastic waste problem is just as alarming – we're talking 9.3 MILLION TONNES annually!
              </p>
              <p className="text-muted-foreground leading-relaxed">
                We believe there is a better way to treat the earth than this.
              </p>
            </div>
            <div>
              <img src={paraliImage} alt="Parali crisis" className="rounded-2xl w-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Innovation Loop */}
      <section className="py-24 bg-[#f5f5f5]">
        <div className="container mx-auto px-6 text-center">

          {/* Heading */}
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">
            The ZESTRAW Innovation Loop
          </h2>

          <p className="text-gray-600 mb-16 max-w-2xl mx-auto">
            How we transform agricultural residue into premium, food-safe tableware
            without a single chemical additive.
          </p>

          {/* Desktop Layout */}
          <div className="hidden md:flex items-start justify-between relative">

            {processSteps.map((step, index) => (
              <div
                key={step.title}
                className="flex flex-col items-center text-center max-w-[180px] relative"
              >

                {/* Circle Number */}
                <div className="w-16 h-16 rounded-full bg-[#efe5d4] flex items-center justify-center text-orange-600 font-bold text-lg mb-6">
                  {String(index + 1).padStart(2, "0")}
                </div>


                {/* Title */}
                <h3 className="font-semibold text-base mb-2">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-500 leading-relaxed">
                  {step.desc}
                </p>

                {/* Arrow */}
                {index !== processSteps.length - 1 && (
                  <span className="absolute -right-10 top-8 text-orange-500 text-xl">
                    →
                  </span>
                )}

              </div>
            ))}

          </div>

          {/* Mobile Layout */}
          <div className="md:hidden grid grid-cols-1 gap-10">
            {processSteps.map((step, index) => (
              <div
                key={step.title}
                className="flex flex-col items-center text-center"
              >

                <div className="w-14 h-14 rounded-full bg-[#efe5d4] flex items-center justify-center text-orange-600 font-bold text-lg mb-4">
                  {String(index + 1).padStart(2, "0")}
                </div>

                <span className="text-xs tracking-widest text-gray-500 font-semibold mb-1">
                  STEP {String(index + 1).padStart(2, "0")}
                </span>

                <h3 className="font-semibold text-base mb-2">
                  {step.title}
                </h3>

                <p className="text-sm text-gray-500">
                  {step.desc}
                </p>

              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Nature's Alternative */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <img src={heroTableware} alt="ZESTRAW products" className="rounded-2xl w-full object-cover" />
            <div>
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">The Solution</span>
              <h2 className="text-3xl font-bold mt-2 mb-4">At Zestraw,</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We're on a mission to shake up the world with our eco-friendly disposable tableware -  to make sustainability deliciously simple. And we're doing it with a bang! By turning India's abundant rice straw and husk into awesome, eco-friendly products, we're reducing waste, promoting sustainability, and making eco-friendly choices accessible to all.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Unlike paper, we don't cut trees. Unlike plastic, we don't last forever. Our products are designed for the circular economy—born from the soil, returning to the soil.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-secondary rounded-2xl p-8 relative overflow-hidden">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Target className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Our Mission</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                To make sustainability the easiest choice at every table. By transforming agri-waste into everyday tableware, we're fighting plastic pollution and parali burning — without a compromise.
              </p>
            </div>
            <div className="bg-secondary rounded-2xl p-8 relative overflow-hidden">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Eye className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Our Vision</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                A world where disposable doesn't mean damaging. Where every plate, every bowl, every meal is a quiet step toward a cleaner, greener planet.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-6 max-w-2xl">
          <h2 className="text-3xl font-bold text-center mb-3">Frequently Asked Questions</h2>
          <p className="text-muted-foreground text-center mb-10">Everything you need to know about our material and ethics.</p>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-border rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-accent/50 transition-colors"
                >
                  <span className="text-sm font-medium">{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5">
                    <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        className="relative py-28 bg-cover bg-center"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        {/* Orange Overlay */}
        <div className="absolute inset-0 bg-yellow-600/80"></div>

        <div className="relative container mx-auto px-6 text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Ready to join the movement?
          </h2>



          <div className="flex justify-center gap-4 mt-12">
            <Link to="/shop">
              <button className="bg-white text-black px-6 py-3 rounded-full font-semibold hover:scale-105 transition">
                Shop Now
              </button>
            </Link>

            <Link to="/bulk-orders">
              <button className="border border-white px-6 py-3 rounded-full font-semibold hover:bg-white hover:text-black transition">
                Bulk Orders
              </button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
