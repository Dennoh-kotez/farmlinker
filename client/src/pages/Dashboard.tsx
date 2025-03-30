import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag, User, ShoppingCart, Heart, Clock, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <Layout>
      <div className="container mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
        
        <div className="bg-muted/40 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-2">Welcome back, {user?.name}!</h2>
          <p className="text-muted-foreground">
            Here's an overview of your activity and recent orders.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {/* Quick stats cards */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Orders Placed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <ShoppingBag className="h-5 w-5 text-muted-foreground mr-2" />
                <span className="text-2xl font-bold">0</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Wishlist Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Heart className="h-5 w-5 text-muted-foreground mr-2" />
                <span className="text-2xl font-bold">0</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Cart Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <ShoppingCart className="h-5 w-5 text-muted-foreground mr-2" />
                <span className="text-2xl font-bold">0</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Account Created</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-muted-foreground mr-2" />
                <span className="text-sm font-medium">Recently</span>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Recent Orders */}
        <h2 className="text-2xl font-bold mb-4">Recent Orders</h2>
        <Card className="mb-10">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <Clock className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No Recent Orders</h3>
              <p className="text-muted-foreground mb-4">
                You haven't placed any orders yet. Start shopping to see your orders here.
              </p>
              <Link href="/products">
                <Button>Browse Products</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
        
        {/* Quick Actions */}
        <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>Update your personal information</CardDescription>
            </CardHeader>
            <CardFooter>
              <Link href="/profile" className="w-full">
                <Button variant="outline" className="w-full">
                  <User className="mr-2 h-4 w-4" />
                  View Profile
                </Button>
              </Link>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Orders</CardTitle>
              <CardDescription>Track and manage your orders</CardDescription>
            </CardHeader>
            <CardFooter>
              <Link href="/orders" className="w-full">
                <Button variant="outline" className="w-full">
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  View Orders
                </Button>
              </Link>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Shopping Cart</CardTitle>
              <CardDescription>Review items in your cart</CardDescription>
            </CardHeader>
            <CardFooter>
              <Link href="/cart" className="w-full">
                <Button variant="outline" className="w-full">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  View Cart
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </Layout>
  );
}