import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Sun,
  Moon,
  Menu,
  ChevronDown,
  TrendingUp,
  Bot,
  Users,
  BarChart3,
  FileText,
  Briefcase,
  Settings,
  LogIn,
  LogOut,
} from 'lucide-react';

const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const navigation = [
    {
      name: 'Products',
      items: [
        { name: 'Trading Engine', href: '/dashboard', icon: TrendingUp },
        { name: 'Strategy Builder', href: '/strategy-builder', icon: Bot },
        { name: 'Backtesting Engine', href: '/backtesting', icon: BarChart3 },
        { name: 'Social Trading', href: '/social-trading', icon: Users },
        { name: 'Reports', href: '/reports', icon: FileText },
        { name: 'Portfolio', href: '/portfolio', icon: Briefcase },
      ],
    },
    {
      name: 'Solutions',
      items: [
        { name: 'Strategy Copilot', href: '/copilot', icon: Bot },
        { name: 'Fund Management', href: '/fund-management', icon: Settings },
        { name: 'Wishlist', href: '/wishlist', icon: TrendingUp },
      ],
    },
  ];

  const NavDropdown = ({ item }: { item: typeof navigation[0] }) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-1 text-foreground hover:text-primary">
          {item.name}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-popover/95 backdrop-blur-sm border border-border/50">
        {item.items.map((subItem) => (
          <DropdownMenuItem key={subItem.name} asChild>
            <Link
              to={subItem.href}
              className="flex items-center gap-3 p-3 hover:bg-accent/50 transition-colors"
            >
              <subItem.icon className="h-4 w-4 text-muted-foreground" />
              <span>{subItem.name}</span>
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg gradient-primary">
            <TrendingUp className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold gradient-text">Stratify</span>
        </Link>

        {/* Desktop Navigation - Only show when authenticated */}
        {isAuthenticated && (
          <nav className="hidden md:flex items-center space-x-6">
            {navigation.map((item) => (
              <NavDropdown key={item.name} item={item} />
            ))}
            <Link
              to="/pricing"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive('/pricing') ? 'text-primary' : 'text-foreground'
              }`}
            >
              Pricing
            </Link>
          </nav>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="hover:bg-accent"
          >
            {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </Button>

          <div className="hidden md:flex items-center gap-2">
            {isAuthenticated ? (
              <Button variant="ghost" onClick={logout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost">
                    <LogIn className="h-4 w-4 mr-2" />
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button variant="hero">Get Started</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 bg-background/95 backdrop-blur">
              <div className="flex flex-col space-y-6 mt-6">
                <Link to="/" className="flex items-center space-x-2" onClick={() => setIsMobileMenuOpen(false)}>
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg gradient-primary">
                    <TrendingUp className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-xl font-bold gradient-text">Stratify</span>
                </Link>
                
                {isAuthenticated && navigation.map((section) => (
                  <div key={section.name} className="space-y-3">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                      {section.name}
                    </h3>
                    {section.items.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <item.icon className="h-4 w-4 text-muted-foreground" />
                        <span>{item.name}</span>
                      </Link>
                    ))}
                  </div>
                ))}
                
                <div className="pt-4 border-t border-border">
                  {isAuthenticated ? (
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start"
                      onClick={() => {
                        logout();
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  ) : (
                    <>
                      <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start">
                          <LogIn className="h-4 w-4 mr-2" />
                          Login
                        </Button>
                      </Link>
                      <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                        <Button variant="hero" className="w-full mt-2">Get Started</Button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;