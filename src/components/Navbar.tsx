import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, User, Menu, X, LogOut, ChevronDown, Leaf, Truck, Recycle, Globe, Heart, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import logo from "../assets/logo.png";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

const navItems = [
  { label: "Shop", href: "/shop" },
  { label: "Our Story", href: "/our-story" },
  { label: "Impact", href: "/impact" },
  { label: "Bulk Orders", href: "/bulk-orders" },
  { label: "Marketplace", href: "/marketplace" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showLogoutAlert, setShowLogoutAlert] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (href: string) => location.pathname === href;

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    setShowLogoutAlert(false);
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 w-full ${scrolled
        ? "bg-background/80 backdrop-blur-xl shadow-lg shadow-primary/5 py-1"
        : "bg-transparent py-1"
        }`}
    >
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        {/* Left Section: Logo */}
        <div className="flex items-center gap-12">
          <Link to="/" className="relative z-10 hover:opacity-90 transition-opacity">
            <img src={logo} alt="ZESTRAW" className="w-28 md:w-32 h-auto" />
          </Link>

          {/* Center Section: Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="relative px-4 py-2 group"
              >
                <span className={`text-sm font-normal    tracking-tight transition-colors duration-300 ${isActive(item.href) ? "text-primary" : "text-foreground/70 group-hover:text-primary"
                  }`}>
                  {item.label}
                </span>
                {isActive(item.href) && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute -bottom-1 left-4 right-4 h-0.5 bg-primary rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right Section: Actions */}
        <div className="flex items-center gap-3">
          <Link to="/cart" className="relative p-2.5 bg-secondary/50 rounded-full hover:bg-secondary transition-all group" aria-label="Cart">
            <ShoppingCart className="w-5 h-5 text-foreground group-hover:scale-110 transition-transform" />
            <AnimatePresence>
              {totalItems > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-[10px] rounded-full flex items-center justify-center font-black shadow-sm"
                >
                  {totalItems}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>

          <a
            href="https://wa.me/918595643038"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 bg-green-50 rounded-full hover:bg-green-100 transition-all group"
            aria-label="WhatsApp Support"
          >
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5 text-green-600 group-hover:scale-110 transition-all"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.659 1.433 5.63 1.432h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
          </a>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 p-1 hover:bg-primary/5 rounded-lg transition-colors focus:outline-none group">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs text-primary font-bold border border-primary/20 group-hover:bg-primary/20 transition-colors">
                    {user.fullName.split(' ').map(n => n[0]).join('')}
                  </div>
                  <ChevronDown className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 mt-1 p-1 rounded-xl border-border bg-white shadow-xl">
                <div className="px-3 py-2 border-b border-border/50 mb-1">
                  <p className="text-sm font-bold text-foreground truncate">{user.fullName}</p>
                  <p className="text-[11px] text-muted-foreground truncate">{user.email}</p>
                </div>
                <div className="space-y-0.5">
                  <Link to="/dashboard">
                    <DropdownMenuItem className="cursor-pointer rounded-lg py-2 focus:bg-primary/5 focus:text-primary transition-colors">
                      <span className="text-sm font-medium">Dashboard</span>
                    </DropdownMenuItem>
                  </Link>
                  <Link to="/orders">
                    <DropdownMenuItem className="cursor-pointer rounded-lg py-2 focus:bg-primary/5 focus:text-primary transition-colors">
                      <span className="text-sm font-medium">My Orders</span>
                    </DropdownMenuItem>
                  </Link>
                  <Link to="/profile">
                    <DropdownMenuItem className="cursor-pointer rounded-lg py-2 focus:bg-primary/5 focus:text-primary transition-colors">
                      <span className="text-sm font-medium">Settings</span>
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuSeparator className="my-1 bg-border/50" />
                  <DropdownMenuItem
                    onClick={() => setShowLogoutAlert(true)}
                    className="cursor-pointer rounded-lg py-2 text-destructive focus:bg-destructive/5"
                  >
                    <span className="text-sm font-semibold">Log out</span>
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/login" className="hidden md:inline-flex items-center h-10 px-6 rounded-full bg-primary text-primary-foreground font-black text-xs uppercase tracking-widest hover:shadow-lg hover:shadow-primary/20 active:scale-95 transition-all">
              Sign in
            </Link>
          )}
          <button
            className="lg:hidden p-2.5 bg-secondary/50 rounded-full hover:bg-secondary transition-all"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            <motion.div animate={{ rotate: mobileOpen ? 90 : 0 }}>
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </motion.div>
          </button>
        </div>
      </div>

      {/* Mobile nav overlay */}
      <AnimatePresence>
        {
          mobileOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 top-[64px] bg-black/20 backdrop-blur-sm z-40 lg:hidden"
                onClick={() => setMobileOpen(false)}
              />
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed right-0 top-[64px] bottom-0 w-[85%] max-w-sm bg-background border-l border-border z-50 lg:hidden flex flex-col"
              >
                <div className="flex-1 overflow-y-auto px-6 py-8">
                  <div className="space-y-6">
                    <div>
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-4">Discover</p>
                      <nav className="space-y-2">
                        {navItems.map((item) => (
                          <Link
                            key={item.href}
                            to={item.href}
                            onClick={() => setMobileOpen(false)}
                            className={`flex items-center justify-between px-5 py-4 rounded-2xl text-base font-black transition-all ${isActive(item.href)
                              ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                              : "hover:bg-secondary/80 bg-secondary/30"
                              }`}
                          >
                            {item.label}
                          </Link>
                        ))}
                      </nav>
                    </div>

                    {user && (
                      <div className="pt-6 border-t border-border">
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-4">Member Area</p>
                        <div className="grid grid-cols-2 gap-3">
                          {[
                            { icon: <Recycle className="w-5 h-5" />, label: "Tracker", href: "/dashboard" },
                            { icon: <Truck className="w-5 h-5" />, label: "Orders", href: "/orders" },
                          ].map((item) => (
                            <Link
                              key={item.label}
                              to={item.href}
                              onClick={() => setMobileOpen(false)}
                              className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-secondary/30 border border-border group active:scale-95 transition-all"
                            >
                              <div className="p-2 bg-white rounded-xl shadow-sm group-hover:text-primary transition-colors">{item.icon}</div>
                              <span className="text-xs font-black">{item.label}</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-6 bg-secondary/20 border-t border-border mt-auto">
                  {user ? (
                    <div className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm mb-4">
                      <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-black">
                        {user.fullName[0]}
                      </div>
                      <div>
                        <p className="text-sm font-black">{user.fullName}</p>
                        <button
                          onClick={() => setShowLogoutAlert(true)}
                          className="text-[11px] font-bold text-destructive flex items-center gap-1 hover:underline"
                        >
                          <LogOut className="w-3 h-3" /> Log out
                        </button>
                      </div>
                    </div>
                  ) : (
                    <Link
                      to="/login"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center justify-center w-full h-12 bg-primary text-primary-foreground rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-primary/10"
                    >
                      Sign in to Account
                    </Link>
                  )}
                </div>
              </motion.div>
            </>
          )
        }
      </AnimatePresence >

      <AlertDialog open={showLogoutAlert} onOpenChange={setShowLogoutAlert}>
        <AlertDialogContent className="rounded-xl border-border bg-white p-0 shadow-2xl max-w-[400px] overflow-hidden">
          <div className="p-8 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <LogOut className="w-5 h-5 text-destructive" />
              <AlertDialogTitle className="font-lora text-lg font-bold text-foreground m-0">Leaving already?</AlertDialogTitle>
            </div>

            <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
              We'll be here whenever you're ready to continue your sustainable journey. See you soon!
            </p>

            <div className="space-y-3">
              <AlertDialogAction
                onClick={handleLogout}
                className="w-full py-4 bg-destructive text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:opacity-90 transition-all shadow-lg active:scale-95"
              >
                Sign out
              </AlertDialogAction>
              <AlertDialogCancel className="w-full py-4 bg-secondary text-foreground rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-secondary/80 border-none transition-all active:scale-95">
                Stay signed in
              </AlertDialogCancel>
            </div>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </header >
  );
}
