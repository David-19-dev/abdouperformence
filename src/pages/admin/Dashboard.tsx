import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Package, ShoppingCart, Users, Calendar } from 'lucide-react';

const Dashboard: React.FC = () => {
  const stats = [
    {
      name: 'Réservations',
      value: '24',
      change: '+15.3%',
      trend: 'up',
      icon: Calendar,
    },
    {
      name: 'Ventes Totales',
      value: '2.4M FCFA',
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
    },
    {
      name: 'Commandes',
      value: '156',
      change: '+8.2%',
      trend: 'up',
      icon: ShoppingCart,
    },
    {
      name: 'Produits',
      value: '43',
      change: '-2.4%',
      trend: 'down',
      icon: Package,
    },
    {
      name: 'Clients',
      value: '891',
      change: '+4.6%',
      trend: 'up',
      icon: Users,
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Tableau de Bord</h1>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trend === 'up' ? TrendingUp : TrendingDown;
          return (
            <div
              key={stat.name}
              className="bg-white overflow-hidden rounded-lg shadow"
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Icon className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {stat.name}
                      </dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">
                          {stat.value}
                        </div>
                        <div
                          className={`ml-2 flex items-baseline text-sm font-semibold ${
                            stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                          }`}
                        >
                          <TrendIcon className="h-4 w-4 flex-shrink-0 self-center" />
                          <span className="ml-1">{stat.change}</span>
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Orders */}
        <div className="bg-white overflow-hidden rounded-lg shadow">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900">
              Commandes Récentes
            </h3>
            <div className="mt-6">
              <div className="flow-root">
                <ul className="-my-5 divide-y divide-gray-200">
                  {[1, 2, 3].map((order) => (
                    <li key={order} className="py-5">
                      <div className="flex items-center space-x-4">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            Commande #{order}
                          </p>
                          <p className="text-sm text-gray-500">
                            Client: John Doe
                          </p>
                        </div>
                        <div className="flex-shrink-0">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Complétée
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Popular Products */}
        <div className="bg-white overflow-hidden rounded-lg shadow">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900">
              Produits Populaires
            </h3>
            <div className="mt-6">
              <div className="flow-root">
                <ul className="-my-5 divide-y divide-gray-200">
                  {[1, 2, 3].map((product) => (
                    <li key={product} className="py-5">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 rounded-lg bg-gray-200" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            Produit {product}
                          </p>
                          <p className="text-sm text-gray-500">
                            25 000 FCFA • En stock
                          </p>
                        </div>
                        <div className="flex-shrink-0">
                          <span className="text-sm text-gray-500">
                            156 ventes
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;