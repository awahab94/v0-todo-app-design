import { Button } from "@/components/ui/button"
import { CheckSquare, Calendar, Filter, Zap } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="flex flex-1 flex-col items-center justify-center bg-gradient-to-br from-background via-background to-muted px-6 py-20 text-center">
        <div className="mb-6 flex items-center gap-3">
          <CheckSquare className="h-12 w-12 text-primary" />
          <h1 className="text-5xl font-bold">TaskFlow</h1>
        </div>
        <p className="mb-8 max-w-2xl text-balance text-xl text-muted-foreground">
          The intelligent task manager that adapts to your workflow. Organize, prioritize, and accomplish more with
          smart views, natural language input, and seamless multi-device sync.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/auth/sign-up">Get started free</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/auth/login">Sign in</Link>
          </Button>
        </div>

        {/* Features Grid */}
        <div className="mt-20 grid max-w-4xl gap-8 md:grid-cols-3">
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="rounded-lg bg-primary/10 p-3">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold">Natural Language</h3>
            <p className="text-sm text-muted-foreground">
              Type &quot;Pay rent tomorrow 9am #finance !high&quot; and we&apos;ll parse it all
            </p>
          </div>
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="rounded-lg bg-primary/10 p-3">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold">Multiple Views</h3>
            <p className="text-sm text-muted-foreground">Switch between list, kanban, and calendar views instantly</p>
          </div>
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="rounded-lg bg-primary/10 p-3">
              <Filter className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold">Smart Filters</h3>
            <p className="text-sm text-muted-foreground">
              Create custom views with powerful filters and save them as smart lists
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
