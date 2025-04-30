
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bell, Search } from "lucide-react";
import { Link } from "react-router-dom";

export function Header() {
  return (
    <header className="border-b">
      <div className="flex h-16 items-center px-4 sm:px-6">
        <div className="ml-auto flex items-center space-x-4">
          <div className="hidden md:flex md:w-80 lg:w-96 items-center rounded-md border px-3 bg-background">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search transactions..."
              className="h-10 border-0 bg-transparent shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
          <Button variant="outline" size="icon" className="relative rounded-full">
            <Bell className="h-5 w-5" />
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
          </Button>
          <ThemeToggle />
          <Button variant="ghost" size="sm" asChild>
            <Link to="/settings">
              <span className="h-8 w-8 rounded-full bg-muted flex items-center justify-center font-medium">AB</span>
            </Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
