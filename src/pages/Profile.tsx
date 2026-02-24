import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { User, Mail, MapPin, Shield, CheckCircle2, Leaf, Truck, Recycle, ArrowRight, Save, Key } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { updateProfile, changePassword } from "@/services/operations/authAPI";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Profile = () => {
    const { user, token, setAuth } = useAuth();
    const location = useLocation();
    const [loading, setLoading] = useState(false);

    // Profile State
    const [profileData, setProfileData] = useState({
        fullName: user?.fullName || "",
        email: user?.email || "",
        phoneNumber: user?.phoneNumber || "",
        shippingAddress: {
            address: user?.shippingAddress?.address || "",
            city: user?.shippingAddress?.city || "",
            state: user?.shippingAddress?.state || "",
            zip: user?.shippingAddress?.zip || ""
        }
    });

    // Password State
    const [passwords, setPasswords] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    const sidebarLinks = [
        { icon: <Leaf size={14} />, label: "Impact Tracker", href: "/dashboard" },
        { icon: <Truck size={14} />, label: "Track Orders", href: "/orders" },
        { icon: <Shield size={14} />, label: "Profile Settings", href: "/profile" },
    ];

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const success = await updateProfile(token, profileData, setAuth);
        setLoading(false);
    };

    const handlePasswordUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwords.newPassword !== passwords.confirmPassword) {
            return; // In real app, show error toast
        }
        setLoading(true);
        await changePassword(token, {
            currentPassword: passwords.currentPassword,
            newPassword: passwords.newPassword
        });
        setLoading(false);
        setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
    };

    return (
        <div className="min-h-screen flex flex-col bg-[#fffaf5]">
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
                                    <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Verified Account</span>
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
                    <div className="max-w-3xl mx-auto w-full space-y-4">
                        <div className="flex items-baseline justify-between mb-2">
                            <h1 className="font-lora text-2xl font-bold text-foreground">Account Settings</h1>
                            <p className="text-[10px] text-muted-foreground font-medium italic">Manage your profile & security</p>
                        </div>

                        <div className="space-y-4">
                            {/* Personal Details */}
                            <section className="bg-white border border-border/50 rounded-2xl p-5 shadow-sm">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-8 h-8 bg-primary/5 rounded-lg flex items-center justify-center">
                                        <User className="text-primary" size={16} />
                                    </div>
                                    <h2 className="font-lora text-lg font-bold leading-tight">Personal Details</h2>
                                </div>

                                <form onSubmit={handleProfileUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground/80 px-1">Full Name</label>
                                        <Input
                                            value={profileData.fullName}
                                            onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                                            className="bg-neutral-50/50 border-neutral-200 rounded-xl h-10 focus:ring-primary/20 font-medium text-sm"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground/80 px-1">Email Address</label>
                                        <div className="relative">
                                            <Input disabled value={profileData.email || "Not Provided"} className="bg-neutral-50 border-neutral-200/60 rounded-xl h-10 cursor-not-allowed opacity-70 font-medium text-sm" />
                                            {profileData.email && (
                                                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                                    <CheckCircle2 size={12} className="text-primary/40" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground/80 px-1">Phone Number</label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-bold opacity-50">+91</span>
                                            <Input
                                                disabled
                                                value={profileData.phoneNumber}
                                                className="pl-10 bg-neutral-50 border-neutral-200/60 rounded-xl h-10 cursor-not-allowed opacity-70 font-medium text-sm"
                                            />
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                                <CheckCircle2 size={12} className="text-primary/40" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="md:col-span-2 pt-1">
                                        <Button type="submit" disabled={loading} className="w-full h-10 rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-primary/5">
                                            {loading ? "Saving..." : "Save Personal Info"}
                                        </Button>
                                    </div>
                                </form>
                            </section>

                            {/* Shipping Address */}
                            <section className="bg-white border border-border/50 rounded-2xl p-5 shadow-sm">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-8 h-8 bg-primary/5 rounded-lg flex items-center justify-center">
                                        <MapPin className="text-primary" size={16} />
                                    </div>
                                    <h3 className="font-lora text-lg font-bold">Shipping Address</h3>
                                </div>

                                <form onSubmit={handleProfileUpdate} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                                        <div className="md:col-span-2 space-y-1">
                                            <label className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground/80 px-1">Street Address</label>
                                            <Input
                                                value={profileData.shippingAddress.address}
                                                onChange={(e) => setProfileData({ ...profileData, shippingAddress: { ...profileData.shippingAddress, address: e.target.value } })}
                                                className="bg-neutral-50/50 border-neutral-200 rounded-xl h-10 focus:ring-primary/20 font-medium text-sm"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground/80 px-1">City</label>
                                            <Input
                                                value={profileData.shippingAddress.city}
                                                onChange={(e) => setProfileData({ ...profileData, shippingAddress: { ...profileData.shippingAddress, city: e.target.value } })}
                                                className="bg-neutral-50/50 border-neutral-200 rounded-xl h-10 focus:ring-primary/20 font-medium text-sm"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="space-y-1">
                                                <label className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground/80 px-1">State</label>
                                                <Input
                                                    value={profileData.shippingAddress.state}
                                                    onChange={(e) => setProfileData({ ...profileData, shippingAddress: { ...profileData.shippingAddress, state: e.target.value } })}
                                                    className="bg-neutral-50/50 border-neutral-200 rounded-xl h-10 focus:ring-primary/20 font-medium text-sm"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground/80 px-1">Zip Code</label>
                                                <Input
                                                    value={profileData.shippingAddress.zip}
                                                    onChange={(e) => setProfileData({ ...profileData, shippingAddress: { ...profileData.shippingAddress, zip: e.target.value } })}
                                                    className="bg-neutral-50/50 border-neutral-200 rounded-xl h-10 focus:ring-primary/20 font-medium text-sm"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <Button type="submit" disabled={loading} className="w-full h-10 rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-primary/5">
                                        {loading ? "Updating..." : "Update Shipping Address"}
                                    </Button>
                                </form>
                            </section>

                            {/* Security Section */}
                            <section className="bg-white border border-border/50 rounded-2xl p-5 shadow-sm">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-8 h-8 bg-primary/5 rounded-xl flex items-center justify-center">
                                        <Key className="text-primary" size={16} />
                                    </div>
                                    <h2 className="font-lora text-lg font-bold leading-tight">Security</h2>
                                </div>

                                <form onSubmit={handlePasswordUpdate} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                                        <div className="space-y-1">
                                            <label className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground/80 px-1">Current Password</label>
                                            <Input
                                                type="password"
                                                value={passwords.currentPassword}
                                                onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                                                className="bg-neutral-50/50 border-neutral-200 rounded-xl h-10 font-medium text-sm"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground/80 px-1">New Password</label>
                                            <Input
                                                type="password"
                                                value={passwords.newPassword}
                                                onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                                                className="bg-neutral-50/50 border-neutral-200 rounded-xl h-10 font-medium text-sm"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground/80 px-1">Confirm New</label>
                                            <Input
                                                type="password"
                                                value={passwords.confirmPassword}
                                                onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                                                className="bg-neutral-50/50 border-neutral-200 rounded-xl h-10 font-medium text-sm"
                                            />
                                        </div>
                                    </div>
                                    <Button type="submit" disabled={loading} variant="outline" className="w-full h-10 rounded-xl text-[10px] font-bold uppercase tracking-widest border-primary/20 text-primary hover:bg-primary/5 transition-all">
                                        {loading ? "Processing..." : "Update Password"}
                                    </Button>
                                </form>
                            </section>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Profile;
