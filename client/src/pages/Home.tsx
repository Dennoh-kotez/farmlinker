import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, Leaf, ShieldCheck, Truck } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function Home() {
  const { isAuthenticated, isSeller } = useAuth();

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Farm Fresh Products
            <span className="text-primary"> Delivered Direct</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
            FarmLinker connects you directly with local farmers for fresher produce, 
            supporting sustainable agriculture and fair pricing.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products">
              <Button size="lg" className="px-8">Browse Products</Button>
            </Link>
            {!isAuthenticated && (
              <Link href="/register">
                <Button size="lg" variant="outline" className="px-8">
                  {isSeller ? "Add Products" : "Become a Seller"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            )}
            {isAuthenticated && isSeller && (
              <Link href="/seller/dashboard">
                <Button size="lg" variant="outline" className="px-8">
                  Seller Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose FarmLinker?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="flex flex-col items-center text-center p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="h-14 w-14 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Leaf className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Farm Fresh Quality</h3>
              <p className="text-gray-600">Products that come straight from farms to your table, preserving freshness and nutrition.</p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="h-14 w-14 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <ShieldCheck className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Vetted Farmers</h3>
              <p className="text-gray-600">All our farmers are verified for quality standards and sustainable farming practices.</p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="h-14 w-14 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Truck className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Direct Delivery</h3>
              <p className="text-gray-600">Cut out the middlemen with our direct farm-to-consumer delivery service.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to taste the difference?</h2>
          <p className="text-xl mb-10 max-w-2xl mx-auto">
            Join thousands of happy customers enjoying fresh farm products delivered to their doorstep.
          </p>
          <Link href="/products">
            <Button size="lg" variant="secondary" className="px-8">Start Shopping Now</Button>
          </Link>
        </div>
      </section>

      {/* Quick Categories */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Browse by Category</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {["Vegetables", "Fruits", "Dairy", "Meat", "Eggs", "Honey"].map((category) => (
              <Link href={`/products?category=${category.toLowerCase()}`} key={category}>
                <div className="flex flex-col items-center p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md hover:border-primary/50 transition-all cursor-pointer">
                  <h3 className="text-lg font-medium text-gray-900">{category}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
