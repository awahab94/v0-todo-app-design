import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileX, Home, ArrowLeft, Search } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-background to-muted p-6">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center gap-2">
          <div className="flex items-center gap-2">
            <FileX className="h-8 w-8 text-muted-foreground" />
            <h1 className="text-3xl font-bold">TaskFlow</h1>
          </div>
          <p className="text-sm text-muted-foreground">Your intelligent task manager</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center flex items-center justify-center gap-2">
              <Search className="h-6 w-6 text-muted-foreground" />
              Page Not Found
            </CardTitle>
            <CardDescription className="text-center">
              The page you're looking for doesn't exist or has been moved.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-center">
              <div className="rounded-full bg-muted p-4">
                <FileX className="h-10 w-10 text-muted-foreground" />
              </div>
            </div>

            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">404 Error</h3>
                <p className="text-sm text-muted-foreground">
                  The requested page could not be found. It might have been deleted, moved, or you might have entered the wrong URL.
                </p>
              </div>

              <div className="space-y-3">
                <Button asChild className="w-full">
                  <Link href="/app">
                    <Home className="h-4 w-4 mr-2" />
                    Go to Dashboard
                  </Link>
                </Button>
                
                <Button asChild variant="outline" className="w-full" onClick={() => window.history.back()}>
                  <div>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Go Back
                  </div>
                </Button>
              </div>

              <div className="text-center">
                <p className="text-xs text-muted-foreground">
                  Need help?{" "}
                  <Link href="/support" className="text-primary hover:underline">
                    Contact our support team
                  </Link>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
