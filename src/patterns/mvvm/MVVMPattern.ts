/**
 * MVVM (Model-View-ViewModel) PATTERN
 *
 * MVVM separates UI logic from business logic using data binding:
 * - Model: Data and business logic
 * - View: UI components (React components)
 * - ViewModel: Exposes data and commands for the View, handles presentation logic
 *
 * Key difference from MVC/MVP:
 * - Two-way data binding between View and ViewModel
 * - ViewModel doesn't know about the View (no View interface)
 * - View binds to ViewModel properties and reacts to changes
 *
 * Benefits:
 * - Better testability (ViewModel can be tested without View)
 * - Clear separation of UI and presentation logic
 * - Reactive updates through data binding
 * - Highly reusable ViewModels
 */

import { mockApi } from '../../api/mockApi';

// ============================================
// MODEL - Data and Business Logic
// ============================================

export interface ProductItem {
  id: number;
  name: string;
  price: number;
  category: string;
  inStock: boolean;
  quantity: number;
}

export interface CartItemData {
  product: ProductItem;
  quantity: number;
}

export class ProductModel {
  private products: ProductItem[] = [];

  async fetchProducts(): Promise<ProductItem[]> {
    const apiProducts = await mockApi.products.getAll();
    this.products = apiProducts.map(p => ({
      ...p,
      quantity: Math.floor(Math.random() * 100) + 1,
    }));
    return this.products;
  }

  getProducts(): ProductItem[] {
    return [...this.products];
  }

  getProductById(id: number): ProductItem | undefined {
    return this.products.find(p => p.id === id);
  }

  getCategories(): string[] {
    return [...new Set(this.products.map(p => p.category))];
  }

  updateStock(id: number, quantity: number): void {
    const product = this.products.find(p => p.id === id);
    if (product) {
      product.quantity = Math.max(0, quantity);
      product.inStock = product.quantity > 0;
    }
  }
}


// ============================================
// VIEWMODEL - Presentation Logic and State
// ============================================

export type SortField = 'name' | 'price' | 'category';
export type SortOrder = 'asc' | 'desc';

export interface ProductViewModelState {
  products: ProductItem[];
  filteredProducts: ProductItem[];
  categories: string[];
  selectedCategory: string;
  searchQuery: string;
  sortField: SortField;
  sortOrder: SortOrder;
  loading: boolean;
  error: string | null;
  cart: CartItemData[];
  cartTotal: number;
  selectedProduct: ProductItem | null;
}

type StateListener = (state: ProductViewModelState) => void;

export class ProductViewModel {
  private model: ProductModel;
  private state: ProductViewModelState;
  private listeners: Set<StateListener> = new Set();

  constructor(model: ProductModel) {
    this.model = model;
    this.state = {
      products: [],
      filteredProducts: [],
      categories: [],
      selectedCategory: 'all',
      searchQuery: '',
      sortField: 'name',
      sortOrder: 'asc',
      loading: false,
      error: null,
      cart: [],
      cartTotal: 0,
      selectedProduct: null,
    };
  }

  // Observable pattern for data binding
  subscribe(listener: StateListener): () => void {
    this.listeners.add(listener);
    listener(this.state);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.listeners.forEach(listener => listener({ ...this.state }));
  }

  private setState(updates: Partial<ProductViewModelState>): void {
    this.state = { ...this.state, ...updates };
    this.notify();
  }

  // Computed property - applies all filters and sorting
  private updateFilteredProducts(): void {
    let filtered = [...this.state.products];

    // Apply category filter
    if (this.state.selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === this.state.selectedCategory);
    }

