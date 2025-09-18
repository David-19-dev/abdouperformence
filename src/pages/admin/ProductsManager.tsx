import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, X, Eye, Star, Package, TrendingUp, DollarSign, AlertTriangle, CheckCircle, Upload, Download, Filter } from 'lucide-react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, Timestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
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

const ProductsManager: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    image_url: '',
    featured: false,
    discount: '',
    rating: '',
    reviews_count: '',
    brand: '',
    weight: '',
    ingredients: '',
    benefits: ''
  });

  const categories = [
    'Protéines',
    'Acides Aminés',
    'Pré-workout',
    'Post-workout',
    'Vitamines',
    'Minéraux',
    'Brûleurs de graisse',
    'Créatine',
    'Accessoires',
    'Vêtements',
    'Équipements'
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, categoryFilter, stockFilter]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const productsCollection = collection(db, 'products');
      const productsSnapshot = await getDocs(productsCollection);
      const productsData = productsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];
      setProducts(productsData);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Erreur lors du chargement des produits');
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = [...products];

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(product => product.category === categoryFilter);
    }

    if (stockFilter !== 'all') {
      if (stockFilter === 'in-stock') {
        filtered = filtered.filter(product => product.stock > 0);
      } else if (stockFilter === 'low-stock') {
        filtered = filtered.filter(product => product.stock > 0 && product.stock <= 10);
      } else if (stockFilter === 'out-of-stock') {
        filtered = filtered.filter(product => product.stock === 0);
      }
    }

    setFilteredProducts(filtered);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseInt(formData.price),
        category: formData.category,
        stock: parseInt(formData.stock),
        image_url: formData.image_url,
        featured: formData.featured,
        discount: formData.discount ? parseInt(formData.discount) : undefined,
        rating: formData.rating ? parseFloat(formData.rating) : undefined,
        reviews_count: formData.reviews_count ? parseInt(formData.reviews_count) : undefined,
        details: {
          brand: formData.brand || undefined,
          weight: formData.weight || undefined,
          ingredients: formData.ingredients ? formData.ingredients.split(',').map(i => i.trim()) : undefined,
          benefits: formData.benefits ? formData.benefits.split(',').map(b => b.trim()) : undefined
        },
      createdAt: currentProduct?.createdAt || Timestamp.now(),
      updatedAt: Timestamp.now()
      };

      if (currentProduct) {
        const productRef = doc(db, 'products', currentProduct.id);
        await updateDoc(productRef, productData);
        toast.success('Produit mis à jour avec succès');
      } else {
        await addDoc(collection(db, 'products'), productData);
        toast.success('Produit créé avec succès');
      }

      setIsModalOpen(false);
      setCurrentProduct(null);
      resetForm();
      fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Erreur lors de l\'enregistrement du produit');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product: Product) => {
    setCurrentProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      stock: product.stock.toString(),
      image_url: product.image_url,
      featured: product.featured,
      discount: product.discount?.toString() || '',
      rating: product.rating?.toString() || '',
      reviews_count: product.reviews_count?.toString() || '',
      brand: product.details?.brand || '',
      weight: product.details?.weight || '',
      ingredients: product.details?.ingredients?.join(', ') || '',
      benefits: product.details?.benefits?.join(', ') || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      try {
        await deleteDoc(doc(db, 'products', id));
        toast.success('Produit supprimé avec succès');
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
        toast.error('Erreur lors de la suppression du produit');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      stock: '',
      image_url: '',
      featured: false,
      discount: '',
      rating: '',
      reviews_count: '',
      brand: '',
      weight: '',
      ingredients: '',
      benefits: ''
    });
  };

  const exportProducts = () => {
    const csvContent = [
      ['ID', 'Nom', 'Description', 'Prix', 'Catégorie', 'Stock', 'Vedette', 'Remise', 'Note', 'Avis'].join(','),
      ...filteredProducts.map(product => [
        product.id.slice(0, 8),
        `"${product.name}"`,
        `"${product.description}"`,
        product.price,
        product.category,
        product.stock,
        product.featured ? 'Oui' : 'Non',
        product.discount || 0,
        product.rating || 0,
        product.reviews_count || 0
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `produits_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Export CSV généré avec succès');
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: 'Rupture', color: 'bg-red-100 text-red-800' };
    if (stock <= 10) return { label: 'Stock faible', color: 'bg-yellow-100 text-yellow-800' };
    return { label: 'En stock', color: 'bg-green-100 text-green-800' };
  };

  const stats = {
    total: products.length,
    inStock: products.filter(p => p.stock > 0).length,
    lowStock: products.filter(p => p.stock > 0 && p.stock <= 10).length,
    outOfStock: products.filter(p => p.stock === 0).length,
    featured: products.filter(p => p.featured).length,
    totalValue: products.reduce((sum, p) => sum + (p.price * p.stock), 0)
  };

  return (
    <div>
      {/* Header avec statistiques */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion des Produits</h1>
            <p className="text-gray-600 mt-1">Gérez votre catalogue de produits</p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={exportProducts}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <Download className="h-5 w-5 mr-2" />
              Exporter
            </button>
            <button
              onClick={() => {
                setCurrentProduct(null);
                resetForm();
                setIsModalOpen(true);
              }}
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              <Plus className="h-5 w-5 mr-2" />
              Nouveau Produit
            </button>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Total</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">En stock</p>
                <p className="text-2xl font-bold text-gray-900">{stats.inStock}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Stock faible</p>
                <p className="text-2xl font-bold text-gray-900">{stats.lowStock}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <X className="h-8 w-8 text-red-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Rupture</p>
                <p className="text-2xl font-bold text-gray-900">{stats.outOfStock}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <Star className="h-8 w-8 text-purple-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Vedettes</p>
                <p className="text-2xl font-bold text-gray-900">{stats.featured}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Valeur stock</p>
                <p className="text-lg font-bold text-gray-900">{(stats.totalValue / 1000).toFixed(0)}K FCFA</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rechercher</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Nom, description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
            >
              <option value="all">Toutes les catégories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Stock</label>
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
            >
              <option value="all">Tous les stocks</option>
              <option value="in-stock">En stock</option>
              <option value="low-stock">Stock faible (≤10)</option>
              <option value="out-of-stock">Rupture de stock</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('');
                setCategoryFilter('all');
                setStockFilter('all');
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Réinitialiser
            </button>
          </div>
        </div>
      </div>

      {/* Liste des produits */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          </div>
        ) : (
          <>
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <Package className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">Aucun produit trouvé</h3>
                <p className="text-gray-500 mb-4">
                  {products.length === 0 
                    ? 'Commencez par ajouter votre premier produit'
                    : 'Aucun produit ne correspond aux critères de recherche'
                  }
                </p>
                <button
                  onClick={() => {
                    setCurrentProduct(null);
                    resetForm();
                    setIsModalOpen(true);
                  }}
                  className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Ajouter un produit
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Produit
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Catégorie
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Prix
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Stock
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Note
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statut
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredProducts.map((product) => {
                      const stockStatus = getStockStatus(product.stock);
                      return (
                        <tr key={product.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-16 w-16 flex-shrink-0">
                                <img
                                  className="h-16 w-16 rounded-lg object-cover"
                                  src={product.image_url}
                                  alt={product.name}
                                />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900 max-w-xs">
                                  {product.name}
                                  {product.featured && (
                                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                                      Vedette
                                    </span>
                                  )}
                                </div>
                                <div className="text-sm text-gray-500 max-w-xs truncate">
                                  {product.description}
                                </div>
                                {product.details?.brand && (
                                  <div className="text-xs text-gray-400">
                                    Marque: {product.details.brand}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                              {product.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {product.discount ? (
                                <>
                                  <span className="font-bold text-red-600">
                                    {Math.round(product.price * (1 - product.discount / 100)).toLocaleString()} FCFA
                                  </span>
                                  <div className="text-xs text-gray-500 line-through">
                                    {product.price.toLocaleString()} FCFA
                                  </div>
                                  <div className="text-xs text-green-600">
                                    -{product.discount}%
                                  </div>
                                </>
                              ) : (
                                <span className="font-bold">
                                  {product.price.toLocaleString()} FCFA
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 font-medium">
                              {product.stock}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {product.rating ? (
                              <div className="flex items-center">
                                <div className="flex">
                                  {Array.from({ length: 5 }, (_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-4 w-4 ${
                                        i < product.rating! ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-sm text-gray-500 ml-1">
                                  ({product.reviews_count || 0})
                                </span>
                              </div>
                            ) : (
                              <span className="text-sm text-gray-400">Pas de note</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${stockStatus.color}`}>
                              {stockStatus.label}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end space-x-2">
                              <button
                                onClick={() => handleEdit(product)}
                                className="text-blue-600 hover:text-blue-900"
                                title="Modifier"
                              >
                                <Edit className="h-5 w-5" />
                              </button>
                              <button
                                onClick={() => setSelectedProduct(product)}
                                className="text-green-600 hover:text-green-900"
                                title="Voir détails"
                              >
                                <Eye className="h-5 w-5" />
                              </button>
                              <button
                                onClick={() => handleDelete(product.id)}
                                className="text-red-600 hover:text-red-900"
                                title="Supprimer"
                              >
                                <Trash2 className="h-5 w-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal pour créer/éditer un produit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-black opacity-50" onClick={() => setIsModalOpen(false)}></div>
            <div className="relative bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {currentProduct ? 'Modifier le Produit' : 'Nouveau Produit'}
                  </h2>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Informations de base */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations de base</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nom du produit *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Marque
                        </label>
                        <input
                          type="text"
                          name="brand"
                          value={formData.brand}
                          onChange={handleInputChange}
                          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500"
                          placeholder="Ex: Optimum Nutrition"
                        />
                      </div>
                    </div>

                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description *
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        URL de l'image *
                      </label>
                      <input
                        type="url"
                        name="image_url"
                        value={formData.image_url}
                        onChange={handleInputChange}
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500"
                        required
                      />
                      {formData.image_url && (
                        <div className="mt-2">
                          <img
                            src={formData.image_url}
                            alt="Aperçu"
                            className="h-32 w-32 object-cover rounded-lg"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Prix et stock */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Prix et stock</h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Prix (FCFA) *
                        </label>
                        <input
                          type="number"
                          name="price"
                          value={formData.price}
                          onChange={handleInputChange}
                          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Remise (%)
                        </label>
                        <input
                          type="number"
                          name="discount"
                          value={formData.discount}
                          onChange={handleInputChange}
                          min="0"
                          max="100"
                          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Stock *
                        </label>
                        <input
                          type="number"
                          name="stock"
                          value={formData.stock}
                          onChange={handleInputChange}
                          min="0"
                          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Poids/Taille
                        </label>
                        <input
                          type="text"
                          name="weight"
                          value={formData.weight}
                          onChange={handleInputChange}
                          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500"
                          placeholder="Ex: 2kg, 500ml"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Catégorie et évaluations */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Catégorie et évaluations</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Catégorie *
                        </label>
                        <select
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500"
                          required
                        >
                          <option value="">Sélectionner une catégorie</option>
                          {categories.map(category => (
                            <option key={category} value={category}>{category}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Note (1-5)
                        </label>
                        <input
                          type="number"
                          name="rating"
                          value={formData.rating}
                          onChange={handleInputChange}
                          min="1"
                          max="5"
                          step="0.1"
                          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nombre d'avis
                        </label>
                        <input
                          type="number"
                          name="reviews_count"
                          value={formData.reviews_count}
                          onChange={handleInputChange}
                          min="0"
                          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Détails avancés */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Détails du produit</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Ingrédients principaux
                        </label>
                        <input
                          type="text"
                          name="ingredients"
                          value={formData.ingredients}
                          onChange={handleInputChange}
                          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500"
                          placeholder="Séparez par des virgules: Whey, BCAA, Créatine"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Bénéfices
                        </label>
                        <input
                          type="text"
                          name="benefits"
                          value={formData.benefits}
                          onChange={handleInputChange}
                          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500"
                          placeholder="Séparez par des virgules: Récupération musculaire, Gain de force"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Options */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Options</h3>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="featured"
                        name="featured"
                        checked={formData.featured}
                        onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                        className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                      />
                      <label htmlFor="featured" className="ml-2 block text-sm text-gray-900">
                        Produit en vedette (affiché en première page)
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                    >
                      {loading ? 'Enregistrement...' : currentProduct ? 'Mettre à jour' : 'Créer le produit'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de détails produit */}
      {selectedProduct && !isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="text-sm text-red-600 font-medium">{selectedProduct.category}</span>
                  <h2 className="text-2xl font-bold text-gray-900 mt-1">{selectedProduct.name}</h2>
                  {selectedProduct.details?.brand && (
                    <p className="text-gray-500">Marque: {selectedProduct.details.brand}</p>
                  )}
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

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Description</h3>
                    <p className="text-gray-600">{selectedProduct.description}</p>
                  </div>

                  {selectedProduct.details?.ingredients && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Ingrédients</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedProduct.details.ingredients.map((ingredient, index) => (
                          <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                            {ingredient}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedProduct.details?.benefits && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Bénéfices</h3>
                      <ul className="space-y-2">
                        {selectedProduct.details.benefits.map((benefit, index) => (
                          <li key={index} className="flex items-center text-gray-700">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Prix</h3>
                      <div className="flex items-center gap-2">
                        {selectedProduct.discount ? (
                          <>
                            <span className="text-2xl font-bold text-red-600">
                              {Math.round(selectedProduct.price * (1 - selectedProduct.discount / 100)).toLocaleString()} FCFA
                            </span>
                            <span className="text-lg text-gray-500 line-through">
                              {selectedProduct.price.toLocaleString()} FCFA
                            </span>
                          </>
                        ) : (
                          <span className="text-2xl font-bold text-red-600">
                            {selectedProduct.price.toLocaleString()} FCFA
                          </span>
                        )}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Stock</h3>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStockStatus(selectedProduct.stock).color}`}>
                        {selectedProduct.stock} unités
                      </span>
                    </div>
                  </div>

                  {selectedProduct.rating && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Évaluations</h3>
                      <div className="flex items-center">
                        <div className="flex">
                          {Array.from({ length: 5 }, (_, i) => (
                            <Star
                              key={i}
                              className={`h-5 w-5 ${
                                i < selectedProduct.rating! ? 'text-yellow-400 fill-current' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-gray-600 ml-2">
                          {selectedProduct.rating}/5 ({selectedProduct.reviews_count || 0} avis)
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center mt-8 pt-6 border-t">
                <div className="flex space-x-4">
                  <button
                    onClick={() => {
                      handleEdit(selectedProduct);
                      setSelectedProduct(null);
                    }}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Modifier
                  </button>
                  <button
                    onClick={() => {
                      handleDelete(selectedProduct.id);
                      setSelectedProduct(null);
                    }}
                    className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Supprimer
                  </button>
                </div>
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsManager;