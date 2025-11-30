import { useProductViewModel } from "./MVVMPattern";
import type { SortField } from "./MVVMPattern";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { CodeBlock } from "@/components/ui/code-block";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/**
 * MVVM Pattern Demo Component
 *
 * This View binds to the ViewModel through a custom hook.
 * The View automatically updates when ViewModel state changes.
 */
export const MVVMPatternDemo = () => {
  const {
    state,
    setCategory,
    setSearchQuery,
    setSortField,
    toggleSortOrder,
    selectProduct,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
  } = useProductViewModel();

  const {
    filteredProducts,
    categories,
    selectedCategory,
    searchQuery,
    sortField,
    sortOrder,
    loading,
    error,
    cart,
    cartTotal,
    selectedProduct,
  } = state;

  return (
    <div className="space-y-8">
      <PageHeader
        title="MVVM (Model-View-ViewModel)"
        description="Uses data binding between View and ViewModel for reactive updates."
        badge={{ text: "Architecture", variant: "arch" }}
      />

      <Card>
        <CardHeader>
          <CardTitle>What is MVVM?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            <strong>MVVM</strong> uses data binding to connect View and
            ViewModel:
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-1">
            <li>
              <strong>Model:</strong> Data and business logic (ProductModel)
            </li>
            <li>
              <strong>View:</strong> React components that bind to ViewModel
            </li>
            <li>
              <strong>ViewModel:</strong> Exposes state and commands
              (ProductViewModel)
            </li>
          </ul>
          <div className="flex flex-wrap items-center justify-center gap-3 py-4">
            <Badge className="bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300 px-4 py-2">
              View
            </Badge>
            <div className="text-center">
              <div className="text-muted-foreground text-sm">
                ⇅ Data Binding
              </div>
            </div>
            <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300 px-4 py-2">
              ViewModel
            </Badge>
            <span className="text-muted-foreground">↔</span>
            <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 px-4 py-2">
              Model
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground italic">
            Key: View binds to ViewModel properties. ViewModel doesn't know
            about View.
          </p>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <div className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 p-4 rounded-lg">
          {error}
        </div>
      )}

      {/* Main Layout */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Products Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Filters (Two-way Binding)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Category:</span>
                  <Select value={selectedCategory} onValueChange={setCategory}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Search:</span>
                  <Input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="w-48"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Sort By:</span>
                  <Select
                    value={sortField}
                    onValueChange={(value) => setSortField(value as SortField)}
                  >
                    <SelectTrigger className="w-28">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">Name</SelectItem>
                      <SelectItem value="price">Price</SelectItem>
                      <SelectItem value="category">Category</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm" onClick={toggleSortOrder}>
                    {sortOrder === "asc" ? "↑ Asc" : "↓ Desc"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Products Grid */}
          <Card>
            <CardHeader>
              <CardTitle>Products ({filteredProducts.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-12 text-muted-foreground">
                  Loading products...
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {filteredProducts.map((product) => (
                    <Card
                      key={product.id}
                      className={`cursor-pointer transition-all hover:shadow-lg ${
                        !product.inStock ? "opacity-60" : ""
                      } ${
                        selectedProduct?.id === product.id
                          ? "ring-2 ring-primary"
                          : ""
                      }`}
                      onClick={() => selectProduct(product.id)}
                    >
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-sm">
                            {product.name}
                          </h4>
                          <Badge variant="outline" className="text-xs">
                            {product.category}
                          </Badge>
                        </div>
                        <p className="text-2xl font-bold text-primary">
                          ${product.price.toFixed(2)}
                        </p>
                        <p
                          className={`text-sm ${product.inStock ? "text-green-500" : "text-red-500"}`}
                        >
                          {product.inStock
                            ? `${product.quantity} in stock`
                            : "Out of stock"}
                        </p>
                        <Button
                          className="w-full mt-3"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(product.id);
                          }}
                          disabled={!product.inStock}
                        >
                          Add to Cart
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Selected Product Detail */}
          {selectedProduct && (
            <Card className="bg-blue-50 dark:bg-blue-950">
              <CardHeader>
                <CardTitle>
                  Product Detail (Selected: {selectedProduct.name})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-background p-4 rounded-lg space-y-2">
                  <h4 className="font-bold text-lg">{selectedProduct.name}</h4>
                  <p>Category: {selectedProduct.category}</p>
                  <p>Price: ${selectedProduct.price.toFixed(2)}</p>
                  <p>Stock: {selectedProduct.quantity}</p>
                  <p>
                    Status:{" "}
                    {selectedProduct.inStock ? "Available" : "Out of Stock"}
                  </p>
                  <Button variant="outline" onClick={() => selectProduct(null)}>
                    Close
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Cart Section */}
        <div>
          <Card className="sticky top-6 bg-muted/50">
            <CardHeader>
              <CardTitle>Shopping Cart ({cart.length} items)</CardTitle>
            </CardHeader>
            <CardContent>
              {cart.length === 0 ? (
                <p className="text-center text-muted-foreground italic py-8">
                  Your cart is empty
                </p>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-3">
                    {cart.map((item) => (
                      <div
                        key={item.product.id}
                        className="flex items-center gap-3 p-3 bg-background rounded-lg border"
                      >
                        <div className="flex-1">
                          <div className="font-semibold text-sm">
                            {item.product.name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            ${item.product.price.toFixed(2)} each
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-7 w-7"
                            onClick={() =>
                              updateCartQuantity(
                                item.product.id,
                                item.quantity - 1
                              )
                            }
                          >
                            -
                          </Button>
                          <span className="w-8 text-center font-medium">
                            {item.quantity}
                          </span>
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-7 w-7"
                            onClick={() =>
                              updateCartQuantity(
                                item.product.id,
                                item.quantity + 1
                              )
                            }
                          >
                            +
                          </Button>
                          <Button
                            size="icon"
                            variant="destructive"
                            className="h-7 w-7 ml-1"
                            onClick={() => removeFromCart(item.product.id)}
                          >
                            ×
                          </Button>
                        </div>
                        <div className="w-16 text-right font-semibold">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-green-100 dark:bg-green-900 p-4 rounded-lg text-right">
                    <strong className="text-lg">
                      Total: ${cartTotal.toFixed(2)}
                    </strong>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={clearCart}
                    >
                      Clear Cart
                    </Button>
                    <Button className="flex-1">Checkout</Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Code Example */}
      <Card>
        <CardHeader>
          <CardTitle>MVVM with React Hook</CardTitle>
        </CardHeader>
        <CardContent>
          <CodeBlock
            language="typescript"
            code={`// ViewModel - Exposes state and commands
class ProductViewModel {
  private state: ViewModelState;
  private listeners: Set<Listener>;

  // Observable state
  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  // Commands
  setCategory(category: string) {
    this.setState({ selectedCategory: category });
    this.updateFilteredProducts(); // Computed property
  }

  addToCart(productId: number) {
    // Update state, notify listeners automatically
  }
}

// Custom Hook - Data binding layer
const useProductViewModel = () => {
  const viewModel = useMemo(() => new ProductViewModel(), []);
  const [state, setState] = useState(viewModel.getState());

  useEffect(() => {
    // Two-way binding: View updates when ViewModel changes
    return viewModel.subscribe(setState);
  }, [viewModel]);

  return {
    state,
    // Expose commands for View to call
    setCategory: (cat) => viewModel.setCategory(cat),
    addToCart: (id) => viewModel.addToCart(id),
  };
};

// View - Binds to ViewModel
const ProductView = () => {
  const { state, setCategory, addToCart } = useProductViewModel();

  // View automatically updates when state changes
  return (
    <select
      value={state.selectedCategory}
      onChange={(e) => setCategory(e.target.value)}
    />
  );
};`}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default MVVMPatternDemo;
