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

export async function addProductReview(token: string, productId: string, rating: number, comment: string) {
    const toastId = toast.loading("Submitting your review...");
    try {
        const response = await apiConnector(
            "POST",
            productEndpoints.GET_PRODUCT_DETAILS_API + productId + "/reviews",
            { rating, comment },
            {
                Authorization: `Bearer ${token}`,
            }
        );

        if (!response?.data?.success) {
            throw new Error(response.data.error || "Failed to add review");
        }

        toast.success("Review Added", {
            id: toastId,
            description: "Thank you for your feedback!"
        });
        return true;
    } catch (error: any) {
        console.log("ADD_PRODUCT_REVIEW_API ERROR............", error);
        toast.error(error.response?.data?.error || error.message || "Failed to submit review");
        toast.dismiss(toastId);
        return false;
    }
}