    // Apply search filter
    if (this.state.searchQuery) {
      const query = this.state.searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (this.state.sortField) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'price':
          comparison = a.price - b.price;
          break;
        case 'category':
          comparison = a.category.localeCompare(b.category);
          break;
      }
      return this.state.sortOrder === 'asc' ? comparison : -comparison;
    });

    this.setState({ filteredProducts: filtered });
  }

  // Computed property - cart total
  private updateCartTotal(): void {
    const total = this.state.cart.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
    this.setState({ cartTotal: total });
  }

  // Commands (actions that View can trigger)

  async loadProducts(): Promise<void> {
    this.setState({ loading: true, error: null });
    try {
      const products = await this.model.fetchProducts();
      const categories = this.model.getCategories();
      this.setState({
        products,
        categories,
        loading: false,
      });
      this.updateFilteredProducts();
    } catch (error) {
      this.setState({
        loading: false,
        error: 'Failed to load products',
      });
    }
  }

  setCategory(category: string): void {
    this.setState({ selectedCategory: category });
    this.updateFilteredProducts();
  }

  setSearchQuery(query: string): void {
    this.setState({ searchQuery: query });
    this.updateFilteredProducts();
  }

  setSortField(field: SortField): void {
    this.setState({ sortField: field });
    this.updateFilteredProducts();
  }

  toggleSortOrder(): void {
    this.setState({
      sortOrder: this.state.sortOrder === 'asc' ? 'desc' : 'asc',
    });
    this.updateFilteredProducts();
  }

  selectProduct(id: number | null): void {
    if (id === null) {
      this.setState({ selectedProduct: null });
    } else {
      const product = this.model.getProductById(id);
      this.setState({ selectedProduct: product || null });
    }
  }

  addToCart(productId: number, quantity: number = 1): void {
    const product = this.model.getProductById(productId);
    if (!product || !product.inStock) return;

    const existingIndex = this.state.cart.findIndex(
      item => item.product.id === productId
    );

    let newCart: CartItemData[];

    if (existingIndex !== -1) {
      newCart = [...this.state.cart];
      newCart[existingIndex] = {
        ...newCart[existingIndex],
        quantity: newCart[existingIndex].quantity + quantity,
      };
    } else {
      newCart = [...this.state.cart, { product, quantity }];
    }

    this.setState({ cart: newCart });
    this.updateCartTotal();

    // Update stock
    this.model.updateStock(productId, product.quantity - quantity);
    this.setState({ products: this.model.getProducts() });
    this.updateFilteredProducts();
  }

  removeFromCart(productId: number): void {
    const item = this.state.cart.find(i => i.product.id === productId);
    if (!item) return;

    // Restore stock
    const product = this.model.getProductById(productId);
    if (product) {
      this.model.updateStock(productId, product.quantity + item.quantity);
      this.setState({ products: this.model.getProducts() });
      this.updateFilteredProducts();
    }

    const newCart = this.state.cart.filter(i => i.product.id !== productId);
    this.setState({ cart: newCart });
    this.updateCartTotal();
  }

  updateCartQuantity(productId: number, newQuantity: number): void {
    if (newQuantity <= 0) {
      this.removeFromCart(productId);
      return;
    }

    const item = this.state.cart.find(i => i.product.id === productId);
    if (!item) return;

    const diff = newQuantity - item.quantity;
    const product = this.model.getProductById(productId);

    if (product && product.quantity >= diff) {
      this.model.updateStock(productId, product.quantity - diff);
      this.setState({ products: this.model.getProducts() });
      this.updateFilteredProducts();

      const newCart = this.state.cart.map(i =>
        i.product.id === productId ? { ...i, quantity: newQuantity } : i
      );
      this.setState({ cart: newCart });
      this.updateCartTotal();
    }
  }

  clearCart(): void {
    // Restore all stock
    this.state.cart.forEach(item => {
      const product = this.model.getProductById(item.product.id);
      if (product) {
        this.model.updateStock(item.product.id, product.quantity + item.quantity);
      }
    });

    this.setState({
      cart: [],
      cartTotal: 0,
      products: this.model.getProducts(),
    });
    this.updateFilteredProducts();
  }

  clearError(): void {
    this.setState({ error: null });
  }

  // Getters for read-only access
  getState(): ProductViewModelState {
    return { ...this.state };
  }
}


// ============================================
// Custom React Hook for MVVM binding
// ============================================

import { useState, useEffect, useMemo } from 'react';

export const useProductViewModel = () => {
  const model = useMemo(() => new ProductModel(), []);
  const viewModel = useMemo(() => new ProductViewModel(model), [model]);
  const [state, setState] = useState<ProductViewModelState>(viewModel.getState());

  useEffect(() => {
    const unsubscribe = viewModel.subscribe(setState);
    viewModel.loadProducts();
    return unsubscribe;
  }, [viewModel]);

  return {
    state,
    // Expose commands
    setCategory: (cat: string) => viewModel.setCategory(cat),
    setSearchQuery: (query: string) => viewModel.setSearchQuery(query),
    setSortField: (field: SortField) => viewModel.setSortField(field),
    toggleSortOrder: () => viewModel.toggleSortOrder(),
    selectProduct: (id: number | null) => viewModel.selectProduct(id),
    addToCart: (id: number, qty?: number) => viewModel.addToCart(id, qty),
    removeFromCart: (id: number) => viewModel.removeFromCart(id),
    updateCartQuantity: (id: number, qty: number) => viewModel.updateCartQuantity(id, qty),
    clearCart: () => viewModel.clearCart(),
    clearError: () => viewModel.clearError(),
    reload: () => viewModel.loadProducts(),
  };
};
