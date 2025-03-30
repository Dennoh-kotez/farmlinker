import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag, User, ShoppingCart, Heart, Clock, Calendar, MapPin, Phone, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <Layout>
      <div className="container mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
        
        <div className="bg-muted/40 rounded-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between">
            <div>
              <h2 className="text-2xl font-semibold mb-2">Welcome back, {user?.name}!</h2>
              <p className="text-muted-foreground mb-2">
                Here's an overview of your activity and recent orders.
              </p>
              {user?.county && (
                <div className="flex items-center mt-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mr-1" />
                  <span className="text-sm text-muted-foreground">{user.county}</span>
                </div>
              )}
            </div>
            <div className="mt-4 md:mt-0 flex flex-col items-start md:items-end">
              <Badge className="mb-2">Buyer Account</Badge>
              <p className="text-sm text-muted-foreground">KES Balance: 0.00</p>
            </div>
          </div>
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
        
        {/* Kenya-specific features */}
        <h2 className="text-2xl font-bold mb-4">Quick Payments</h2>
        <Card className="mb-10">
          <CardHeader>
            <CardTitle>M-Pesa Payments</CardTitle>
            <CardDescription>Make easy and secure payments with M-Pesa</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium">Pay for your orders easily with M-Pesa</p>
                <p className="text-sm text-muted-foreground">Fast, secure payments using your phone</p>
              </div>
            </div>
            
            <div className="p-4 bg-muted rounded-md">
              <p className="text-sm font-medium mb-1">How to pay:</p>
              <ol className="text-sm text-muted-foreground list-decimal pl-5 space-y-1">
                <li>Select M-Pesa as your payment method during checkout</li>
                <li>Enter your M-Pesa phone number</li>
                <li>Confirm the payment on your phone when prompted</li>
                <li>Your order will be processed immediately after payment confirmation</li>
              </ol>
            </div>
          </CardContent>
          <CardFooter>
            <Link href="/products" className="w-full">
              <Button className="w-full bg-green-600 hover:bg-green-700">
                Shop Now
              </Button>
            </Link>
          </CardFooter>
        </Card>
        
        {/* County-based Delivery */}
        <h2 className="text-2xl font-bold mb-4">Delivery Information</h2>
        <Card className="mb-10">
          <CardHeader>
            <CardTitle>County-Based Delivery</CardTitle>
            <CardDescription>Delivery options for your location in Kenya</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Delivery options for {user?.county || "your county"}</p>
                <p className="text-sm text-muted-foreground">Get fresh farm products delivered to your location</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-muted rounded-md">
                <p className="font-medium mb-1">Same-day delivery</p>
                <p className="text-sm text-muted-foreground">Available in select areas of Nairobi, Mombasa, and Kisumu</p>
              </div>
              
              <div className="p-4 bg-muted rounded-md">
                <p className="font-medium mb-1">Standard delivery</p>
                <p className="text-sm text-muted-foreground">1-3 days for most counties in Kenya</p>
              </div>
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