import React, { useState, useEffect } from 'react';
import { Search, Filter, ShoppingCart, Star, Eye, Heart, Plus, Minus, X, Truck, Shield, RefreshCw } from 'lucide-react';
import { useCartStore } from '../store/cart';
import { getProducts } from '../lib/firestore';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import toast from 'react-hot-toast';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  stock: number;
  featured: boolean;
  discount?: number;
  rating?: number;
  reviews_count?: number;
  createdAt?: any;
  updatedAt?: any;
  details?: {
    brand?: string;
    weight?: string;
    ingredients?: string[];
    benefits?: string[];
  };
}

const Shop: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [sortBy, setSortBy] = useState('name');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState<string[]>([]);

  const { addItem, items } = useCartStore();

  useEffect(() => {
    // Écoute en temps réel des produits
    const q = collection(db, 'products');
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      try {
        const productsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Product[];
        setProducts(productsData);
        setFilteredProducts(productsData);
        setLoading(false);
      } catch (error) {
        console.error('Erreur lors du traitement des produits:', error);
        toast.error('Erreur lors du chargement des produits');
        setProducts([]);
        setFilteredProducts([]);
        setLoading(false);
      }
    }, (error) => {
      console.error('Erreur écoute produits:', error);
      toast.error('Erreur lors du chargement des produits');
      setProducts([]);
      setFilteredProducts([]);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts();
      const productsData = (data || []) as Product[];
      setProducts(productsData);
      setFilteredProducts(productsData);
    } catch (error) {
      console.error('Erreur lors du chargement des produits:', error);
      toast.error('Erreur lors du chargement des produits');
      setProducts([]);
      setFilteredProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      
      return matchesSearch && matchesCategory && matchesPrice;
    });

    // Tri
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'newest':
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory, priceRange, sortBy]);

  const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))];

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image_url,
      quantity: 1
    });
    toast.success(`${product.name} ajouté au panier !`);
  };

  const toggleWishlist = (productId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setWishlist(prev => {
      const isInWishlist = prev.includes(productId);
      if (isInWishlist) {
        toast.success('Retiré de la liste de souhaits');
        return prev.filter(id => id !== productId);
      } else {
        toast.success('Ajouté à la liste de souhaits');
        return [...prev, productId];
      }
    });
  };

  const getItemQuantity = (productId: string) => {
    const item = items.find(item => item.id === productId);
    return item ? item.quantity : 0;
  };

  const getFinalPrice = (product: Product) => {
    return product.discount 
      ? Math.round(product.price * (1 - product.discount / 100))
      : product.price;
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des produits...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Boutique BBP Performance</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez notre sélection de produits de fitness et nutrition pour optimiser vos performances
          </p>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-3xl font-bold text-red-600">{products.length}</div>
            <div className="text-gray-600">Produits</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-3xl font-bold text-green-600">{categories.length - 1}</div>
            <div className="text-gray-600">Catégories</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-3xl font-bold text-blue-600">
              <Truck className="h-8 w-8 mx-auto" />
            </div>
            <div className="text-gray-600">Livraison gratuite</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-3xl font-bold text-purple-600">
              <Shield className="h-8 w-8 mx-auto" />
            </div>
            <div className="text-gray-600">Paiement sécurisé</div>
          </div>
        </div>

        {/* Barre de recherche et filtres */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Recherche */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Rechercher un produit..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>

            {/* Bouton filtres mobile */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center justify-center px-4 py-3 bg-red-600 text-white rounded-lg"
            >
              <Filter className="h-5 w-5 mr-2" />
              Filtres
            </button>

            {/* Tri */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
            >
              <option value="name">Nom A-Z</option>
              <option value="price-low">Prix croissant</option>
              <option value="price-high">Prix décroissant</option>
              <option value="rating">Mieux notés</option>
              <option value="newest">Plus récents</option>
            </select>

            <button
              onClick={fetchProducts}
              className="flex items-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <RefreshCw className="h-5 w-5 mr-2" />
              Actualiser
            </button>
          </div>

          {/* Filtres desktop */}
          <div className="hidden lg:flex gap-6 mt-6 pt-6 border-t border-gray-200">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
              >
                <option value="all">Toutes les catégories</option>
                {categories.filter(cat => cat !== 'all').map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prix maximum: {priceRange[1].toLocaleString()} FCFA
              </label>
              <input
                type="range"
                min="0"
                max="100000"
                step="5000"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Panneau filtres mobile */}
        {showFilters && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden">
            <div className="absolute inset-x-0 bottom-0 bg-white rounded-t-lg p-6 max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">Filtres</h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="text-gray-500"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  >
                    <option value="all">Toutes les catégories</option>
                    {categories.filter(cat => cat !== 'all').map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prix maximum: {priceRange[1].toLocaleString()} FCFA
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100000"
                    step="5000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                    className="w-full"
                  />
                </div>
              </div>

              <button
                onClick={() => setShowFilters(false)}
                className="w-full mt-6 bg-red-600 text-white py-3 rounded-lg font-medium"
              >
                Appliquer les filtres
              </button>
            </div>
          </div>
        )}

        {/* Produits en vedette */}
        {products.some(p => p.featured) && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Produits en vedette</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.filter(p => p.featured).slice(0, 3).map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
                  onClick={() => setSelectedProduct(product)}
                >
                  <div className="relative">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Vedette
                    </div>
                    {product.discount && (
                      <div className="absolute top-4 right-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        -{product.discount}%
                      </div>
                    )}
                    <button
                      onClick={(e) => toggleWishlist(product.id, e)}
                      className="absolute bottom-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
                    >
                      <Heart className={`h-5 w-5 ${wishlist.includes(product.id) ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
                    </button>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-red-600 font-medium">{product.category}</span>
                      {product.rating && (
                        <div className="flex items-center">
                          <div className="flex">{renderStars(product.rating)}</div>
                          <span className="text-sm text-gray-500 ml-1">({product.reviews_count || 0})</span>
                        </div>
                      )}
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-red-600 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        {product.discount ? (
                          <>
                            <span className="text-2xl font-bold text-red-600">
                              {getFinalPrice(product).toLocaleString()} FCFA
                            </span>
                            <span className="text-lg text-gray-500 line-through">
                              {product.price.toLocaleString()} FCFA
                            </span>
                          </>
                        ) : (
                          <span className="text-2xl font-bold text-red-600">
                            {product.price.toLocaleString()} FCFA
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">
                        Stock: {product.stock}
                      </div>
                    </div>

                    <button
                      onClick={(e) => handleAddToCart(product, e)}
                      disabled={product.stock === 0}
                      className="w-full py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
                    >
                      {product.stock === 0 ? 'Rupture de stock' : 'Ajouter au panier'}
                    </button>

                    {getItemQuantity(product.id) > 0 && (
                      <div className="mt-3 text-center text-sm text-green-600 font-medium">
                        {getItemQuantity(product.id)} dans le panier
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Grille de produits */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Tous nos produits ({filteredProducts.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group"
                onClick={() => setSelectedProduct(product)}
              >
                <div className="relative">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {product.discount && (
                    <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">
                      -{product.discount}%
                    </div>
                  )}
                  {product.featured && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                      Vedette
                    </div>
                  )}
                  <div className="absolute bottom-2 right-2 flex space-x-2">
                    <button
                      onClick={(e) => toggleWishlist(product.id, e)}
                      className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
                    >
                      <Heart className={`h-4 w-4 ${wishlist.includes(product.id) ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setQuickViewProduct(product);
                      }}
                      className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
                    >
                      <Eye className="h-4 w-4 text-gray-600" />
                    </button>
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-red-600 font-medium">{product.category}</span>
                    {product.rating && (
                      <div className="flex items-center">
                        <div className="flex">{renderStars(product.rating)}</div>
                        <span className="text-xs text-gray-500 ml-1">({product.reviews_count || 0})</span>
                      </div>
                    )}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-red-600 transition-colors line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                  
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {product.discount ? (
                        <>
                          <span className="text-lg font-bold text-red-600">
                            {getFinalPrice(product).toLocaleString()} FCFA
                          </span>
                          <span className="text-sm text-gray-500 line-through">
                            {product.price.toLocaleString()} FCFA
                          </span>
                        </>
                      ) : (
                        <span className="text-lg font-bold text-red-600">
                          {product.price.toLocaleString()} FCFA
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-500">Stock: {product.stock}</span>
                  </div>

                  <button
                    onClick={(e) => handleAddToCart(product, e)}
                    disabled={product.stock === 0}
                    className="w-full py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                  >
                    {product.stock === 0 ? 'Rupture' : 'Ajouter au panier'}
                  </button>

                  {getItemQuantity(product.id) > 0 && (
                    <div className="mt-2 text-center text-xs text-green-600 font-medium">
                      {getItemQuantity(product.id)} dans le panier
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-16">
              <ShoppingCart className="mx-auto h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">Aucun produit trouvé</h3>
              <p className="text-gray-500 mb-4">
                Aucun produit ne correspond à vos critères de recherche.
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                  setPriceRange([0, 100000]);
                }}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Réinitialiser les filtres
              </button>
            </div>
          )}
        </div>

        {/* Modal produit détaillé */}
        {selectedProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 md:p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="text-sm text-red-600 font-medium">{selectedProduct.category}</span>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-1">{selectedProduct.name}</h2>
                  </div>
                  <button
                    onClick={() => setSelectedProduct(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <img
                      src={selectedProduct.image_url}
                      alt={selectedProduct.name}
                      className="w-full h-96 object-cover rounded-lg"
                    />
                  </div>

                  <div>
                    {selectedProduct.rating && (
                      <div className="flex items-center mb-4">
                        <div className="flex">{renderStars(selectedProduct.rating)}</div>
                        <span className="text-sm text-gray-500 ml-2">
                          ({selectedProduct.reviews_count || 0} avis)
                        </span>
                      </div>
                    )}

                    <p className="text-gray-600 mb-6">{selectedProduct.description}</p>

                    {selectedProduct.details?.benefits && (
                      <div className="mb-6">
                        <h4 className="font-semibold text-gray-900 mb-3">Bénéfices :</h4>
                        <ul className="space-y-2">
                          {selectedProduct.details.benefits.map((benefit, index) => (
                            <li key={index} className="flex items-center text-sm text-gray-700">
                              <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {selectedProduct.details?.ingredients && (
                      <div className="mb-6">
                        <h4 className="font-semibold text-gray-900 mb-3">Ingrédients principaux :</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedProduct.details.ingredients.map((ingredient, index) => (
                            <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                              {ingredient}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        {selectedProduct.discount ? (
                          <>
                            <span className="text-3xl font-bold text-red-600">
                              {getFinalPrice(selectedProduct).toLocaleString()} FCFA
                            </span>
                            <span className="text-xl text-gray-500 line-through">
                              {selectedProduct.price.toLocaleString()} FCFA
                            </span>
                          </>
                        ) : (
                          <span className="text-3xl font-bold text-red-600">
                            {selectedProduct.price.toLocaleString()} FCFA
                          </span>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500">Stock disponible</div>
                        <div className="text-lg font-semibold text-gray-900">{selectedProduct.stock}</div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <button
                        onClick={(e) => {
                          handleAddToCart(selectedProduct, e);
                          setSelectedProduct(null);
                        }}
                        disabled={selectedProduct.stock === 0}
                        className="w-full py-4 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium text-lg"
                      >
                        {selectedProduct.stock === 0 ? 'Produit en rupture de stock' : 'Ajouter au panier'}
                      </button>
                      
                      <button
                        onClick={(e) => toggleWishlist(selectedProduct.id, e)}
                        className="w-full py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                      >
                        {wishlist.includes(selectedProduct.id) ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                      </button>
                    </div>

                    {/* Informations de livraison */}
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-center text-blue-800 mb-2">
                        <Truck className="h-5 w-5 mr-2" />
                        <span className="font-medium">Livraison gratuite</span>
                      </div>
                      <p className="text-blue-700 text-sm">
                        Livraison gratuite à Dakar sous 24-48h
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal aperçu rapide */}
        {quickViewProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-900">{quickViewProduct.name}</h3>
                  <button
                    onClick={() => setQuickViewProduct(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <img
                    src={quickViewProduct.image_url}
                    alt={quickViewProduct.name}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  
                  <div>
                    <p className="text-gray-600 mb-4">{quickViewProduct.description}</p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-bold text-red-600">
                        {getFinalPrice(quickViewProduct).toLocaleString()} FCFA
                      </span>
                      <span className="text-sm text-gray-500">Stock: {quickViewProduct.stock}</span>
                    </div>

                    <div className="space-y-3">
                      <button
                        onClick={() => {
                          setSelectedProduct(quickViewProduct);
                          setQuickViewProduct(null);
                        }}
                        className="w-full py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        Voir tous les détails
                      </button>
                      <button
                        onClick={(e) => {
                          handleAddToCart(quickViewProduct, e);
                          setQuickViewProduct(null);
                        }}
                        disabled={quickViewProduct.stock === 0}
                        className="w-full py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                      >
                        Ajouter au panier
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Section garanties */}
        <div className="mt-16 bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">Nos garanties</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Qualité garantie</h3>
              <p className="text-gray-600">Produits authentiques et de haute qualité</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Livraison rapide</h3>
              <p className="text-gray-600">Livraison gratuite sous 24-48h à Dakar</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <RefreshCw className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Retour facile</h3>
              <p className="text-gray-600">Retour gratuit sous 14 jours</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;