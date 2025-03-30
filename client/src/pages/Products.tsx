import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Leaf, Search, Filter, ShoppingCart } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { Product } from "@shared/schema";

export default function Products() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("all");
  const [county, setCounty] = useState("all");

  const { data, isLoading } = useQuery({
    queryKey: ["/api/products"],
    queryFn: async () => {
      const response = await apiRequest("/api/products");
      return (response as any).products as Product[];
    },
  });

  const products = data || [];

  // Filter products based on search term, category, and county
  const filteredProducts = products.filter((product: Product) => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = category === "all" || product.category === category;
    const matchesCounty = county === "all" || product.county === county;
    
    return matchesSearch && matchesCategory && matchesCounty;
  });

  return (
    <Layout>
      <div className="container mx-auto py-10 px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Farm Products</h1>
            <p className="text-muted-foreground">Fresh farm products from Kenyan farmers</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="vegetables">Vegetables</SelectItem>
                  <SelectItem value="fruits">Fruits</SelectItem>
                  <SelectItem value="dairy">Dairy</SelectItem>
                  <SelectItem value="grains">Grains</SelectItem>
                  <SelectItem value="meat">Meat</SelectItem>
                  <SelectItem value="poultry">Poultry</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={county} onValueChange={setCounty}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="County" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Counties</SelectItem>
                  <SelectItem value="nairobi">Nairobi</SelectItem>
                  <SelectItem value="mombasa">Mombasa</SelectItem>
                  <SelectItem value="kisumu">Kisumu</SelectItem>
                  <SelectItem value="nakuru">Nakuru</SelectItem>
                  <SelectItem value="eldoret">Eldoret</SelectItem>
                  <SelectItem value="kiambu">Kiambu</SelectItem>
                  <SelectItem value="machakos">Machakos</SelectItem>
                  <SelectItem value="nyeri">Nyeri</SelectItem>
                  <SelectItem value="kakamega">Kakamega</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Product Categories Tabs */}
        <Tabs defaultValue="all" className="mb-8">
          <TabsList className="grid grid-cols-3 md:grid-cols-7 w-full">
            <TabsTrigger value="all" onClick={() => setCategory("all")}>All</TabsTrigger>
            <TabsTrigger value="vegetables" onClick={() => setCategory("vegetables")}>Vegetables</TabsTrigger>
            <TabsTrigger value="fruits" onClick={() => setCategory("fruits")}>Fruits</TabsTrigger>
            <TabsTrigger value="dairy" onClick={() => setCategory("dairy")}>Dairy</TabsTrigger>
            <TabsTrigger value="grains" onClick={() => setCategory("grains")}>Grains</TabsTrigger>
            <TabsTrigger value="meat" onClick={() => setCategory("meat")}>Meat</TabsTrigger>
            <TabsTrigger value="poultry" onClick={() => setCategory("poultry")}>Poultry</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Products Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : filteredProducts && filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden flex flex-col">
                <div className="relative h-48 bg-muted">
                  {product.imageUrl ? (
                    <img 
                      src={product.imageUrl} 
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                      No Image
                    </div>
                  )}
                  {product.organic && (
                    <Badge className="absolute top-2 right-2 bg-green-600">
                      <Leaf className="h-3 w-3 mr-1" /> Organic
                    </Badge>
                  )}
                </div>
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <CardTitle className="text-lg">{product.name}</CardTitle>
                    <span className="font-bold text-lg">KES {product.price.toFixed(2)}</span>
                  </div>
                  <CardDescription className="line-clamp-2">{product.description}</CardDescription>
                </CardHeader>
                <CardContent className="pb-2 flex-grow">
                  <div className="flex flex-wrap gap-2 mb-2">
                    <Badge variant="secondary">{product.category}</Badge>
                    {product.county && <Badge variant="outline">{product.county}</Badge>}
                    <Badge variant="outline">{product.unit}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Quantity available: {product.quantity}
                  </p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <h3 className="text-xl font-medium mb-2">No Products Found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || category !== "all" || county !== "all"
                ? "Try changing your search or filters"
                : "There are no products available at the moment"}
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}