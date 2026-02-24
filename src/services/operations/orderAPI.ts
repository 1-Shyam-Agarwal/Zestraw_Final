import { toast } from "sonner";
import { apiConnector } from "../apiConnector";
import { orderEndpoints } from "../apis";

const { CREATE_ORDER_API, GET_MY_ORDERS_API } = orderEndpoints;

export async function createOrder(token, orderData, navigate, clearCart) {
    const toastId = toast.loading("Processing your order...", {
        description: "Checking items and securing transaction."
    });
    try {
        const response = await apiConnector("POST", CREATE_ORDER_API, orderData, {
            Authorization: `Bearer ${token}`
        });

        if (!response.data.success) {
            throw new Error(response.data.error);
        }

        toast.success("Order Placed Successfully!", {
            id: toastId,
            description: "Thank you for choosing ZESTRAW. Your order is being processed.",
            duration: 5000,
        });

        clearCart();
        navigate("/orders"); // Redirect to orders to see tracking
        return response.data.data;
    } catch (error) {
        const errorMessage = error.response?.data?.error || error.message || "Failed to place order";
        toast.error("Order Failed", {
            id: toastId,
            description: errorMessage,
            duration: 4000
        });
        return null;
    }
}

export async function getUserOrders(token) {
    try {
        const response = await apiConnector("GET", GET_MY_ORDERS_API, null, {
            Authorization: `Bearer ${token}`
        });

        if (!response.data.success) {
            throw new Error(response.data.error);
        }

        return response.data.data;
    } catch (error) {
        console.error("GET_MY_ORDERS_API ERROR...", error);
        return [];
    }
}
