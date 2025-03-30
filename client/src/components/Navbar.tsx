import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Menu, ShoppingCart, LogOut, User, ShoppingBag, Package } from "lucide-react";

export default function Navbar() {
  const { isAuthenticated, user, logout, isSeller } = useAuth();
  const [, setLocation] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setLocation("/");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className="bg-background border-b sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/">
              <span className="text-2xl font-bold text-primary cursor-pointer">FarmLinker</span>
            </Link>
            
            <nav className="ml-10 hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link href={item.href} key={item.name}>
                  <span className="text-sm font-medium hover:text-primary cursor-pointer">
                    {item.name}
                  </span>
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            {/* Cart icon for all users */}
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-primary text-[10px] font-medium text-primary-foreground flex items-center justify-center">
                  0
                </span>
              </Button>
            </Link>

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{user?.name ? getInitials(user.name) : "U"}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  
                  <Link href="/dashboard">
                    <DropdownMenuItem className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </DropdownMenuItem>
                  </Link>
                  
                  <Link href="/orders">
                    <DropdownMenuItem className="cursor-pointer">
                      <ShoppingBag className="mr-2 h-4 w-4" />
                      <span>My Orders</span>
                    </DropdownMenuItem>
                  </Link>
                  
                  {isSeller && (
                    <>
                      <Link href="/seller/dashboard">
                        <DropdownMenuItem className="cursor-pointer">
                          <Package className="mr-2 h-4 w-4" />
                          <span>Seller Dashboard</span>
                        </DropdownMenuItem>
                      </Link>
                      <Link href="/seller/products">
                        <DropdownMenuItem className="cursor-pointer">
                          <ShoppingBag className="mr-2 h-4 w-4" />
                          <span>Manage Products</span>
                        </DropdownMenuItem>
                      </Link>
                    </>
                  )}
                  
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden md:flex space-x-2">
                <Link href="/login">
                  <Button variant="outline">Sign in</Button>
                </Link>
                <Link href="/register">
                  <Button>Sign up</Button>
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader className="mb-6">
                  <SheetTitle>FarmLinker</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col space-y-4">
                  {navItems.map((item) => (
                    <Link href={item.href} key={item.name}>
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.name}
                      </Button>
                    </Link>
                  ))}
                  
                  {isAuthenticated ? (
                    <>
                      <Link href="/dashboard">
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <User className="mr-2 h-4 w-4" />
                          Dashboard
                        </Button>
                      </Link>
                      {isSeller && (
                        <>
                          <Link href="/seller/dashboard">
                            <Button
                              variant="ghost"
                              className="w-full justify-start"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              <Package className="mr-2 h-4 w-4" />
                              Seller Dashboard
                            </Button>
                          </Link>
                          <Link href="/seller/products">
                            <Button
                              variant="ghost"
                              className="w-full justify-start"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              <ShoppingBag className="mr-2 h-4 w-4" />
                              Manage Products
                            </Button>
                          </Link>
                        </>
                      )}
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => {
                          handleLogout();
                          setMobileMenuOpen(false);
                        }}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Log out
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link href="/login">
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Sign in
                        </Button>
                      </Link>
                      <Link href="/register">
                        <Button 
                          className="w-full"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Sign up
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}