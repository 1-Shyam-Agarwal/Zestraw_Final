import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingCart, Leaf } from "lucide-react";
import { toast } from "sonner";
import { Product } from "@/data/products";
import { getProductImageSrc } from "@/lib/images";
import { useCart } from "@/context/CartContext";

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const { addToCart } = useCart();

    const productName = product.productName || product.name || "Unnamed Product";
    const productPrice = product.productPrice || product.price || 0;
    const productImage = product.images?.[0] || product.image || "no-photo.jpg";
    const productId = product._id || product.id;
    console.log(product.sustainabilityMetrics);


    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (productId) {
            addToCart({
                id: productId,
                name: productName,
                price: productPrice,
                image: productImage,
                category: product.category,
                size: product.sizesAvailable?.[0]?.size ? String(product.sizesAvailable[0].size) : undefined,
                sustainabilityMetrics: {
                    carbonFootprint: product.sustainabilityMetrics?.carbonFootprint ?? 12.5,
                    plasticUse: product.sustainabilityMetrics?.plasticUse ?? 0,
                    plasticAvoided: product.sustainabilityMetrics?.plasticAvoided ?? 150
                }
            }, 1);
            toast.success("Added to cart!");
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="group"
        >
            <Link to={`/product/${productId}`} className="block">
                <div className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-md transition-shadow">
                    <div className="relative aspect-square overflow-hidden">
                        {product?.sizesAvailable?.length >= 1 && (
                            <span className="absolute top-3 left-3 z-10 px-3 py-1 bg-primary text-primary-foreground text-[10px] font-bold rounded-full uppercase">
                                PACK OF {product.sizesAvailable?.[0]?.size}
                            </span>
                        )}
                        <img
                            src={productImage.startsWith('http') ? productImage : getProductImageSrc(productImage)}
                            alt={productName}
                            className={`w-full h-full object-cover transition-transform duration-300 ${product.category === 'Cutlery' ? 'scale-125 group-hover:scale-[1.35]' : 'group-hover:scale-105'
                                }`}
                        />
                    </div>
                    <div className="p-4 flex flex-col gap-2">
                        <h3 className="text-sm font-medium font-lora line-clamp-2">{productName}</h3>
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-base font-bold">₹{productPrice.toFixed(2)}</span>
                            {product?.sizesAvailable && product?.sizesAvailable?.length > 1 && (
                                <span className="text-xs text-muted-foreground">Multiple Set Sizes</span>
                            )}
                        </div>
                        <button
                            onClick={handleAddToCart}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
                        >
                            <ShoppingCart className="w-3.5 h-3.5" /> Add to Cart
                        </button>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
