import { Link } from "wouter";
import { Facebook, Instagram, Twitter, Mail, MapPin, Phone, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import logoImg from "@/assets/logo.png";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-muted/30 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <Link href="/">
              <div className="flex flex-col items-center md:items-start">
                <img src={logoImg} alt="FarmLinker Logo" className="h-20 w-auto mb-2" />
                <h2 className="text-xl font-bold text-primary mt-2">FarmLinker</h2>
              </div>
            </Link>
            <p className="text-muted-foreground">
              Connecting farmers and consumers for fresher food and fairer prices.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { name: "Home", href: "/" },
                { name: "Products", href: "/products" },
                { name: "About Us", href: "/about" },
                { name: "Seller Registration", href: "/register?role=seller" },
                { name: "Terms of Service", href: "/terms" },
                { name: "Privacy Policy", href: "/privacy" },
              ].map((link) => (
                <li key={link.name}>
                  <Link href={link.href}>
                    <span className="text-muted-foreground hover:text-primary cursor-pointer">
                      {link.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 text-primary shrink-0 mt-0.5" />
                <span className="text-muted-foreground">
                  123 Farm Lane, Rural County, Country
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-2 text-primary shrink-0" />
                <span className="text-muted-foreground">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-2 text-primary shrink-0" />
                <span className="text-muted-foreground">contact@farmlinker.com</span>
              </li>
            </ul>
          </div>
          
          {/* Newsletter */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Subscribe to Our Newsletter</h3>
            <p className="text-muted-foreground mb-4">
              Stay updated with our latest products and farming news.
            </p>
            <div className="flex flex-col space-y-2">
              <Input 
                type="email" 
                placeholder="Your email address" 
                className="bg-background"
              />
              <Button>
                Subscribe
                <Leaf className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        <div className="border-t mt-12 pt-6 text-center text-muted-foreground">
          <p>&copy; {currentYear} FarmLinker. All rights reserved.</p>
          <p className="text-sm mt-2">
            Supporting sustainable farming and connecting communities.
          </p>
        </div>
      </div>
    </footer>
  );
}