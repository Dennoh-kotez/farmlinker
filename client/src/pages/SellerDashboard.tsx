import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Package, DollarSign, BarChart2, ShoppingBag, Truck, Users, PlusCircle, 
  Settings, MapPin, Phone, Leaf, Sun, Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export default function SellerDashboard() {
  const { user } = useAuth();

  return (
    <Layout>
      <div className="container mx-auto py-10 px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold">Seller Dashboard</h1>
              <Badge className="bg-green-600 hover:bg-green-700">Kenyan Seller</Badge>
            </div>
            <p className="text-muted-foreground">Manage your farm products and orders</p>
            {user?.county && (
              <div className="flex items-center mt-2">
                <MapPin className="h-4 w-4 text-muted-foreground mr-1" />
                <span className="text-sm text-muted-foreground">Location: {user.county}, Kenya</span>
              </div>
            )}
            {user?.mpesaNumber && (
              <div className="flex items-center mt-1">
                <Phone className="h-4 w-4 text-muted-foreground mr-1" />
                <span className="text-sm text-muted-foreground">M-Pesa: {user.mpesaNumber}</span>
              </div>
            )}
          </div>
          <div className="mt-4 md:mt-0 flex flex-col items-end gap-2">
            <div className="bg-muted px-3 py-1 rounded-md text-sm">
              <span className="font-medium">KES Balance:</span> 0.00
            </div>
            <Link href="/seller/products/add">
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add New Product
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {/* Summary Cards */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Package className="h-5 w-5 text-muted-foreground mr-2" />
                <span className="text-2xl font-bold">0</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Revenue (Total)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <DollarSign className="h-5 w-5 text-muted-foreground mr-2" />
                <span className="text-2xl font-bold">KES 0.00</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Orders</CardTitle>
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
              <CardTitle className="text-sm font-medium">Customers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Users className="h-5 w-5 text-muted-foreground mr-2" />
                <span className="text-2xl font-bold">0</span>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="products" className="mb-10">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="products" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Products</CardTitle>
                <CardDescription>
                  Manage your product listings and inventory
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <Package className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Products Yet</h3>
                  <p className="text-muted-foreground mb-4">
                    You haven't added any products to your store yet. Start by adding your first product.
                  </p>
                  <Link href="/seller/products/add">
                    <Button>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add First Product
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="orders" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>
                  Track and fulfill your customer orders
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Orders Yet</h3>
                  <p className="text-muted-foreground mb-4">
                    When customers place orders, they will appear here for you to fulfill.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="analytics" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Overview</CardTitle>
                <CardDescription>
                  Track the performance of your products and sales
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-8">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Revenue Growth</span>
                      <span className="text-sm font-medium">0%</span>
                    </div>
                    <Progress value={0} />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Order Completion</span>
                      <span className="text-sm font-medium">0%</span>
                    </div>
                    <Progress value={0} />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Customer Satisfaction</span>
                      <span className="text-sm font-medium">0%</span>
                    </div>
                    <Progress value={0} />
                  </div>
                  <div className="flex justify-center pt-4">
                    <BarChart2 className="h-32 w-32 text-muted-foreground" />
                  </div>
                  <p className="text-center text-muted-foreground">
                    Start selling products to see your performance analytics
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Store Settings</CardTitle>
                <CardDescription>
                  Manage your store preferences and account details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <div>
                    <h3 className="font-medium mb-2">Store Information</h3>
                    <div className="bg-muted p-4 rounded-md">
                      <p className="mb-1"><span className="font-medium">Name:</span> {user?.name}'s Farm</p>
                      <p className="mb-1"><span className="font-medium">Email:</span> {user?.email}</p>
                      <p><span className="font-medium">Seller Since:</span> Recently</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button variant="outline">
                      <Settings className="mr-2 h-4 w-4" />
                      Edit Settings
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Organic Farming Information */}
        <h2 className="text-2xl font-bold mb-4 flex items-center">
          <Leaf className="mr-2 h-5 w-5 text-green-600" />
          Organic Farming in Kenya
        </h2>
        <Card className="mb-10">
          <CardHeader>
            <CardTitle>Boost Your Farm's Value with Organic Certification</CardTitle>
            <CardDescription>
              Organic farming in Kenya offers premium prices and growing export opportunities
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col items-center p-4 bg-muted rounded-md">
                <Leaf className="h-8 w-8 text-green-600 mb-2" />
                <h3 className="font-medium text-center mb-1">Certification</h3>
                <p className="text-sm text-center text-muted-foreground">Get organic certification through Kenya Organic Agriculture Network (KOAN)</p>
              </div>
              
              <div className="flex flex-col items-center p-4 bg-muted rounded-md">
                <Sun className="h-8 w-8 text-amber-500 mb-2" />
                <h3 className="font-medium text-center mb-1">Premium Prices</h3>
                <p className="text-sm text-center text-muted-foreground">Earn 20-30% higher prices for certified organic products</p>
              </div>
              
              <div className="flex flex-col items-center p-4 bg-muted rounded-md">
                <Award className="h-8 w-8 text-blue-600 mb-2" />
                <h3 className="font-medium text-center mb-1">Export Markets</h3>
                <p className="text-sm text-center text-muted-foreground">Access premium export markets in Europe, US, and Middle East</p>
              </div>
            </div>
            
            <div className="p-4 bg-green-50 border border-green-100 rounded-md">
              <h4 className="font-medium mb-2 text-green-800">Popular Organic Crops in Kenya</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <Badge variant="outline" className="justify-center bg-white">Coffee</Badge>
                <Badge variant="outline" className="justify-center bg-white">Tea</Badge>
                <Badge variant="outline" className="justify-center bg-white">Avocados</Badge>
                <Badge variant="outline" className="justify-center bg-white">Mangoes</Badge>
                <Badge variant="outline" className="justify-center bg-white">Passion Fruit</Badge>
                <Badge variant="outline" className="justify-center bg-white">Herbs</Badge>
                <Badge variant="outline" className="justify-center bg-white">Leafy Greens</Badge>
                <Badge variant="outline" className="justify-center bg-white">Indigenous Vegetables</Badge>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-green-600 hover:bg-green-700">
              <Leaf className="mr-2 h-4 w-4" />
              Learn More About Organic Certification
            </Button>
          </CardFooter>
        </Card>
        
        {/* Quick Actions */}
        <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Add Product</CardTitle>
              <CardDescription>List a new farm product for sale</CardDescription>
            </CardHeader>
            <CardFooter>
              <Link href="/seller/products/add" className="w-full">
                <Button variant="outline" className="w-full">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Product
                </Button>
              </Link>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Fulfill Orders</CardTitle>
              <CardDescription>Manage pending customer orders</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button variant="outline" className="w-full">
                <Truck className="mr-2 h-4 w-4" />
                Process Orders
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>View Analytics</CardTitle>
              <CardDescription>See detailed performance metrics</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button variant="outline" className="w-full">
                <BarChart2 className="mr-2 h-4 w-4" />
                View Reports
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </Layout>
  );
}