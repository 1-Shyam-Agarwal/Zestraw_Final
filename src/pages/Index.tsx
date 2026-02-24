import { Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { motion } from "framer-motion";
import { Droplets, Leaf, Shield, Flame, ChevronRight, Handshake, Flag, Recycle, Star } from "lucide-react";
import heroImage from "@/assets/hero-tableware.jpg";
import ReactCountryFlag from "react-country-flag";
import paraliImage from "@/assets/parali-crisis.jpg";
import productPlates from "@/assets/plate.png";
import productBowls from "@/assets/bowls.png";
import productTray from "@/assets/section_plate.png";
import productCombo from "@/assets/combo.png";
import cup from "@/assets/cups.png";
import cutleries from "@/assets/cutlery.png";
import riceField from "@/assets/rice-field.jpg";
import { Button } from "@/components/ui/button";
import sampleBox from "@/assets/Sample-box.webp";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.15 } },
};

const Index = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-[#fff5ed] overflow-hidden">
        <div className="container mx-auto px-4 lg:px-8 py-12 lg:py-20">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="grid lg:grid-cols-2 gap-8 items-center"
          >
            <motion.div variants={stagger}>
              <motion.h1
                variants={fadeUp}
                className="text-4xl lg:text-5xl font-normal font-lora text-foreground leading-tight  mb-6"
              >
                Where <br /> Great Meals <br /> meets<br />
                <span className="text-orange-600">Greener</span> Choices.
              </motion.h1>

              <motion.div variants={fadeUp} className="flex flex-wrap gap-6 mb-8 mt-20">
                <Link
                  to="/shop?category=ComboPack"
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-primary text-primary-foreground rounded-full font-semibold hover:bg-primary/90 transition-colors"
                >
                  Order a Sample Kit
                </Link>
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-2 px-7 py-3.5 border border-border bg-card text-foreground rounded-full font-semibold hover:bg-accent transition-colors"
                >
                  Shop Now
                </Link>
              </motion.div>

            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative"
            >
              <img
                src={heroImage}
                alt="ZESTRAW eco-friendly tableware collection"
                className="rounded-2xl shadow-lg w-full object-cover aspect-[4/3] rotate-2 shadow-[0_4px_10px_0_rgba(0,0,0,0.3)]"
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Impact in Numbers */}
      <section className="py-12">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.div
              variants={fadeUp}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto"
            >
              {[
                {
                  icon: <Leaf className="w-8 h-8 text-eco" />,
                  value: "Plastic-Free & Compostable",
                },
                {
                  icon: <Flag className="w-8 h-8 text-primary" />,
                  value: "Proudly Made in India",
                },
                {
                  icon: <Handshake className="w-8 h-8 text-eco" />,
                  value: "Supporting Local",
                },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center gap-4 p-6 border border-border rounded-2xl shadow-[0_4px_10px_0_rgba(0,0,0,0.1)]"
                >
                  <div className="w-12 h-12 rounded-full bg-eco-light flex items-center justify-center">
                    {stat.icon}
                  </div>

                  <span className="text-lg lg:text-xl font-semibold leading-snug">
                    {stat.value}
                  </span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>


      {/* Conscious Collections */}
      <section className="py-24 bg-muted/20">
        <div className="max-w-6xl mx-auto px-8 md:px-16">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <div className="flex justify-between items-end mb-10">
              <div>
                <motion.h2 variants={fadeUp} className="text-3xl font-lora font-bold text-foreground">Conscious Collections</motion.h2>
                <motion.p variants={fadeUp} className="text-muted-foreground mt-1">High-performance tableware that doesn't cost the Earth.</motion.p>
              </div>
              <motion.div variants={fadeUp}>
                <Link to="/shop" className="hidden md:inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline group">
                  View Full Catalog <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </div>
            <motion.div
              variants={fadeUp}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12"
            >
              {[
                { name: "Plates", img: productPlates, badge: "Best Seller", category: "Plates" },
                { name: "Bowls", img: productBowls, badge: "New", category: "Bowls" },
                { name: "Section-Plates", img: productTray, category: "Section Plates" },
                { name: "Cutlery", img: cutleries, category: "Cutlery" },
                { name: "Cups", img: cup, category: "Cups" },
                { name: "Combo Pack", img: productCombo, category: "ComboPack" },
              ].map((product) => (
                <Link key={product.name} to={`/shop?category=${product.category}`} className="group block">
                  <div className="relative bg-white rounded-2xl overflow-hidden border border-border/50 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1">

                    {/* Badge */}
                    {product.badge && (
                      <span className="absolute top-4 left-4 z-10 px-3 py-1 bg-primary text-white text-[11px] font-semibold rounded-full uppercase tracking-wide shadow">
                        {product.badge}
                      </span>
                    )}

                    {/* Image */}
                    <div className="aspect-[4/4] overflow-hidden">
                      <img
                        src={product.img}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    </div>

                    {/* Content */}
                    <div className="px-4 py-4 bg-white">
                      <div className="flex items-center justify-between">

                        {/* Title */}
                        <h3 className="text-lg font-semibold font-lora tracking-tight text-neutral-900 group-hover:text-primary transition-colors duration-300">
                          {product.name}
                        </h3>

                        {/* CTA */}
                        <div className="flex items-center gap-2 overflow-hidden">

                          {/* Sliding Text */}
                          <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-medium text-primary transition-all duration-500 group-hover:max-w-[90px]">
                            Shop Now
                          </span>

                          {/* Arrow */}
                          <div className="w-9 h-9 rounded-full border border-primary flex items-center justify-center group-hover:bg-primary transition-all duration-300">
                            <ChevronRight className="w-4 h-4 text-primary group-hover:text-white transition-colors duration-300" />
                          </div>

                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </motion.div>

            <div className="mt-10 text-center md:hidden">
              <Link to="/shop" className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
                View All Products <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why Choose ZESTRAW */}
      <section className="bg-card border-y border-border py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="font-playfair text-3xl font-bold font-lora text-foreground mb-2">Why Choose ZESTRAW?</h2>
            <p className="text-sm text-muted-foreground font-lora">Beyond sustainability, we deliver uncompromised quality.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {[
              { icon: <Droplets size={24} className="text-orange-500 " />, title: "Water Resistant", desc: "Engineered to withstand liquids for 3+ hours without warping." },
              { icon: <Leaf size={24} className="text-orange-500" />, title: "100% Compostable", desc: "Fully biodegradable in backyard compost within 90 days." },
              { icon: <Shield size={24} className="text-orange-500" />, title: "Chemical-Free", desc: "Food grade certified. No glues, chemical binders, or plastic coatings." },
              { icon: <Recycle size={24} className="text-orange-500" />, title: "Durable Design", desc: "Sturdy construction that resists snapping and bending." },
              { icon: <Flame size={24} className="text-orange-500" />, title: "Heat Resistant", desc: "Microwave and oven safe up to 140°C for short durations." },
            ].map((item, i) => (
              <div key={i} className="text-center space-y-3">
                <div className="flex justify-center mb-4">
                  {item.icon}
                </div>

                <div className="text-lg font-semibold text-foreground">
                  {item.title}
                </div>

                <div className="text-base text-muted-foreground leading-relaxed max-w-[220px] mx-auto">
                  {item.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Order a sample kit */}
      <section className="relative overflow-hidden bg-background py-24">

        {/* Subtle Background Accent */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/5 via-transparent to-accent/10" />

        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-16">

            {/* Left Content */}
            <div className="space-y-8">

              {/* Heading */}
              <h2 className="text-4xl md:text-6xl font-bold leading-tight">
                Not sure yet?
                <span className="block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent py-8">
                  Good — we've got a box for that.
                </span>
              </h2>

              {/* Subtext */}


              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/shop?category=ComboPack">
                  <Button size="lg" className="px-8 text-base">
                    Order a Sample Kit
                  </Button>
                </Link>

              </div>


            </div>

            {/* Right Product Display */}
            <div className="relative flex justify-center">

              {/* Decorative Glow */}
              <div className="absolute w-72 h-72 bg-primary/10 rounded-full blur-3xl -z-10" />

              {/* Product Card */}
              <div className=" p-8 backdrop-blur-sm">
                <img
                  src={sampleBox}
                  alt="Sample Kit"
                  className="w-full max-w-md mx-auto drop-shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>




    </Layout>
  );
};

export default Index;
