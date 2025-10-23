"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckSquare, AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";

export default function AuthCallbackPage() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState<string>("");
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Check if user is already authenticated (Supabase handles the confirmation)
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError) {
          console.error("Auth error:", authError);
          setStatus("error");
          setMessage("Authentication failed. Please try again.");
          return;
        }

        if (user) {
          // User is authenticated, create default labels and redirect
          setStatus("success");
          setMessage("Email confirmed successfully! Welcome to TaskFlow.");

          // Redirect to app after a short delay
          setTimeout(() => {
            router.push("/app");
          }, 2000);
        } else {
          setStatus("error");
          setMessage("No authenticated user found. Please try signing up again.");
        }
      } catch (error) {
        console.error("Auth callback error:", error);
        setStatus("error");
        setMessage("An unexpected error occurred");
      }
    };

    handleAuthCallback();
  }, [supabase.auth, router]);

  const handleRetry = () => {
    setStatus("loading");
    setMessage("");
    // Retry the callback process
    window.location.reload();
  };

  const handleGoToLogin = () => {
    router.push("/auth/login");
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-background to-muted p-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-2">
          <div className="flex items-center gap-2">
            <CheckSquare className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">TaskFlow</h1>
          </div>
          <p className="text-sm text-muted-foreground">Your intelligent task manager</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              {status === "loading" && "Confirming Email..."}
              {status === "success" && "Email Confirmed!"}
              {status === "error" && "Confirmation Failed"}
            </CardTitle>
            <CardDescription className="text-center">
              {status === "loading" && "Please wait while we confirm your email address"}
              {status === "success" && "Your account has been successfully verified"}
              {status === "error" && "There was an issue confirming your email"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-center">
              {status === "loading" && <Loader2 className="h-8 w-8 animate-spin text-primary" />}
              {status === "success" && (
                <div className="rounded-full bg-green-100 p-3">
                  <CheckSquare className="h-8 w-8 text-green-600" />
                </div>
              )}
              {status === "error" && (
                <div className="rounded-full bg-red-100 p-3">
                  <AlertCircle className="h-8 w-8 text-red-600" />
                </div>
              )}
            </div>

            {message && <div className={`text-center text-sm ${status === "success" ? "text-green-600" : status === "error" ? "text-red-600" : "text-muted-foreground"}`}>{message}</div>}

            {status === "success" && <div className="text-center text-sm text-muted-foreground">Redirecting you to the app...</div>}

            {status === "error" && (
              <div className="space-y-3">
                <Button onClick={handleRetry} className="w-full">
                  Try Again
                </Button>
                <Button onClick={handleGoToLogin} variant="outline" className="w-full">
                  Go to Login
                </Button>
              </div>
            )}

            {status === "success" && (
              <div className="text-center">
                <Link href="/app" className="text-sm text-primary hover:underline">
                  Continue to App
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
