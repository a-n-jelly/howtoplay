import { Link, useLocation } from 'react-router-dom';
import { Dice5, Library, Plus, Home } from 'lucide-react';

const navItems = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/games', icon: Library, label: 'Library' },
  { to: '/add-game', icon: Plus, label: 'Add Game' },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Top Nav */}
      <header className="border-b-2 border-border bg-popover sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Dice5 className="w-7 h-7 text-primary" />
            <span className="font-heading text-xl font-bold tracking-tight">GameGuide</span>
          </Link>
          <nav className="hidden sm:flex gap-1">
            {navItems.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`px-3 py-2 text-sm font-mono border transition-colors duration-150 ${
                  location.pathname === to
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-transparent hover:border-border hover:bg-secondary'
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1">
        {children}
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-popover border-t-2 border-border z-50">
        <div className="flex">
          {navItems.map(({ to, icon: Icon, label }) => (
            <Link
              key={to}
              to={to}
              className={`flex-1 flex flex-col items-center py-3 text-xs font-mono transition-colors duration-150 ${
                location.pathname === to || (to !== '/' && location.pathname.startsWith(to))
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="w-5 h-5 mb-1" />
              {label}
            </Link>
          ))}
        </div>
      </nav>

      {/* Bottom spacer for mobile nav */}
      <div className="sm:hidden h-16" />
    </div>
  );
}
