import { toast } from "sonner";
import { apiConnector } from "../apiConnector";
import { endpoints } from "../apis";

const { REIGSTER_API, LOGIN_API, FORGOT_PASSWORD_API, RESET_PASSWORD_API, UPDATE_ADDRESS_API, GET_USER_DETAILS_API, UPDATE_PROFILE_API, UPDATE_PASSWORD_API } = endpoints;

export async function changePassword(token, passwordData) {
    const toastId = toast.loading("Updating your security credentials...", {
        description: "Connecting to secure server."
    });
    try {
        const response = await apiConnector("PUT", UPDATE_PASSWORD_API, passwordData, {
            Authorization: `Bearer ${token}`
        });

        if (!response.data.success) {
            throw new Error(response.data.error);
        }

        toast.success("Password Updated", {
            id: toastId,
            description: "Your security credentials have been updated successfully.",
            duration: 3000,
        });
        return true;
    } catch (error) {
        const errorMessage = error.response?.data?.error || error.message || "Failed to update password";
        toast.error("Process Error", {
            id: toastId,
            description: errorMessage,
            duration: 4000
        });
        return false;
    }
}

export async function updateProfile(token, profileData, setAuth) {
    const toastId = toast.loading("Updating your profile...", {
        description: "Connecting to secure server."
    });
    try {
        const response = await apiConnector("PUT", UPDATE_PROFILE_API, profileData, {
            Authorization: `Bearer ${token}`
        });

        if (!response.data.success) {
            throw new Error(response.data.error);
        }

        toast.success("Profile Updated", {
            id: toastId,
            description: "Your details have been updated successfully.",
            duration: 3000,
        });

        // Update auth state with new user data
        setAuth(response.data.data, token);
        return true;
    } catch (error) {
        const errorMessage = error.response?.data?.error || error.message || "Failed to update profile";
        toast.error("Process Error", {
            id: toastId,
            description: errorMessage,
            duration: 4000
        });
        return false;
    }
}

export async function updateShippingAddress(token, addressData, setAuth) {
    const toastId = toast.loading("Updating your shipping address...", {
        description: "Connecting to secure server."
    });
    try {
        const response = await apiConnector("PUT", UPDATE_ADDRESS_API, addressData, {
            Authorization: `Bearer ${token}`
        });

        if (!response.data.success) {
            throw new Error(response.data.error);
        }

        toast.success("Address Updated", {
            id: toastId,
            description: "Your selection has been saved for future orders.",
            duration: 3000,
        });

        // Update auth state with new user data
        setAuth(response.data.data, token);
        return true;
    } catch (error) {
        const errorMessage = error.response?.data?.error || error.message || "Failed to update address";
        toast.error("Process Error", {
            id: toastId,
            description: errorMessage,
            duration: 4000
        });
        return false;
    }
}

export async function getUserDetails(token, setAuth) {
    try {
        const response = await apiConnector("GET", GET_USER_DETAILS_API, null, {
            Authorization: `Bearer ${token}`
        });

        if (response.data.success) {
            setAuth(response.data.data, token);
        }
    } catch (error) {
        console.error("Get user details error:", error);
    }
}

export async function getPasswordResetToken(email, setEmailSent) {
    const toastId = toast.loading("Verifying email and sending reset link...", {
        description: "Please wait a moment."
    });
    try {
        const response = await apiConnector("POST", FORGOT_PASSWORD_API, { email });

        toast.success("Password Reset Email Sent", {
            id: toastId,
            description: `A reset link has been sent to ${email}. Check your inbox and spam folder.`,
            duration: 5000,
        });
        setEmailSent(true);
    } catch (error) {
        const errorMessage = error.response?.data?.error || error.message || "Failed to send reset email";
        toast.error("Process Failed", {
            id: toastId,
            description: errorMessage,
            duration: 4000
        });
    }
}

export async function resetPassword(password, token, navigate) {
    const toastId = toast.loading("Updating your security credentials...", {
        description: "Setting your new password."
    });
    try {
        const response = await apiConnector("PUT", `${RESET_PASSWORD_API}/${token}`, { password });

        toast.success("Security Updated", {
            id: toastId,
            description: "Your password has been reset successfully. You can now log in.",
            duration: 5000,
        });
        navigate("/login");
    } catch (error) {
        const errorMessage = error.response?.data?.error || error.message || "Failed to reset password";
        toast.error("Reset Failed", {
            id: toastId,
            description: errorMessage,
            duration: 4000
        });
    }
}

export async function login(email, password, navigate, setAuth) {
    const toastId = toast.loading("Authenticating...", {
        description: "Checking your credentials."
    });
    try {
        const response = await apiConnector("POST", LOGIN_API, {
            identifier: email, // Reusing variable name 'email' as the identifier
            password,
        });

        if (!response.data.success) {
            throw new Error(response.data.error);
        }

        toast.success("Welcome Back!", {
            id: toastId,
            description: "You have signed in successfully.",
            duration: 3000,
        });
        setAuth(response.data.data, response.data.token);
        navigate("/");
    } catch (error) {
        const errorMessage = error.response?.data?.error || error.message || "Login failed. Please check your email and password.";

        // If user is not registered, redirect to signup
        if (error.response?.status === 404 || errorMessage.toLowerCase().includes("not registered")) {
            toast.error("Account Not Found", {
                id: toastId,
                description: "This email isn't registered yet. Redirecting you to sign up...",
                duration: 4000
            });
            setTimeout(() => navigate("/signup"), 1500);
            return;
        }

        toast.error("Authentication Error", {
            id: toastId,
            description: errorMessage,
            duration: 4000
        });
    }
}

export async function signUp(
    fullName,
    email,
    password,
    accountType,
    navigate,
    phoneNumber
) {
    const toastId = toast.loading("Creating your account...", {
        description: "This will only take a second."
    });
    try {
        const response = await apiConnector("POST", REIGSTER_API, {
            fullName,
            email,
            password,
            accountType,
            phoneNumber
        });

        if (!response.data.success) {
            throw new Error(response.data.error);
        }
        toast.success("Account Created!", {
            id: toastId,
            description: "Welcome to the Zestraw family!",
            duration: 5000,
        });
        navigate("/login");
    } catch (error) {
        const errorMessage = error.response?.data?.error || error.message || "Registration failed. Please try again.";
        toast.error("Registration Failed", {
            id: toastId,
            description: errorMessage,
            duration: 4000
        });
        navigate("/signup");
    }
}
