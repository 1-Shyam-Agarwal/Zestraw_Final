import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Package, Truck, CheckCircle, Clock, ChevronRight, Leaf, X, Shield, CreditCard, Building, Recycle, MessageCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getUserOrders } from "@/services/operations/orderAPI";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { getProductImageSrc } from "@/lib/images";
import { getDeliveryDate } from "@/lib/utils";

const Orders = () => {
    const { token, user } = useAuth();
    const location = useLocation();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<any>(null);

    const sidebarLinks = [
        { icon: <Leaf size={14} />, label: "Impact Tracker", href: "/dashboard" },
        { icon: <Truck size={14} />, label: "Track Orders", href: "/orders" },
        { icon: <Shield size={14} />, label: "Profile Settings", href: "/profile" },
    ];

    useEffect(() => {
        const fetchOrders = async () => {
            if (token) {
                const data = await getUserOrders(token);
                setOrders(data);
            }
            setLoading(false);
        };
        fetchOrders();
    }, [token]);

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "Delivered": return <CheckCircle size={14} className="text-eco" />;
            case "Shipped": return <Truck size={14} className="text-blue-500" />;
            case "Processing": return <Package size={14} className="text-primary" />;
            default: return <Clock size={14} className="text-amber-500" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Delivered": return "bg-eco/10 text-eco border-eco/20";
            case "Shipped": return "bg-blue-50 text-blue-600 border-blue-100";
            case "Processing": return "bg-primary/10 text-primary border-primary/20";
            default: return "bg-amber-50 text-amber-600 border-amber-100";
        }
    };

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
                            <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 mt-6">
                                <div className="text-[10px] font-bold text-primary mb-1 uppercase tracking-wider">Eco Tip</div>
                                <div className="text-xs text-muted-foreground leading-relaxed">By choosing rice straw over plastic, you've saved approx. 12kg of CO2 this month!</div>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <div className="space-y-6 lg:mt-0 mt-4">
                        <div>
                            <h1 className="font-lora text-3xl font-bold text-foreground mb-1">Track Your Orders</h1>
                            <p className="text-sm text-muted-foreground italic font-medium">Monitor your eco-friendly deliveries and past sustainable choices.</p>
                        </div>

                        {loading ? (
                            <div className="flex items-center justify-center py-20">
                                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
                            </div>
                        ) : orders.length > 0 ? (
                            <div className="space-y-4">
                                {orders.map((order: any) => (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        key={order._id}
                                        className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-lg transition-all group"
                                    >
                                        <div className="p-6">
                                            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-14 h-14 bg-primary/5 rounded-2xl flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                                                        <Package className="text-primary" size={28} />
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-bold text-eco-green">Order #{order._id?.toString().slice(-8).toUpperCase()}</div>
                                                        <div className="text-xs text-muted-foreground">Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <div className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest ${getStatusColor(order.status)}`}>
                                                        {order.status === "Processing" ? (
                                                            <><Truck size={14} /> Delivery: {getDeliveryDate(2)}</>
                                                        ) : (
                                                            <>{getStatusIcon(order.status)} {order.status}</>
                                                        )}
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-lg font-black text-foreground">₹{order.totalPrice.toFixed(2)}</div>
                                                        <div className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">{order.paymentMethod}</div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="border-t border-border/50 pt-6">
                                                <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-widest text-muted-foreground mb-4">
                                                    <span>Shipment Items</span>
                                                    <span className="text-primary">{order.orderItems.length} Products</span>
                                                </div>
                                                <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                                                    {order.orderItems.map((item: any, idx: number) => (
                                                        <div key={idx} className="flex-shrink-0 w-14 h-14 bg-white border border-border rounded-lg p-1">
                                                            <img src={item.image.startsWith('http') ? item.image : getProductImageSrc(item.image)} alt={item.name} className="w-full h-full object-contain" />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-muted/20 px-6 py-4 flex justify-between items-center border-t border-border/50">
                                            <div className="flex flex-col gap-1">
                                                <p className="text-[11px] text-muted-foreground font-bold italic">
                                                    Shipping to: <span className="font-black text-foreground uppercase">{order.shippingAddress.city}</span>
                                                </p>
                                                <button
                                                    onClick={() => window.dispatchEvent(new CustomEvent('toggleChatbot'))}
                                                    className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline flex items-center gap-1.5"
                                                >
                                                    <MessageCircle size={12} strokeWidth={3} /> Have a doubt? Chat with Zestie
                                                </button>
                                            </div>
                                            <button
                                                onClick={() => setSelectedOrder(order)}
                                                className="text-xs font-black text-primary uppercase tracking-widest hover:underline flex items-center gap-1"
                                            >
                                                Details <ChevronRight size={14} />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-card border-2 border-dashed border-border rounded-3xl p-16 text-center">
                                <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Package size={32} className="text-primary/40" />
                                </div>
                                <h2 className="text-2xl font-lora font-bold text-foreground mb-2">No Orders Yet</h2>
                                <p className="text-sm text-muted-foreground mb-8 max-w-sm mx-auto italic">Start your journey towards zero plastic with our sustainable tableware collection.</p>
                                <Link to="/shop" className="inline-flex px-8 py-3 bg-primary text-white rounded-full text-xs font-black uppercase tracking-widest hover:shadow-lg hover:shadow-primary/20 transition-all">Start Shopping</Link>
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <Footer />

            {/* Order Details Modal */}
            <AnimatePresence>
                {selectedOrder && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedOrder(null)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            {/* Modal Header */}
                            <div className="p-8 border-b border-border flex items-center justify-between bg-card/50">
                                <div>
                                    <h3 className="text-xl font-bold font-lora text-foreground">Order Details</h3>
                                    <p className="text-xs text-muted-foreground mt-0.5">Order ID: #{selectedOrder._id?.toString().toUpperCase()}</p>
                                </div>
                                <button
                                    onClick={() => setSelectedOrder(null)}
                                    className="p-2.5 rounded-full hover:bg-muted transition-colors border border-border"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Modal Content */}
                            <div className="flex-1 overflow-y-auto p-8 space-y-10 no-scrollbar">
                                {/* Status & Dates */}
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                    <div className="p-4 rounded-2xl bg-muted/30 border border-border">
                                        <p className="text-[10px] uppercase font-black text-muted-foreground mb-2">Status</p>
                                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border ${getStatusColor(selectedOrder.status)}`}>
                                            {selectedOrder.status === "Processing" ? `Delivery by ${getDeliveryDate(2)}` : selectedOrder.status}
                                        </div>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-muted/30 border border-border">
                                        <p className="text-[10px] uppercase font-black text-muted-foreground mb-2">Timeline</p>
                                        <p className="text-xs font-black">{new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-muted/30 border border-border">
                                        <p className="text-[10px] uppercase font-black text-muted-foreground mb-2">Billing</p>
                                        <p className="text-xs font-black uppercase">{selectedOrder.paymentMethod}</p>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-muted/30 border border-border">
                                        <p className="text-[10px] uppercase font-black text-muted-foreground mb-2">Revenue</p>
                                        <p className="text-xs font-black text-primary">₹{selectedOrder.totalPrice.toFixed(2)}</p>
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div>
                                    <h4 className="text-[11px] font-black uppercase tracking-widest text-muted-foreground mb-5 flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary" /> Products Secured
                                    </h4>
                                    <div className="space-y-4">
                                        {selectedOrder.orderItems.map((item: any, idx: number) => (
                                            <div key={idx} className="flex items-center gap-5 p-4 rounded-2xl border border-border hover:bg-muted/10 transition-colors">
                                                <div className="w-16 h-16 bg-white border border-border rounded-lg p-1 flex-shrink-0">
                                                    <img src={item.image.startsWith('http') ? item.image : getProductImageSrc(item.image)} alt={item.name} className="w-full h-full object-contain" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-black line-clamp-1">{item.name}</p>
                                                    <div className="flex items-center gap-3 mt-1.5">
                                                        <span className="text-[10px] font-black bg-secondary px-2 py-0.5 rounded-lg uppercase">Qty: {item.quantity}</span>
                                                        {item.size && <span className="text-[10px] font-black bg-muted px-2 py-0.5 rounded-lg uppercase">{item.size}</span>}
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm font-black text-foreground">₹{(item.price * item.quantity).toFixed(2)}</p>
                                                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">₹{item.price.toFixed(2)}/unit</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Shipping & Summary */}
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="p-6 rounded-3xl border border-border bg-muted/5 flex flex-col">
                                        <h4 className="text-[11px] font-black uppercase tracking-widest text-primary mb-5 flex items-center gap-2">
                                            <Truck size={14} /> Shipping Destination
                                        </h4>
                                        <div className="space-y-1.5 text-sm flex-1">
                                            <p className="font-black text-foreground">{user?.fullName}</p>
                                            <p className="text-[11px] text-muted-foreground font-black uppercase tracking-tighter">
                                                {user?.email || user?.phoneNumber}
                                            </p>
                                            <p className="text-muted-foreground font-medium leading-relaxed italic">
                                                {selectedOrder.shippingAddress.address}<br />
                                                {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zip}<br />
                                                Republic of India
                                            </p>
                                        </div>
                                    </div>
                                    <div className="p-6 rounded-3xl border border-border bg-muted/5 flex flex-col">
                                        <h4 className="text-[11px] font-black uppercase tracking-widest text-primary mb-5 flex items-center gap-2">
                                            <Shield size={14} /> Financial Roundup
                                        </h4>
                                        <div className="space-y-3 text-[11px] font-black uppercase tracking-widest">
                                            <div className="flex justify-between text-muted-foreground">
                                                <span>Subtotal</span>
                                                <span>₹{(selectedOrder.totalPrice - selectedOrder.shippingPrice - selectedOrder.taxPrice).toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between text-muted-foreground">
                                                <span>Logistics</span>
                                                <span className="text-eco">₹{selectedOrder.shippingPrice.toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between text-muted-foreground">
                                                <span>Tax Contribution</span>
                                                <span>₹{selectedOrder.taxPrice.toFixed(2)}</span>
                                            </div>
                                            <div className="border-t border-border pt-4 flex justify-between items-center text-foreground">
                                                <span className="text-xs">Final Amount</span>
                                                <span className="text-2xl text-primary">₹{selectedOrder.totalPrice.toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Orders;
