/* eslint-disable no-unused-vars */
import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Star, Minus, Plus, Heart, Truck, Leaf, ShoppingCart, ChevronDown, Droplets, Wheat, CheckCircle, MessageSquare } from "lucide-react";
import { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import ProductCard from "@/components/ProductCard";
import { Layout } from "@/components/Layout";
import { getProductImageSrc } from "@/lib/images";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { getProductDetails, getAllProducts } from "@/services/operations/productAPI";
import { useAuth } from "@/context/AuthContext";
import { getDeliveryDate } from "@/lib/utils";

export default function ProductDetailPage() {
    const { id } = useParams();
    const { user, token } = useAuth();
    const [product, setProduct] = useState<Product | null>(null);
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();

    // UI States from template
    const [image, setImage] = useState('');
    const [selectedSet, setSelectedSet] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('description');

    // Hardcoded Reviews Data
    const hardcodedReviews: Record<string, any[]> = {
        'default': [
            { userName: "Aarav Sharma", rating: 5, comment: "Incredible quality! These plates are much stronger than plastic and feel premium. A great sustainable choice.", createdAt: "2024-02-15" },
            { userName: "Priya Patel", rating: 4, comment: "I love the natural texture. They held up perfectly during our outdoor garden party. Highly recommended!", createdAt: "2024-02-10" },
            { userName: "Rahul Verma", rating: 5, comment: "Finally, a eco-friendly alternative that doesn't get soggy. These bowls are perfect for hot soups.", createdAt: "2024-02-20" },
        ],
        '1': [
            { userName: "Neha Gupta", rating: 5, comment: "The 10-inch plate is the perfect size for dinner. Sturdy and elegant. Will buy again!", createdAt: "2024-03-01" },
            { userName: "Vikram Malhotra", rating: 5, comment: "Eco-friendly and practical. They didn't bend even with heavy food. Impressive!", createdAt: "2024-02-25" }
        ],
        '2': [
            { userName: "Ananya Iyer", rating: 5, comment: "Best cereal bowls ever! No plastic taste, just pure natural goodness. My kids love them.", createdAt: "2024-03-05" },
            { userName: "Siddharth Rao", rating: 4, comment: "Great for breakfast. The 16oz size is perfect. Fast delivery too!", createdAt: "2024-02-28" }
        ],
        '3': [
            { userName: "Meera Das", rating: 5, comment: "This tray is a game changer for hosting. Very sturdy and looks beautiful on the table.", createdAt: "2024-03-10" },
            { userName: "Arjun Singh", rating: 5, comment: "Solid build quality. Holds heavy dishes without any issues. 5 stars!", createdAt: "2024-02-15" }
        ],
        '4': [
            { userName: "Kavita Reddy", rating: 5, comment: "The combo pack was perfect for my daughter's birthday party. Everyone was impressed by the sustainability.", createdAt: "2024-02-20" },
            { userName: "Rohan Joshi", rating: 5, comment: "Great value for money. The quality of every item in the pack is top-notch.", createdAt: "2024-02-18" }
        ],
        '5': [
            { userName: "Simran Kaur", rating: 5, comment: "Classy tapas plates. Perfect for appetizers. Love the square design.", createdAt: "2024-03-12" },
            { userName: "Deepak Bakshi", rating: 4, comment: "Elegant and eco-friendly. Adds a nice touch to the serving experience.", createdAt: "2024-03-02" }
        ],
        '6': [
            { userName: "Tanvi Shah", rating: 5, comment: "Perfect for ramen! The natural material keeps the soup warm longer. Absolutely love it.", createdAt: "2024-03-08" },
            { userName: "Ishaan Gupta", rating: 5, comment: "Minimalist and functional. Exactly what I was looking for.", createdAt: "2024-03-04" }
        ],
        '7': [
            { userName: "Sunita Pillai", rating: 5, comment: "The cutlery is surprisingly strong. Better than any wooden or bamboo ones I've used.", createdAt: "2024-03-15" },
            { userName: "Manish Tiwari", rating: 5, comment: "Smooth finish and very sturdy. Great for travel too.", createdAt: "2024-03-11" }
        ],
        '8': [
            { userName: "Rhea Kapoor", rating: 5, comment: "Best natural straws. They don't get mushy in the drink. Perfect for my smoothies.", createdAt: "2024-03-18" },
            { userName: "Amit Saxena", rating: 5, comment: "Sturdy and eco-friendly. Much better than paper straws!", createdAt: "2024-03-14" }
        ],
        '9': [
            { userName: "Pooja Hegde", rating: 5, comment: "The set of 25 is great for family gatherings. Everyone appreciated the move away from plastic.", createdAt: "2024-03-20" },
            { userName: "Sahil Khan", rating: 5, comment: "Premium quality dinner plates. They return to the earth in 90 days - that's amazing!", createdAt: "2024-03-16" }
        ]
    };

    const currentReviews = hardcodedReviews[id || 'default'] || hardcodedReviews['default'];
    const avgRating = currentReviews.reduce((acc, r) => acc + r.rating, 0) / currentReviews.length;

    const fetchDetails = async () => {
        if (!id) return;
        setLoading(true);
        const data = await getProductDetails(id);
        if (data) {
            setProduct(data);

            // Initialize gallery and set/size from data
            const productImages = data.images || (data.image ? [data.image] : ["no-photo.jpg"]);
            setImage(productImages[0].startsWith('http') ? productImages[0] : getProductImageSrc(productImages[0]));

            if (data.sizesAvailable && data.sizesAvailable.length > 0) {
                setSelectedSet(String(data.sizesAvailable[0].size));
            }

            // Fetch related products (same category)
            const allProducts = await getAllProducts();
            if (allProducts) {
                const related = allProducts.filter((p: any) =>
                    p.category === data.category && (p._id || p.id) !== id
                ).slice(0, 4);
                setRelatedProducts(related);
            }
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchDetails();
    }, [id]);


    if (loading) {
        return (
            <Layout>
                <div className="container mx-auto px-4 py-20 text-center">
                    <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
                    <p className="text-muted-foreground uppercase tracking-widest text-xs">Loading ZESTRAW Experience...</p>
                </div>
            </Layout>
        );
    }

    if (!product) {
        return (
            <Layout>
                <div className="container mx-auto px-4 py-20 text-center">
                    <h1 className="text-2xl font-lora font-bold mb-4">Product Not Found</h1>
                    <Link to="/shop" className="text-primary hover:underline">Return to Conscious Shop</Link>
                </div>
            </Layout>
        );
    }

    // Map database fields
    const productName = product.productName || product.name || "Unnamed Product";
    const productImages = product.images || (product.image ? [product.image] : ["no-photo.jpg"]);

    // Get current price based on selected set
    const currentPrice = product.sizesAvailable?.find(s => String(s.size) === selectedSet)?.price || product.productPrice || product.price || 0;

    const handleAddToCartAction = () => {
        const productId = product._id || product.id;
        if (!productId) return;

        addToCart({
            id: productId,
            name: productName,
            price: currentPrice,
            image: productImages[0],
            category: product.category,
            size: selectedSet,
            sustainabilityMetrics: product.sustainabilityMetrics
        }, quantity);

        toast.success("Added to Cart", {
            description: `${quantity}x ${productName} (Pack of ${selectedSet}) added to your basket.`
        });
    };

    return (
        <Layout>
            <div className="transition-opacity ease-in duration-500 opacity-100 container mx-auto px-4 lg:px-8 pt-10 pb-20">
                {/*-------------- Product data --------------*/}
                <div className="flex gap-12 sm:gap-16 flex-col lg:flex-row">

                    {/*-------------- Product Images-------------- */}
                    <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
                        <div className="flex sm:flex-col overflow-x-auto gap-1 sm:gap-2 justify-between sm:justify-normal sm:w-[18.7%] w-full">
                            {productImages.map((item, index) => {
                                const imgSrc = item.startsWith('http') ? item : getProductImageSrc(item);
                                return (
                                    <div key={index} onClick={() => setImage(imgSrc)} className="w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer">
                                        <img
                                            src={imgSrc}
                                            className={`w-full aspect-square object-contain rounded-[120px] bg-white hover:opacity-100 transition-opacity duration-200 ${imgSrc === image ? 'border-2 border-orange-500 opacity-100' : 'opacity-70'}`}
                                            alt=""
                                        />
                                    </div>
                                );
                            })}
                        </div>
                        <div className="w-full sm:w-[80%] rounded-[80px] overflow-hidden">
                            <div className="aspect-square w-full rounded-[80px]">
                                <motion.img
                                    key={image}
                                    initial={{ opacity: 0.8 }}
                                    animate={{ opacity: 1 }}
                                    className="w-full h-full object-contain rounded-[120px] shadow-sm"
                                    src={image}
                                    alt={productName}
                                />
                            </div>
                        </div>
                    </div>

                    {/* ---------Product Info--------- */}
                    <div className="flex-1">
                        <h1 className="font-lora font-bold text-3xl lg:text-3xl mt-2 sm:mt-8 text-foreground">{productName}</h1>

                        <div className="flex items-center gap-2 mt-8">
                            <p className="text-3xl font-bold font-lora text-neutral-900">
                                ₹{currentPrice.toFixed(2)}
                            </p>
                            {product.sizesAvailable && product.sizesAvailable.length > 1 && (
                                <span className="text-[10px] bg-orange-100 text-orange-700 px-2 py-1 rounded-full font-bold uppercase tracking-widest ml-2">Best Selection</span>
                            )}
                        </div>

                        {/* <p className="mt-6 text-neutral-500 leading-relaxed font-lora text-lg lg:w-4/5">
                            {product.details?.description?.primaryContent || "Our premium rice-straw dinnerware offers a sustainable alternative to plastic. Sturdy, elegant, and returns to the earth in 90 days."}
                        </p> */}

                        <div className="flex flex-col gap-4 my-8">
                            <p className="text-sm font-bold uppercase tracking-widest text-neutral-900">Select Set Size</p>
                            <div className="flex flex-wrap gap-2">
                                {product.sizesAvailable ? (
                                    product.sizesAvailable.map((item, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedSet(String(item.size))}
                                            className={`border py-3 px-6 transition-all font-medium rounded-lg ${String(item.size) === selectedSet ? 'border-orange-500 bg-white text-orange-600 shadow-sm' : 'border-border bg-neutral-50 text-neutral-600 hover:bg-neutral-100'}`}
                                        >
                                            PACK OF {item.size}
                                        </button>
                                    ))
                                ) : (
                                    <button className="border border-orange-500 py-3 px-6 rounded-lg bg-white text-orange-600 font-medium">Standard Pack</button>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-4 my-8">
                            <p className="text-sm font-bold uppercase tracking-widest text-neutral-900">Quantity:</p>
                            <div className="flex items-center border border-neutral-300 rounded overflow-hidden bg-neutral-50">
                                <button
                                    onClick={() => setQuantity(prev => prev > 1 ? prev - 1 : 1)}
                                    className="px-4 py-2 hover:bg-neutral-200 transition-colors bg-neutral-100"
                                >-</button>
                                <span className="px-6 py-2 text-center min-w-[50px] font-bold">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(prev => prev + 1)}
                                    className="px-4 py-2 hover:bg-neutral-200 transition-colors bg-neutral-100"
                                >+</button>
                            </div>
                        </div>

                        <button
                            onClick={handleAddToCartAction}
                            className="w-full sm:w-auto bg-primary rounded-[5px] text-white px-12 py-4 text-sm font-bold tracking-widest uppercase hover:scale-105 transition-all active:scale-95 shadow-md"
                        >
                            ADD TO CART
                        </button>


                        <div className="grid grid-cols-2 gap-3 my-6">
                            {[
                                { icon: <CheckCircle size={14} className="text-eco-green" />, text: "Free Delivery", sub: "Orders over ₹1000" },
                                { icon: <Leaf size={14} className="text-eco-green" />, text: "100% Organic", sub: "No toxic chemicals" },
                                { icon: <Truck size={14} className="text-primary" />, text: `Delivery by ${getDeliveryDate(2)}`, sub: "Estimated Date" },
                            ].map((badge, i) => (
                                <div key={i} className="flex items-center gap-2 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 rounded-xl p-3 transition-colors">
                                    {badge.icon}
                                    <div>
                                        <div className="text-xs font-semibold text-foreground">{badge.text}</div>
                                        <div className="text-[10px] text-muted-foreground">{badge.sub}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-20">
                    <div className="flex border-b border-neutral-200 overflow-x-auto no-scrollbar whitespace-nowrap">
                        {['description', 'technical'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 sm:px-8 py-4 text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] transition-all relative ${activeTab === tab ? 'text-black border-b-2 border-black' : 'text-neutral-400 hover:text-black'}`}
                            >
                                {tab === 'technical' ? 'Technical Specs' : 'Description'}
                            </button>
                        ))}
                    </div>
                    <div className="flex flex-col gap-6 px-4 sm:px-10 py-12 text-sm text-neutral-600 leading-relaxed bg-[#fdfaf5] rounded-b-xl border-x border-b border-neutral-100 min-h-[200px] font-lora">
                        {activeTab === 'description' && (
                            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 space-y-4">
                                <p className="text-lg font-lora text-neutral-800 font-bold">{product.details?.description?.heading || "Sustainable Dining Redefined"}</p>
                                <p>{product.details?.description?.primaryContent}</p>
                                <p>{product.details?.description?.secondaryContent}</p>
                                <ul className="list-disc pl-5 mt-4 space-y-2">
                                    {(product.details?.keyFeatures || ["100% Biodegradable", "Microwave & Freezer Safe", "Chemical Free Heat-Press"]).map((item, index) => (
                                        <li key={index}>{item}</li>
                                    ))}
                                </ul>
                                {product.details?.["last line"] ? (
                                    <div className="mt-6 space-y-1">
                                        {product.details["last line"].map((line, idx) => (
                                            <p key={idx} className="font-bold text-neutral-900 border-l-4 border-orange-500 pl-4 italic">
                                                {line}
                                            </p>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="mt-4 font-bold text-neutral-900 border-l-4 border-orange-500 pl-4 italic">
                                        Made with pride from transformed farm residue.
                                    </p>
                                )}

                            </div>
                        )}
                        {activeTab === 'technical' && (
                            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 space-y-4">
                                <h4 className="font-bold text-lg font-lora text-neutral-900 mb-4">Product Specifications</h4>
                                <ul className="list-disc pl-5 space-y-2">
                                    {product.details?.technicalSpecifications?.map((spec, i) => (
                                        <li key={i} className="text-neutral-700">{spec}</li>
                                    )) || <p>Technical specifications coming soon for this product.</p>}
                                </ul>
                            </div>
                        )}

                    </div>
                </div>

                {/* Standing Separate Reviews Section */}
                <div className="mt-20 bg-white rounded-3xl border border-neutral-100 shadow-sm p-8 sm:p-12">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                        <div>
                            <h3 className="text-2xl font-bold font-lora text-foreground">Community Reviews</h3>
                            <p className="text-sm text-muted-foreground mt-1 font-lora">Honest feedback from our conscious family</p>
                        </div>
                        <div className="flex items-center gap-3 bg-neutral-50 px-4 py-2 rounded-full border border-neutral-100">
                            <span className="text-lg font-black text-orange-600 font-lora">{avgRating.toFixed(1)}</span>
                            <div className="flex text-orange-400 gap-0.5">
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <Star key={s} size={14} fill={s <= Math.round(avgRating) ? "currentColor" : "none"} />
                                ))}
                            </div>
                            <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest ml-1 border-l border-neutral-200 pl-3">
                                {currentReviews.length} Reviews
                            </span>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-[1fr_2fr] gap-12">
                        {/* Summary / Stats Bar */}
                        <div className="space-y-6">
                            <div className="bg-[#fef9f3] p-6 rounded-2xl border border-orange-100/50">
                                <h4 className="text-sm font-bold uppercase tracking-widest mb-4">Rating Breakdown</h4>
                                <div className="space-y-3">
                                    {[5, 4, 3, 2, 1].map((rating) => {
                                        const count = currentReviews.filter(r => r.rating === rating).length;
                                        const percentage = (count / currentReviews.length) * 100;
                                        return (
                                            <div key={rating} className="flex items-center gap-3">
                                                <span className="text-xs font-bold w-3">{rating}</span>
                                                <Star size={10} className="text-orange-400 fill-orange-400" />
                                                <div className="flex-1 h-2 bg-neutral-200 rounded-full overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        whileInView={{ width: `${percentage}%` }}
                                                        transition={{ duration: 1, ease: "easeOut" }}
                                                        className="h-full bg-orange-500 rounded-full"
                                                    />
                                                </div>
                                                <span className="text-xs text-neutral-400 w-8 text-right">{count}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="mt-8 pt-6 border-t border-orange-100/50">
                                    <p className="text-xs text-neutral-500 leading-relaxed italic">
                                        Each review contributes to our understanding of how Zestraw impacts your daily life and our shared environment.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Review Feed */}
                        <div className="space-y-6">
                            {currentReviews.map((review, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="pb-6 border-b border-neutral-100 last:border-0"
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <p className="font-bold text-sm text-neutral-900">{review.userName}</p>
                                                <span className="px-1.5 py-0.5 bg-eco-green-light text-eco-green text-[8px] font-bold rounded uppercase tracking-tighter">Verified Buyer</span>
                                            </div>
                                            <div className="flex text-orange-400 gap-0.5">
                                                {[1, 2, 3, 4, 5].map((s) => (
                                                    <Star key={s} size={10} fill={s <= review.rating ? "currentColor" : "none"} />
                                                ))}
                                            </div>
                                        </div>
                                        <span className="text-[10px] text-neutral-400 font-medium font-lora">
                                            {new Date(review.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </span>
                                    </div>
                                    <p className="text-sm text-neutral-600 leading-relaxed font-lora">"{review.comment}"</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ---------Display Related Products ------------- */}
                <div className="mt-12">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl lg:text-3xl font-lora font-normal mb-2 md:mb-4">Complete the Eco-Experience</h2>
                        <div className="w-20 h-1 bg-orange-500 mx-auto rounded-full" />
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 lg:gap-8">
                        {relatedProducts.map((p) => (
                            <ProductCard key={p._id || p.id} product={p} />
                        ))}
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                    height: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #e5e7eb;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #d1d5db;
                }
            ` }} />
        </Layout>
    );
}
