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
import { getProductDetails, getAllProducts, addProductReview } from "@/services/operations/productAPI";
import { useAuth } from "@/context/AuthContext";

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

    // Review Form State
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [submittingReview, setSubmittingReview] = useState(false);

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

    const handleReviewSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token || !id) {
            toast.error("Please login to submit a review");
            return;
        }

        setSubmittingReview(true);
        const success = await addProductReview(token, id, rating, comment);
        if (success) {
            setComment("");
            setRating(5);
            fetchDetails(); // Refresh product data
        }
        setSubmittingReview(false);
    };

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
                                { icon: <Droplets size={14} className="text-blue-500" />, text: `${product.sustainabilityMetrics?.CO2Emission || 0}g CO2`, sub: "Emissions Generated" },
                                { icon: <Wheat size={14} className="text-amber-600" />, text: `${product.sustainabilityMetrics?.paraliUsed || 0}g Parali`, sub: "Waste Transformed" },
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

                {/* ---------Description & Review Section ------------- */}
                <div className="mt-20">
                    <div className="flex border-b border-neutral-200">
                        {['description', 'technical', 'reviews'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] transition-all relative ${activeTab === tab ? 'text-black border-b-2 border-black' : 'text-neutral-400 hover:text-black'}`}
                            >
                                {tab === 'technical' ? 'Technical Specs' : tab === 'reviews' ? `Reviews (${product.numReviews || 0})` : 'Description'}
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
                                <p className="mt-4 font-bold text-neutral-900 border-l-4 border-orange-500 pl-4 italic">
                                    Made with pride from transformed farm residue.
                                </p>

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
                        {activeTab === 'reviews' && (
                            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 space-y-8">
                                <div className="grid md:grid-cols-[1fr_2fr] gap-12">
                                    {/* Summary & Form */}
                                    <div className="space-y-6">
                                        <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm">
                                            <h4 className="text-lg font-bold font-lora mb-2">Customer Feedback</h4>
                                            <div className="flex items-center gap-4 mb-4">
                                                <div className="text-4xl font-bold text-orange-600">{product.averageRating?.toFixed(1) || "0.0"}</div>
                                                <div>
                                                    <div className="flex text-orange-400">
                                                        {[1, 2, 3, 4, 5].map((s) => (
                                                            <Star key={s} size={14} fill={s <= Math.round(product.averageRating || 0) ? "currentColor" : "none"} />
                                                        ))}
                                                    </div>
                                                    <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest mt-1">Based on {product.numReviews || 0} reviews</p>
                                                </div>
                                            </div>

                                            {user ? (
                                                <form onSubmit={handleReviewSubmit} className="space-y-4 pt-4 border-t border-neutral-100">
                                                    <p className="text-xs font-bold uppercase tracking-widest">Write a Review</p>
                                                    <div>
                                                        <label className="text-[10px] text-neutral-500 uppercase font-bold mb-2 block">Rating</label>
                                                        <div className="flex gap-2">
                                                            {[1, 2, 3, 4, 5].map((s) => (
                                                                <button
                                                                    key={s}
                                                                    type="button"
                                                                    onClick={() => setRating(s)}
                                                                    className={`p-1 rounded-full transition-colors ${rating >= s ? "text-orange-500" : "text-neutral-300"}`}
                                                                >
                                                                    <Star size={20} fill={rating >= s ? "currentColor" : "none"} />
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label className="text-[10px] text-neutral-500 uppercase font-bold mb-2 block">Comment</label>
                                                        <textarea
                                                            value={comment}
                                                            onChange={(e) => setComment(e.target.value)}
                                                            className="w-full p-3 rounded-xl border border-neutral-200 text-xs focus:ring-1 focus:ring-orange-500 outline-none resize-none"
                                                            rows={3}
                                                            placeholder="Share your experience..."
                                                            required
                                                        />
                                                    </div>
                                                    <button
                                                        type="submit"
                                                        disabled={submittingReview}
                                                        className="w-full bg-neutral-900 text-white py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-neutral-800 transition-colors disabled:opacity-50"
                                                    >
                                                        {submittingReview ? "Submitting..." : "Submit Review"}
                                                    </button>
                                                </form>
                                            ) : (
                                                <div className="pt-4 border-t border-neutral-100 text-center">
                                                    <p className="text-xs text-neutral-500 mb-4">Please log in to share your feedback with the community.</p>
                                                    <Link to="/login" className="inline-block px-6 py-2 border border-neutral-900 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-neutral-900 hover:text-white transition-all">Login to Review</Link>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Review List */}
                                    <div className="space-y-4">
                                        {product.reviews && product.reviews.length > 0 ? (
                                            product.reviews.slice().reverse().map((review, i) => (
                                                <div key={i} className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm animate-in fade-in slide-in-from-right-4 duration-500" style={{ animationDelay: `${i * 100}ms` }}>
                                                    <div className="flex justify-between items-start mb-3">
                                                        <div>
                                                            <p className="font-bold text-sm text-neutral-900">{review.userName}</p>
                                                            <div className="flex text-orange-400 mt-1">
                                                                {[1, 2, 3, 4, 5].map((s) => (
                                                                    <Star key={s} size={10} fill={s <= review.rating ? "currentColor" : "none"} />
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <span className="text-[10px] text-neutral-400 font-medium">
                                                            {new Date(review.createdAt).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-neutral-600 italic">"{review.comment}"</p>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-white rounded-2xl border border-dashed border-neutral-200">
                                                <MessageSquare className="w-8 h-8 text-neutral-200 mb-4" />
                                                <p className="text-sm text-neutral-400 font-lora">No reviews yet. Be the first to share your experience!</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
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
