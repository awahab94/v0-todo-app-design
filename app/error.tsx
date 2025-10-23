"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, RefreshCw, Home, ArrowLeft, Bug } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  const router = useRouter();

  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error);
  }, [error]);

  const handleGoBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/app");
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-background to-muted p-6">
      <div className="w-full max-w-lg">
        <div className="mb-8 flex flex-col items-center gap-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-8 w-8 text-destructive" />
            <h1 className="text-3xl font-bold">TaskFlow</h1>
          </div>
          <p className="text-sm text-muted-foreground">Your intelligent task manager</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center flex items-center justify-center gap-2">
              <Bug className="h-6 w-6 text-destructive" />
              Oops! Something went wrong
            </CardTitle>
            <CardDescription className="text-center">We encountered an unexpected error. Don't worry, your data is safe and we're working to fix this.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-center">
              <div className="rounded-full bg-destructive/10 p-4">
                <AlertTriangle className="h-10 w-10 text-destructive" />
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-lg bg-muted p-4">
                <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                  <Bug className="h-4 w-4" />
                  Error Details:
                </h4>
                <p className="text-sm text-muted-foreground font-mono break-all">{error.message || "An unexpected error occurred"}</p>
                {error.digest && <p className="text-xs text-muted-foreground mt-2">Error ID: {error.digest}</p>}
              </div>

              <div className="space-y-3">
                <Button onClick={reset} className="w-full">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>

                <div className="grid grid-cols-2 gap-3">
                  <Button asChild variant="outline">
                    <Link href="/app">
                      <Home className="h-4 w-4 mr-2" />
                      Dashboard
                    </Link>
                  </Button>
                  <Button variant="outline" onClick={handleGoBack}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Go Back
                  </Button>
                </div>
              </div>

              <div className="text-center space-y-2">
                <p className="text-xs text-muted-foreground">
                  If this problem persists, please{" "}
                  <Link href="/support" className="text-primary hover:underline">
                    contact our support team
                  </Link>
                </p>
                <p className="text-xs text-muted-foreground">Error occurred at: {new Date().toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
