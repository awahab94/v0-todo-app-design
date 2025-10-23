"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, RefreshCw, Home, Bug } from "lucide-react";
import Link from "next/link";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global application error:", error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-background to-muted p-6">
          <div className="w-full max-w-lg">
            <div className="mb-8 flex flex-col items-center gap-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-8 w-8 text-red-500" />
                <h1 className="text-3xl font-bold">TaskFlow</h1>
              </div>
              <p className="text-sm text-gray-600">Your intelligent task manager</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-center flex items-center justify-center gap-2">
                  <Bug className="h-6 w-6 text-red-500" />
                  Critical Error
                </CardTitle>
                <CardDescription className="text-center">A critical error occurred that prevented the application from loading properly.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex justify-center">
                  <div className="rounded-full bg-red-100 p-4">
                    <AlertTriangle className="h-10 w-10 text-red-500" />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-lg bg-gray-100 p-4">
                    <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                      <Bug className="h-4 w-4" />
                      Error Details:
                    </h4>
                    <p className="text-sm text-gray-600 font-mono break-all">{error.message || "A critical application error occurred"}</p>
                    {error.digest && <p className="text-xs text-gray-500 mt-2">Error ID: {error.digest}</p>}
                  </div>

                  <div className="space-y-3">
                    <Button onClick={reset} className="w-full bg-blue-600 hover:bg-blue-700">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Reload Application
                    </Button>

                    <Button asChild variant="outline" className="w-full">
                      <Link href="/">
                        <Home className="h-4 w-4 mr-2" />
                        Go to Homepage
                      </Link>
                    </Button>
                  </div>

                  <div className="text-center space-y-2">
                    <p className="text-xs text-gray-500">
                      If this problem persists, please{" "}
                      <Link href="/support" className="text-blue-600 hover:underline">
                        contact our support team
                      </Link>
                    </p>
                    <p className="text-xs text-gray-500">Error occurred at: {new Date().toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </body>
    </html>
  );
}
