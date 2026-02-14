import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Wrench, Star, Filter, Search, ShoppingCart, Heart, Tractor, Droplets, Axe, Sprout, Package } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const Equipment = () => {
  // Using icon components instead of emojis for better visual design
  const equipmentCategories = [
    { name: "Tractors", count: 245, icon: Tractor, color: "from-green-500 to-emerald-500" },
    { name: "Harvesters", count: 89, icon: Package, color: "from-teal-500 to-cyan-500" },
    { name: "Irrigation", count: 156, icon: Droplets, color: "from-blue-500 to-sky-500" },
    { name: "Tillage", count: 203, icon: Axe, color: "from-emerald-500 to-green-500" },
    { name: "Seeding", count: 134, icon: Sprout, color: "from-lime-500 to-green-500" },
    { name: "Hand Tools", count: 78, icon: Wrench, color: "from-green-600 to-emerald-600" }
  ];

  type Equip = { id: number; name: string; brand: string; category: string; priceINR: number; rating: number; reviews: number; features: string[]; image: string; availability: string; financing: string };
  const [all, setAll] = useState<Equip[]>([]);
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("all-categories");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch('/equipment.json')
      .then(r => r.json())
      .then((data: Equip[]) => setAll(data))
      .catch(() => setAll([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const listByCat = cat === 'all-categories' ? all : all.filter(e => e.category.toLowerCase() === cat.toLowerCase());
    return listByCat.filter(e => !q || `${e.name} ${e.brand} ${e.category}`.toLowerCase().includes(q));
  }, [all, query, cat]);

  const serviceProviders = [
    {
      name: "AgriRent Solutions",
      location: "Punjab, Haryana",
      rating: 4.7,
      services: ["Tractor Rental", "Harvester Rental", "Custom Farming"],
      priceRange: "₹800-2000/hour",
      contact: "+91 98765 43210"
    },
    {
      name: "Farm Equipment Hub",
      location: "UP, Bihar",
      rating: 4.4,
      services: ["Equipment Sales", "Repair & Maintenance", "Spare Parts"],
      priceRange: "₹500-1500/hour",
      contact: "+91 87654 32109"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50/50 via-emerald-50/30 to-teal-50/50 dark:from-green-950/10 dark:via-emerald-950/10 dark:to-teal-950/10">

      <div className="w-full px-4 py-8 max-w-7xl mx-auto">
        {/* Modern Header with Animations */}
        <div className="mb-8 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-950/30 rounded-full mb-4 animate-fade-in">
            <Wrench className="w-4 h-4 text-green-600 animate-pulse" />
            <span className="text-sm font-medium text-green-900 dark:text-green-100">Modern Farming Tools</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500 bg-clip-text text-transparent animate-fade-in">
            Equipment Catalog
          </h1>
          <p className="text-muted-foreground text-lg animate-fade-in" style={{ animationDelay: '0.1s' }}>
            Find, compare, and purchase modern farming equipment
          </p>
        </div>

        {/* Search Card with Enhanced Design */}
        <Card className="mb-8 border-0 shadow-xl bg-gradient-to-br from-white to-green-50 dark:from-gray-800 dark:to-green-950/20 hover:shadow-2xl transition-all duration-300 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-600 rounded-lg flex items-center justify-center shadow-lg animate-pulse">
                <Search className="h-5 w-5 text-white" />
              </div>
              Search Equipment
            </CardTitle>
            <CardDescription>Find the perfect equipment for your farm</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Input placeholder="Search equipment..." className="md:col-span-2 h-12 focus:ring-2 focus:ring-green-400 transition-all" value={query} onChange={(e) => setQuery(e.target.value)} />
              <Select value={cat} onValueChange={setCat}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-categories">All Categories</SelectItem>
                  <SelectItem value="Tractors">Tractors</SelectItem>
                  <SelectItem value="Harvesters">Harvesters</SelectItem>
                  <SelectItem value="Irrigation">Irrigation</SelectItem>
                  <SelectItem value="Tillage">Tillage</SelectItem>
                  <SelectItem value="Seeding">Seeding</SelectItem>
                  <SelectItem value="Hand Tools">Hand Tools</SelectItem>
                </SelectContent>
              </Select>
              <Button className="h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all">
                <Filter className="h-4 w-4 mr-2" />Filter
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Categories with Animated Icon Cards */}
        <Card className="mb-8 border-0 shadow-xl bg-gradient-to-br from-white to-emerald-50 dark:from-gray-800 dark:to-emerald-950/20 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <CardHeader>
            <CardTitle className="text-2xl">Equipment Categories</CardTitle>
            <CardDescription>Browse by equipment type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {equipmentCategories.map((category, idx) => {
                const IconComponent = category.icon;
                return (
                  <div
                    key={idx}
                    className="group cursor-pointer"
                    onClick={() => setCat(category.name)}
                    style={{ animationDelay: `${0.1 * idx}s` }}
                  >
                    <Card className="border-0 bg-gradient-to-br from-white to-green-50 dark:from-gray-800 dark:to-green-950/20 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden animate-fade-in">
                      <CardContent className="p-6 text-center">
                        {/* Animated Icon Container */}
                        <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br ${category.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                          <IconComponent className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="font-semibold text-sm mb-2 group-hover:text-green-600 transition-colors">{category.name}</h3>
                        <Badge variant="secondary" className="bg-green-100 text-green-800 group-hover:bg-green-600 group-hover:text-white transition-all">
                          {category.count} items
                        </Badge>
                      </CardContent>
                    </Card>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Equipment Listings */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Available Equipment</h2>
            <p className="text-sm text-muted-foreground">{filtered.length} results found</p>
          </div>
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-muted-foreground">Loading equipment...</p>
            </div>
          ) : filtered.length === 0 ? (
            <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-green-50 dark:from-gray-800 dark:to-green-950/20">
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No equipment found matching your criteria.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((item, idx) => (
                <Card key={item.id} className="group border-0 shadow-lg bg-gradient-to-br from-white to-green-50/50 dark:from-gray-800 dark:to-green-950/20 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden animate-fade-in" style={{ animationDelay: `${0.05 * idx}s` }}>
                  <div className="relative h-48 bg-gradient-to-br from-green-100 via-emerald-100 to-teal-100 dark:from-green-950/30 dark:via-emerald-950/30 dark:to-teal-950/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 overflow-hidden">
                    {/* Decorative Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute top-4 left-4 w-20 h-20 bg-green-400 rounded-full blur-2xl"></div>
                      <div className="absolute bottom-4 right-4 w-24 h-24 bg-emerald-400 rounded-full blur-2xl"></div>
                    </div>
                    {/* Equipment Visual */}
                    <div className="relative z-10 text-center">
                      {item.category === 'Tractors' && <div className="text-7xl mb-2 group-hover:scale-125 transition-transform">🚜</div>}
                      {item.category === 'Harvesters' && <div className="text-7xl mb-2 group-hover:scale-125 transition-transform">🌾</div>}
                      {item.category === 'Irrigation' && <div className="text-7xl mb-2 group-hover:scale-125 transition-transform">💧</div>}
                      {item.category === 'Tillage' && <div className="text-7xl mb-2 group-hover:scale-125 transition-transform">⚙️</div>}
                      {item.category === 'Seeding' && <div className="text-7xl mb-2 group-hover:scale-125 transition-transform">🌱</div>}
                      {item.category === 'Hand Tools' && <div className="text-7xl mb-2 group-hover:scale-125 transition-transform">🔧</div>}
                      {!['Tractors', 'Harvesters', 'Irrigation', 'Tillage', 'Seeding', 'Hand Tools'].includes(item.category) && (
                        <img src={item.image || "/placeholder-equipment.png"} alt={item.name} className="h-32 w-32 object-contain" />
                      )}
                    </div>
                  </div>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg group-hover:text-green-600 transition-colors">{item.name}</CardTitle>
                        <CardDescription className="text-sm text-muted-foreground">{item.brand}</CardDescription>
                      </div>
                      <button className="p-2 rounded-full hover:bg-green-100 dark:hover:bg-green-950/30 transition-colors">
                        <Heart className="w-5 h-5 text-muted-foreground hover:text-red-500 transition-colors" />
                      </button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Badge className="bg-green-100 text-green-800 border-0">{item.category}</Badge>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{item.rating}</span>
                          <span className="text-xs text-muted-foreground">({item.reviews})</span>
                        </div>
                      </div>
                      <div className="pt-2 border-t">
                        <div className="text-2xl font-bold text-green-600">₹{item.priceINR.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground mt-1">{item.availability}</p>
                      </div>
                      <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-md hover:shadow-lg transition-all">
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Service Providers */}
        <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-teal-50 dark:from-gray-800 dark:to-teal-950/20 animate-fade-in">
          <CardHeader>
            <CardTitle className="text-2xl">Rental & Service Providers</CardTitle>
            <CardDescription>Equipment rental and maintenance services near you</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {serviceProviders.map((provider, idx) => (
                <Card key={idx} className="border-0 bg-gradient-to-br from-white to-green-50/50 dark:from-gray-800 dark:to-green-950/10 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{provider.name}</CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1">
                          📍 {provider.location}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-1 bg-green-100 dark:bg-green-950/30 px-2 py-1 rounded-full">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-semibold">{provider.rating}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <h4 className="text-sm font-semibold mb-2">Services</h4>
                        <div className="flex flex-wrap gap-2">
                          {provider.services.map((service, i) => (
                            <Badge key={i} variant="secondary" className="bg-green-100 text-green-800">
                              {service}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="pt-2 border-t grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Price Range</p>
                          <p className="font-semibold text-green-600">{provider.priceRange}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Contact</p>
                          <p className="font-semibold">{provider.contact}</p>
                        </div>
                      </div>
                      <Button variant="outline" className="w-full border-green-300 text-green-700 hover:bg-green-50 dark:border-green-700 dark:text-green-400 dark:hover:bg-green-950/30">
                        Contact Provider
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Equipment;