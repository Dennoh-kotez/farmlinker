import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/toaster";
import NotFound from "./pages/not-found";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import SellerDashboard from "./pages/SellerDashboard";
import Products from "./pages/Products";
import SellerProducts from "./pages/SellerProducts";
import { AuthProvider } from "./contexts/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import SellerRoute from "./components/SellerRoute";

function Router() {
  return (
    <Switch>
      {/* Public Routes */}
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/products" component={Products} />
      
      {/* Buyer Routes (authenticated) */}
      <Route path="/dashboard">
        {() => <PrivateRoute component={Dashboard} />}
      </Route>
      
      {/* Seller Routes */}
      <Route path="/seller/dashboard">
        {() => <SellerRoute component={SellerDashboard} />}
      </Route>
      <Route path="/seller/products">
        {() => <SellerRoute component={SellerProducts} />}
      </Route>
      
      {/* Not Found */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
