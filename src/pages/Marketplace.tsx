import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useMemo } from "react";
import { toast } from "sonner";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
} from "@/components/ui/pagination";

import { Search, MapPin } from "lucide-react";

const marketplaceData = [
    {
        id: 1,
        company: "ZESTRAW (Hoshiarpur)",
        location: "Hoshiarpur, Punjab",
        moq: "100 Tons",
        price: "₹2,000",
    },
    {
        id: 2,
        company: "ZESTRAW (Palwal)",
        location: "Palwal, Haryana",
        moq: "50 Tons",
        price: "₹2,200",
    },
    {
        id: 3,
        company: "ZESTRAW (Bihar)",
        location: "Bihar, Bihar",
        moq: "50 Tons",
        price: "₹1,900",
    },
];

const MarketPlace = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
    const [sortBy, setSortBy] = useState("latest");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const filteredData = useMemo(() => {
        let data = [...marketplaceData];

        // Search Filter
        if (searchTerm) {
            const query = searchTerm.toLowerCase();
            data = data.filter(item =>
                item.company.toLowerCase().includes(query) ||
                item.location.toLowerCase().includes(query)
            );
        }

        // Location Filter
        if (selectedLocations.length > 0) {
            data = data.filter(item =>
                selectedLocations.some(loc => item.location.includes(loc))
            );
        }

        // Sort
        if (sortBy === "price-low") {
            data.sort((a, b) => parseInt(a.price.replace(/[^\d]/g, "")) - parseInt(b.price.replace(/[^\d]/g, "")));
        } else if (sortBy === "price-high") {
            data.sort((a, b) => parseInt(b.price.replace(/[^\d]/g, "")) - parseInt(a.price.replace(/[^\d]/g, "")));
        }

        return data;
    }, [searchTerm, selectedLocations, sortBy]);

    const handleLocationToggle = (location: string) => {
        setSelectedLocations(prev =>
            prev.includes(location)
                ? prev.filter(l => l !== location)
                : [...prev, location]
        );
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate API call
        await new Promise(r => setTimeout(r, 1500));
        setIsSubmitting(false);
        toast.success("Details Submitted!", {
            description: "Thank you for reaching out. Our procurement team will contact you soon to discuss your Parali sale.",
            duration: 5000
        });
        // Reset form would normally happen here if we had form state
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />

            <main className="flex-1 container mx-auto px-4 py-8 md:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">

                    {/* Sidebar */}
                    <aside className="space-y-8">
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                                Location
                            </h3>
                            <div className="space-y-3">
                                {["Punjab", "Haryana", "Bihar"].map((loc) => (
                                    <div key={loc} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={loc}
                                            checked={selectedLocations.includes(loc)}
                                            onCheckedChange={() => handleLocationToggle(loc)}
                                        />
                                        <label htmlFor={loc} className="text-sm font-medium cursor-pointer">
                                            {loc}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <div className="space-y-6">

                        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                            <div className="relative w-full md:max-w-md">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search by company or location..."
                                    className="pl-10 h-11"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            <Select value={sortBy} onValueChange={setSortBy}>
                                <SelectTrigger className="w-full md:w-[150px] h-11">
                                    <SelectValue placeholder="Sort by" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="latest">Latest</SelectItem>
                                    <SelectItem value="price-low">Price: Low-High</SelectItem>
                                    <SelectItem value="price-high">Price: High-Low</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredData.length > 0 ? (
                                filteredData.map((item) => (
                                    <div
                                        key={item.id}
                                        className="bg-card rounded-xl border border-border p-5 space-y-4 hover:shadow-md transition-all duration-300"
                                    >
                                        <h4 className="text-lg font-semibold">{item.company}</h4>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <MapPin className="w-4 h-4" />
                                            <span>{item.location}</span>
                                        </div>
                                        <p className="text-sm font-medium">Price: <span className="font-semibold">{item.price} / Ton</span></p>
                                        <p className="text-sm font-medium">MOQ: <span className="font-semibold">{item.moq}</span></p>
                                        <Button className="w-full mt-2" onClick={() => toast.info("Contacting Buyer...", { description: `Your request has been sent to ${item.company}.` })}>
                                            Contact Buyer
                                        </Button>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full py-12 text-center border-2 border-dashed border-border rounded-xl">
                                    <p className="text-muted-foreground">No buyers found matching your criteria.</p>
                                </div>
                            )}
                        </div>

                        {/* Farmer Sell Form */}
                        <div className="bg-card border border-border rounded-xl p-6 space-y-6">
                            <h2 className="text-xl font-semibold">
                                Sell Your Parali
                            </h2>

                            <p className="text-sm text-muted-foreground">
                                Farmers can fill this form to sell crop residue (Parali).
                            </p>

                            <form onSubmit={handleFormSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Farmer Name</label>
                                        <Input placeholder="Enter your full name" required />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Contact Number</label>
                                        <Input type="tel" placeholder="Enter mobile number" required />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Quantity Available (in Tons)</label>
                                        <Input type="number" placeholder="Enter quantity in tons" required />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Location (Village / District / State)</label>
                                        <Input placeholder="Enter your location" required />
                                    </div>
                                </div>

                                <div>
                                    <Button type="submit" className="w-full md:w-auto" disabled={isSubmitting}>
                                        {isSubmitting ? "Submitting..." : "Submit Details"}
                                    </Button>
                                </div>
                            </form>
                        </div>


                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default MarketPlace;