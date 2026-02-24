import { Link, useLocation } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Leaf, Recycle, Download, Shield, Truck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { getUserOrders } from "@/services/operations/orderAPI";

const Dashboard = () => {
  const { user, token } = useAuth();
  const location = useLocation();
  const [eventGuests, setEventGuests] = useState(150);
  const [mealCourses, setMealCourses] = useState(3);
  const potentialSaving = (eventGuests * mealCourses * 0.0084).toFixed(1);

  const [chartData, setChartData] = useState<any[]>([]);
  const [impactStats, setImpactStats] = useState({
    co2Saved: 0,
    paraliRepurposed: 0,
    plasticAvoided: 0,
    orderCount: 0
  });

  useEffect(() => {
    const fetchImpactData = async () => {
      if (token) {
        const orders = await getUserOrders(token);
        if (orders && Array.isArray(orders)) {
          let co2 = 0;
          let parali = 0;
          let plastic = 0;

          // Process stats for cards
          orders.forEach(order => {
            order.orderItems.forEach(item => {
              const quantity = item.quantity || 0;
              const size = parseInt(item.size) || 1;
              const totalUnits = quantity * size;
              co2 += totalUnits * 84; // 84g saved per unit
              parali += totalUnits * 150; // 150g repurposed per unit
              plastic += totalUnits;
            });
          });

          setImpactStats({
            co2Saved: co2,
            paraliRepurposed: parali,
            plasticAvoided: plastic,
            orderCount: orders.length
          });

          // Process data for graph (last 6 months)
          const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
          const last6 = [];
          for (let i = 5; i >= 0; i--) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            last6.push({
              name: months[d.getMonth()],
              month: d.getMonth(),
              year: d.getFullYear(),
              co2: 0,
              parali: 0
            });
          }

          orders.forEach(order => {
            const orderDate = new Date(order.createdAt);
            const orderMonth = orderDate.getMonth();
            const orderYear = orderDate.getFullYear();

            const monthData = last6.find(m => m.month === orderMonth && m.year === orderYear);
            if (monthData) {
              order.orderItems.forEach(item => {
                const units = (item.quantity || 0) * (parseInt(item.size) || 1);
                monthData.co2 += units * 84;
                monthData.parali += units * 150;
              });
            }
          });

          setChartData(last6);
        }
      }
    };
    fetchImpactData();
  }, [token]);

  const statsProps = [
    {
      label: "CO₂ Emissions Saved",
      icon: <Leaf size={16} className="text-secondary" />,
      value: `${impactStats.co2Saved.toLocaleString()} g`,
      sub: `Equivalent to planting ${Math.floor(impactStats.co2Saved / 20000)} trees`,
      change: impactStats.orderCount > 0 ? `+${(impactStats.orderCount * 5)}% vs last month` : "0% growth"
    },
    {
      label: "Parali Repurposed",
      icon: <Recycle size={16} className="text-secondary" />,
      value: `${impactStats.paraliRepurposed.toLocaleString()} g`,
      sub: "Rice straw diverted from burning",
      change: impactStats.orderCount > 0 ? `+${(impactStats.orderCount * 3)}% vs last month` : "0% growth"
    },
    {
      label: "Plastic Plates Displaced",
      icon: <Shield size={16} className="text-secondary" />,
      value: `${impactStats.plasticAvoided.toLocaleString()} units`,
      sub: "Keeping our oceans cleaner",
      change: ""
    },
  ];

  const sidebarLinks = [
    { label: "Impact Tracker", icon: <Leaf size={18} />, href: "/dashboard" },
    { label: "Track Orders", icon: <Truck size={18} />, href: "/orders" },
    { label: "Profile Settings", icon: <Shield size={18} />, href: "/profile" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
          {/* Sidebar */}
          <aside className="hidden lg:block">
            <div className="bg-white border border-border rounded-2xl p-6 sticky top-24 z-10 shadow-sm">
              <div className="flex items-center gap-3 mb-8 px-2">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                  {user?.fullName?.[0] || 'U'}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold truncate max-w-[150px]">{user?.fullName || 'User'}</span>
                  <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Account Active</span>
                </div>
              </div>
              <nav className="space-y-1">
                {sidebarLinks.map((item) => (
                  <Link
                    key={item.label}
                    to={item.href}
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${location.pathname === item.href ? "bg-primary text-white shadow-md shadow-primary/20" : "text-muted-foreground hover:bg-warm-sand hover:text-foreground"}`}
                  >
                    {item.icon} {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <div className="space-y-6">
            <div>
              <h1 className="font-lora text-3xl font-bold text-foreground mb-1">Your Environmental Impact</h1>
              <p className="text-sm text-muted-foreground italic font-medium">Tracking your journey towards a circular economy and plastic-free dining.</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {statsProps.map((stat, i) => (
                <div key={i} className="bg-card border border-border rounded-2xl p-6 group hover:border-primary/50 transition-colors shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</span>
                    <div className="p-1.5 bg-primary/5 rounded-lg">{stat.icon}</div>
                  </div>
                  <div className="font-lora text-2xl font-bold text-foreground mb-1">{stat.value}</div>
                  <p className="text-[11px] text-muted-foreground font-medium">{stat.sub}</p>
                  {stat.change && <div className="text-[11px] text-primary font-bold mt-2 flex items-center gap-1">↗ {stat.change} <span className="text-muted-foreground">growth</span></div>}
                </div>
              ))}
            </div>

            {/* Chart */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
                <div>
                  <h2 className="font-lora text-xl font-bold text-foreground">Sustainability Progress</h2>
                  <p className="text-xs text-muted-foreground font-medium italic">Monthly growth in your eco-footprint</p>
                </div>

                {/* Legend */}
                <div className="flex items-center gap-4 bg-muted/30 px-4 py-2 rounded-full border border-border whitespace-nowrap">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none">CO₂ (g)</span>
                  </div>
                  <div className="flex items-center gap-1.5 border-l border-border pl-4">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#8fb339]" />
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none">Parali (g)</span>
                  </div>
                </div>
              </div>

              <div className="relative h-64 w-full group pt-8 pb-10 pr-10 pl-12">
                {/* Y-Axis Labels */}
                <div className="absolute left-0 top-8 bottom-10 flex flex-col justify-between text-[9px] font-black text-muted-foreground/60 w-10 text-right pr-2 uppercase">
                  <span>{Math.max(100, Math.ceil(Math.max(...chartData.map(d => Math.max(d.co2, d.parali))) / 100) * 100).toLocaleString()}</span>
                  <span>{(Math.max(100, Math.ceil(Math.max(...chartData.map(d => Math.max(d.co2, d.parali))) / 100) * 100) / 2).toLocaleString()}</span>
                  <span>0</span>
                </div>

                <svg viewBox="0 0 600 180" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                  {/* Grid Lines */}
                  <line x1="0" y1="0" x2="600" y2="0" stroke="hsl(var(--border))" strokeOpacity="0.3" strokeDasharray="4 4" />
                  <line x1="0" y1="90" x2="600" y2="90" stroke="hsl(var(--border))" strokeOpacity="0.3" strokeDasharray="4 4" />
                  <line x1="0" y1="180" x2="600" y2="180" stroke="hsl(var(--border))" strokeWidth="2" />

                  {/* X-Axis Labels */}
                  {chartData.map((d, i) => (
                    <text key={i} x={50 + i * 100} y="205" textAnchor="middle" className="fill-muted-foreground/80 text-[10px] uppercase font-black tracking-widest">{d.name}</text>
                  ))}

                  {/* CO2 Line & Area */}
                  {chartData.length > 0 && (
                    <>
                      <defs>
                        <linearGradient id="grad-co2" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.2" />
                          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <motion.path
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 2 }}
                        d={`M ${chartData.map((d, i) => `${50 + i * 100},${180 - Math.min(170, (d.co2 / Math.max(10, Math.ceil(Math.max(...chartData.map(d => Math.max(d.co2, d.parali))) / 5) * 5)) * 170)}`).join(' L ')}`}
                        fill="none"
                        stroke="hsl(var(--primary))"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <motion.path
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                        d={`M 50,180 L ${chartData.map((d, i) => `${50 + i * 100},${180 - Math.min(170, (d.co2 / Math.max(10, Math.ceil(Math.max(...chartData.map(d => Math.max(d.co2, d.parali))) / 5) * 5)) * 170)}`).join(' L ')} L ${50 + (chartData.length - 1) * 100},180 Z`}
                        fill="url(#grad-co2)"
                      />
                    </>
                  )}

                  {/* Parali Line */}
                  {chartData.length > 0 && (
                    <motion.path
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 2, delay: 0.5 }}
                      d={`M ${chartData.map((d, i) => `${50 + i * 100},${180 - Math.min(170, (d.parali / Math.max(10, Math.ceil(Math.max(...chartData.map(d => Math.max(d.co2, d.parali))) / 5) * 5)) * 170)}`).join(' L ')}`}
                      fill="none"
                      stroke="#8fb339"
                      strokeWidth="3"
                      strokeDasharray="6 4"
                      strokeLinecap="round"
                    />
                  )}
                </svg>
              </div>
            </div>

            {/* Calculator */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 pointer-events-none" />
              <h2 className="font-lora text-xl font-bold text-foreground mb-2">Plan Your Next Eco-Event</h2>
              <p className="text-sm text-muted-foreground mb-8">Measure the green impact of your upcoming gathering.</p>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block" htmlFor="eventGuests">Expected Guests</label>
                    <input
                      id="eventGuests"
                      type="number"
                      value={eventGuests}
                      onChange={(e) => setEventGuests(Number(e.target.value))}
                      className="w-full text-sm px-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block" htmlFor="mealCourses">Meal Courses</label>
                    <input
                      id="mealCourses"
                      type="number"
                      value={mealCourses}
                      onChange={(e) => setMealCourses(Number(e.target.value))}
                      className="w-full text-sm px-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    />
                  </div>
                  <button
                    onClick={() => { setEventGuests(150); setMealCourses(3); }}
                    className="w-full bg-primary text-white font-bold py-4 rounded-xl hover:shadow-lg hover:shadow-primary/20 active:scale-95 transition-all text-sm uppercase tracking-widest leading-none outline-none"
                  >
                    Reset Calculator
                  </button>
                </div>

                <div className="bg-primary/10 border border-primary/20 rounded-2xl p-8 flex flex-col items-center justify-center text-center shadow-inner">
                  <Leaf size={40} className="text-primary mb-3 animate-pulse" />
                  <div className="text-[10px] text-primary/70 mb-1 font-black uppercase tracking-tighter">Projected Plastic Saving</div>
                  <div className="font-lora text-5xl font-bold text-primary">{potentialSaving} kg</div>
                  <div className="text-xs text-muted-foreground mt-4 font-medium max-w-[200px]">
                    Switching to ZESTRAW will divert this much waste from landfills.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
