import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../context/authProvider";
import UseRefreshToken from "../hooks/useRefreshToken";

const RequireAuth = () => {
    // Access authentication state and setter from context
    const { auth, setAuth } = useContext(AuthContext);
    // Get current route location for navigation
    const location = useLocation();
    // State to track loading status while verifying auth
    const [isLoading, setIsLoading] = useState(true);
    // Get the refresh token function from custom hook
    const refreshToken = UseRefreshToken();

    useEffect(() => {
        // Flag to check if component is still mounted
        let isMounted = true;
        
        // Function to verify authentication status
        const verifyAuth = async () => {
            try {
                // Only attempt refresh if we don't have an access token
                if (!auth?.accessToken) {
                    // Attempt to get new access token using refresh token
                    const newAccessToken = await refreshToken();
                    
                    // Only update state if component is still mounted
                    if (isMounted && newAccessToken) {
                        setAuth(prev => ({ 
                            ...prev, 
                            accessToken: newAccessToken 
                        }));
                    }
                }
            } catch (error) {
                console.log("Session expired", error);
            } finally {
                // Sets loading to false when done
                if (isMounted) setIsLoading(false);
            }
        };

        // Runs the verification function
        verifyAuth();

        // Cleanup function to prevent state updates after unmount
        return () => { 
            isMounted = false; 
        };
    }, []); // Empty dependency array means this runs once on mount

    // Show loading state while verifying authentication
    if (isLoading) {
        return <div>Loading...</div>; // Replace with your loading component
    }

    // If we have an access token, render the protected routes
    // Otherwise, redirect to login with current location for return navigation
    return auth?.accessToken
        ? <Outlet />  // This renders the child routes
        : <Navigate to="/login" state={{ from: location }} replace />;
};

export default RequireAuth;