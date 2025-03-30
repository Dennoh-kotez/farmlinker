import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Leaf, Pencil, Trash2, Plus, Package, Tag, Edit, AlertTriangle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { Product, insertProductSchema } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

// Extended schema for product form with client-side validation
const productFormSchema = insertProductSchema.extend({
  price: z.coerce.number().positive("Price must be a positive number"),
  quantity: z.coerce.number().int().positive("Quantity must be a positive integer"),
  
  // Handle nullable fields
  imageUrl: z.string().optional().transform(val => val || ""),
  county: z.string().optional().transform(val => val || ""),
  location: z.string().optional().transform(val => val || ""),
  organic: z.boolean().optional().transform(val => val === null ? false : val),
  available: z.boolean().optional().transform(val => val === null ? true : val),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

export default function SellerProducts() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Fetch seller's products
  const { data, isLoading } = useQuery({
    queryKey: ["/api/products/seller"],
    queryFn: async () => {
      const response = await apiRequest("/api/products/seller");
      return (response as any) as Product[];
    },
  });
  
  const products = data || [];

  // Add new product mutation
  const addProductMutation = useMutation({
    mutationFn: async (product: ProductFormValues) => {
      return await apiRequest("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...product,
          sellerId: user?.id,
        }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products/seller"] });
      setIsAddDialogOpen(false);
      toast({
        title: "Product added",
        description: "Your product has been added successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add product. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Edit product mutation
  const editProductMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<Product> }) => {
      return await apiRequest(`/api/products/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products/seller"] });
      setIsEditDialogOpen(false);
      setSelectedProduct(null);
      toast({
        title: "Product updated",
        description: "Your product has been updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update product. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Delete product mutation
  const deleteProductMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest(`/api/products/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products/seller"] });
      toast({
        title: "Product deleted",
        description: "Your product has been deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete product. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Form for adding new product
  const addForm = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "vegetables",
      price: 0,
      quantity: 0,
      unit: "kg",
      imageUrl: "",
      available: true,
      location: "",
      county: user?.county || "",
      organic: false,
    },
  });

  // Form for editing product
  const editForm = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "",
      price: 0,
      quantity: 0,
      unit: "",
      imageUrl: "",
      available: true,
      location: "",
      county: "",
      organic: false,
    },
  });

  // Handle adding new product
  const onAddSubmit = (values: ProductFormValues) => {
    addProductMutation.mutate(values);
  };

  // Handle editing product
  const onEditSubmit = (values: ProductFormValues) => {
    if (selectedProduct) {
      editProductMutation.mutate({
        id: selectedProduct.id,
        data: values,
      });
    }
  };

  // Open edit dialog and set form values
  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    editForm.reset({
      name: product.name,
      description: product.description,
      category: product.category,
      price: product.price,
      quantity: product.quantity,
      unit: product.unit,
      imageUrl: product.imageUrl || "",
      available: product.available,
      location: product.location || "",
      county: product.county || "",
      organic: product.organic || false,
    });
    setIsEditDialogOpen(true);
  };

  // Handle deleting product
  const handleDeleteProduct = (id: number) => {
    if (confirm("Are you sure you want to delete this product?")) {
      deleteProductMutation.mutate(id);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-10 px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Manage Products</h1>
            <p className="text-muted-foreground">Add and manage your farm products</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Product
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Product</DialogTitle>
                  <DialogDescription>
                    Fill in the details to add a new farm product
                  </DialogDescription>
                </DialogHeader>
                <Form {...addForm}>
                  <form onSubmit={addForm.handleSubmit(onAddSubmit)} className="space-y-4 pt-4">
                    <FormField
                      control={addForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Product Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Fresh Tomatoes" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={addForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Describe your product..." 
                              className="resize-none" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={addForm.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="vegetables">Vegetables</SelectItem>
                                <SelectItem value="fruits">Fruits</SelectItem>
                                <SelectItem value="dairy">Dairy</SelectItem>
                                <SelectItem value="grains">Grains</SelectItem>
                                <SelectItem value="meat">Meat</SelectItem>
                                <SelectItem value="poultry">Poultry</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={addForm.control}
                        name="unit"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Unit</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select unit" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="kg">Kilograms (kg)</SelectItem>
                                <SelectItem value="g">Grams (g)</SelectItem>
                                <SelectItem value="piece">Piece(s)</SelectItem>
                                <SelectItem value="dozen">Dozen</SelectItem>
                                <SelectItem value="crate">Crate</SelectItem>
                                <SelectItem value="bunch">Bunch</SelectItem>
                                <SelectItem value="liter">Liter(s)</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={addForm.control}
                        name="price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Price (KES)</FormLabel>
                            <FormControl>
                              <Input type="number" min="0" step="0.01" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={addForm.control}
                        name="quantity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Quantity</FormLabel>
                            <FormControl>
                              <Input type="number" min="0" step="1" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={addForm.control}
                      name="imageUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Product Image</FormLabel>
                          <div className="space-y-4">
                            <FormControl>
                              <Input placeholder="Image URL" {...field} />
                            </FormControl>
                            
                            <div className="flex items-center gap-4">
                              <div className="relative flex-1">
                                <Input 
                                  type="file" 
                                  accept="image/*"
                                  className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                  onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;
                                    
                                    // Create FormData
                                    const formData = new FormData();
                                    formData.append('image', file);
                                    
                                    try {
                                      // Upload the image
                                      const response = await fetch('/api/upload', {
                                        method: 'POST',
                                        headers: {
                                          'user-id': String(user?.id)
                                        },
                                        body: formData
                                      });
                                      
                                      if (!response.ok) {
                                        throw new Error('Upload failed');
                                      }
                                      
                                      const data = await response.json();
                                      
                                      // Set the imageUrl field
                                      field.onChange(data.imageUrl);
                                      
                                      toast({
                                        title: "Upload successful",
                                        description: "Image has been uploaded and added to the product",
                                      });
                                    } catch (error) {
                                      toast({
                                        title: "Upload failed",
                                        description: "Failed to upload image. Please try again.",
                                        variant: "destructive",
                                      });
                                    }
                                  }}
                                />
                                <Button 
                                  type="button" 
                                  variant="outline" 
                                  className="w-full relative z-0"
                                >
                                  <Plus className="mr-2 h-4 w-4" />
                                  Upload Image
                                </Button>
                              </div>
                              {field.value && (
                                <div className="h-20 w-20 overflow-hidden rounded-md border">
                                  <img 
                                    src={field.value} 
                                    alt="Product preview" 
                                    className="h-full w-full object-cover"
                                    onError={(e) => {
                                      // Handle broken image
                                      e.currentTarget.src = 'https://placehold.co/80x80?text=No+Image';
                                    }}
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                          <FormDescription>
                            Enter a URL or upload an image for your product
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={addForm.control}
                      name="county"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>County</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            value={field.value || ""}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select county" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="nairobi">Nairobi</SelectItem>
                              <SelectItem value="mombasa">Mombasa</SelectItem>
                              <SelectItem value="kisumu">Kisumu</SelectItem>
                              <SelectItem value="nakuru">Nakuru</SelectItem>
                              <SelectItem value="eldoret">Eldoret</SelectItem>
                              <SelectItem value="kiambu">Kiambu</SelectItem>
                              <SelectItem value="machakos">Machakos</SelectItem>
                              <SelectItem value="nyeri">Nyeri</SelectItem>
                              <SelectItem value="kakamega">Kakamega</SelectItem>
                              <SelectItem value="kisii">Kisii</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={addForm.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Farm Location</FormLabel>
                          <FormControl>
                            <Input placeholder="Specific location of your farm" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={addForm.control}
                        name="organic"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-0.5">
                              <FormLabel>Organic</FormLabel>
                              <FormDescription>
                                Is this product organic?
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={addForm.control}
                        name="available"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-0.5">
                              <FormLabel>Available</FormLabel>
                              <FormDescription>
                                Is this product available?
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <DialogFooter>
                      <Button type="submit" disabled={addProductMutation.isPending}>
                        {addProductMutation.isPending ? "Adding..." : "Add Product"}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Product Categories Tabs */}
        <Tabs defaultValue="all" className="mb-8">
          <TabsList className="grid grid-cols-3 md:grid-cols-7 w-full">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="vegetables">Vegetables</TabsTrigger>
            <TabsTrigger value="fruits">Fruits</TabsTrigger>
            <TabsTrigger value="dairy">Dairy</TabsTrigger>
            <TabsTrigger value="grains">Grains</TabsTrigger>
            <TabsTrigger value="meat">Meat</TabsTrigger>
            <TabsTrigger value="poultry">Poultry</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* List of Products */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : products && products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
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
                      <Package className="h-12 w-12" />
                    </div>
                  )}
                  {product.organic && (
                    <Badge className="absolute top-2 right-2 bg-green-600">
                      <Leaf className="h-3 w-3 mr-1" /> Organic
                    </Badge>
                  )}
                  {!product.available && (
                    <Badge className="absolute top-2 left-2 bg-red-500">
                      <AlertTriangle className="h-3 w-3 mr-1" /> Unavailable
                    </Badge>
                  )}
                </div>
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <CardTitle className="text-lg">{product.name}</CardTitle>
                    <span className="font-bold text-lg">
                      <Badge variant="secondary">
                        <Tag className="h-3 w-3 mr-1" />
                        KES {product.price.toFixed(2)}
                      </Badge>
                    </span>
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
                <CardFooter className="flex justify-between gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleEditProduct(product)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleDeleteProduct(product.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-medium mb-2">No Products Yet</h3>
            <p className="text-muted-foreground mb-8">
              You haven't added any products yet. Get started by adding your first product.
            </p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add First Product
            </Button>
          </div>
        )}

        {/* Edit Product Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Product</DialogTitle>
              <DialogDescription>
                Update your product information
              </DialogDescription>
            </DialogHeader>
            <Form {...editForm}>
              <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4 pt-4">
                <FormField
                  control={editForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Fresh Tomatoes" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={editForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe your product..." 
                          className="resize-none" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={editForm.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="vegetables">Vegetables</SelectItem>
                            <SelectItem value="fruits">Fruits</SelectItem>
                            <SelectItem value="dairy">Dairy</SelectItem>
                            <SelectItem value="grains">Grains</SelectItem>
                            <SelectItem value="meat">Meat</SelectItem>
                            <SelectItem value="poultry">Poultry</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={editForm.control}
                    name="unit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Unit</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select unit" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="kg">Kilograms (kg)</SelectItem>
                            <SelectItem value="g">Grams (g)</SelectItem>
                            <SelectItem value="piece">Piece(s)</SelectItem>
                            <SelectItem value="dozen">Dozen</SelectItem>
                            <SelectItem value="crate">Crate</SelectItem>
                            <SelectItem value="bunch">Bunch</SelectItem>
                            <SelectItem value="liter">Liter(s)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={editForm.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price (KES)</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" step="0.01" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={editForm.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantity</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" step="1" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={editForm.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Image</FormLabel>
                      <div className="space-y-4">
                        <FormControl>
                          <Input placeholder="Image URL" {...field} />
                        </FormControl>
                        
                        <div className="flex items-center gap-4">
                          <div className="relative flex-1">
                            <Input 
                              type="file" 
                              accept="image/*"
                              className="absolute inset-0 opacity-0 cursor-pointer z-10"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                
                                // Create FormData
                                const formData = new FormData();
                                formData.append('image', file);
                                
                                try {
                                  // Upload the image
                                  const response = await fetch('/api/upload', {
                                    method: 'POST',
                                    headers: {
                                      'user-id': String(user?.id)
                                    },
                                    body: formData
                                  });
                                  
                                  if (!response.ok) {
                                    throw new Error('Upload failed');
                                  }
                                  
                                  const data = await response.json();
                                  
                                  // Set the imageUrl field
                                  field.onChange(data.imageUrl);
                                  
                                  toast({
                                    title: "Upload successful",
                                    description: "Image has been uploaded and added to the product",
                                  });
                                } catch (error) {
                                  toast({
                                    title: "Upload failed",
                                    description: "Failed to upload image. Please try again.",
                                    variant: "destructive",
                                  });
                                }
                              }}
                            />
                            <Button 
                              type="button" 
                              variant="outline" 
                              className="w-full relative z-0"
                            >
                              <Plus className="mr-2 h-4 w-4" />
                              Update Image
                            </Button>
                          </div>
                          {field.value && (
                            <div className="h-20 w-20 overflow-hidden rounded-md border">
                              <img 
                                src={field.value} 
                                alt="Product preview" 
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                  // Handle broken image
                                  e.currentTarget.src = 'https://placehold.co/80x80?text=No+Image';
                                }}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                      <FormDescription>
                        Enter a URL or upload an image for your product
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={editForm.control}
                  name="county"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>County</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        value={field.value || ""}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select county" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="nairobi">Nairobi</SelectItem>
                          <SelectItem value="mombasa">Mombasa</SelectItem>
                          <SelectItem value="kisumu">Kisumu</SelectItem>
                          <SelectItem value="nakuru">Nakuru</SelectItem>
                          <SelectItem value="eldoret">Eldoret</SelectItem>
                          <SelectItem value="kiambu">Kiambu</SelectItem>
                          <SelectItem value="machakos">Machakos</SelectItem>
                          <SelectItem value="nyeri">Nyeri</SelectItem>
                          <SelectItem value="kakamega">Kakamega</SelectItem>
                          <SelectItem value="kisii">Kisii</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={editForm.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Farm Location</FormLabel>
                      <FormControl>
                        <Input placeholder="Specific location of your farm" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={editForm.control}
                    name="organic"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-0.5">
                          <FormLabel>Organic</FormLabel>
                          <FormDescription>
                            Is this product organic?
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={editForm.control}
                    name="available"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-0.5">
                          <FormLabel>Available</FormLabel>
                          <FormDescription>
                            Is this product available?
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
                
                <DialogFooter>
                  <Button type="submit" disabled={editProductMutation.isPending}>
                    {editProductMutation.isPending ? "Updating..." : "Update Product"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}