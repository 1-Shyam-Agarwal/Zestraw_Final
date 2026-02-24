import { toast } from "sonner";
import { apiConnector } from "../apiConnector";
import { productEndpoints } from "../apis";

const {
    GET_ALL_PRODUCTS_API,
    GET_PRODUCT_DETAILS_API
} = productEndpoints;

export async function getAllProducts() {
    try {
        const response = await apiConnector("GET", GET_ALL_PRODUCTS_API);

        if (!response?.data?.success) {
            throw new Error("Could not fetch products");
        }

        return response.data.data;
    } catch (error: any) {
        toast.error(error.message || "Failed to fetch products");
        return [];
    }
}

export async function getProductDetails(productId: string) {
    const toastId = toast.loading("Loading product details...");
    try {
        const response = await apiConnector("GET", GET_PRODUCT_DETAILS_API + productId);

        if (!response?.data?.success) {
            throw new Error("Could not fetch product details");
        }

        toast.dismiss(toastId);
        return response.data.data;
    } catch (error: any) {
        console.log("GET_PRODUCT_DETAILS_API ERROR............", error);
        toast.error(error.message || "Failed to load product details");
        toast.dismiss(toastId);
        return null;
    }
}

