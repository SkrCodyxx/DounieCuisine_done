import React from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Calendar, 
  UtensilsCrossed, 
  Images, 
  Phone, 
  MapPin,
  Clock,
  Star,
  Heart
} from "lucide-react";

export default function PublicHome() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-yellow-50 to-blue-50">
      {/* Navigation */}
      <nav className="p-6 border-b bg-white/80 backdrop-blur-sm">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            </div>
            <h1 className="text-2xl font-bold text-red-600">Dounie Cuisine</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="outline" className="border-blue-500 text-blue-600 hover:bg-blue-50">
                Konekte • Se Connecter
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-red-600 hover:bg-red-700">
                Kreye Kont • S'inscrire
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <div className="mb-8">
            <Badge className="bg-green-100 text-green-800 mb-4">
              Ouvè • Ouvert Maintenant
            </Badge>
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Byenveni nan Dounie Cuisine
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Gou otantik Ayiti nan kè Montréal • Le goût authentique d'Haïti au cœur de Montréal
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/reservations">
                <Button size="lg" className="bg-red-600 hover:bg-red-700">
                  <Calendar className="mr-2 h-5 w-5" />
                  Rezève Kounye a • Réserver Maintenant
                </Button>
              </Link>
              <Link href="/menu">
                <Button size="lg" variant="outline" className="border-blue-500 text-blue-600 hover:bg-blue-50">
                  <UtensilsCrossed className="mr-2 h-5 w-5" />
                  Gade Meni • Voir le Menu
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Cards */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Sèvis Nou Yo • Nos Services
          </h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/menu">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer border-red-200">
                <CardHeader className="text-center">
                  <UtensilsCrossed className="h-12 w-12 text-red-600 mx-auto mb-4" />
                  <CardTitle className="text-red-600">Restaurant</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-center">
                    Manje tradisyonèl ayisyen ak anviwonman cho ak zanmitay
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/reservations">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer border-blue-200">
                <CardHeader className="text-center">
                  <Calendar className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <CardTitle className="text-blue-600">Rezèvasyon</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-center">
                    Rezève tab ou pou eksperyans inoubliab nan restoran an
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/gallery">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer border-green-200">
                <CardHeader className="text-center">
                  <Images className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <CardTitle className="text-green-600">Galeri</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-center">
                    Dekouvri foto manje nou yo ak anviwonman restoran an
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/contact">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer border-yellow-200">
                <CardHeader className="text-center">
                  <Phone className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
                  <CardTitle className="text-yellow-600">Kontak</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-center">
                    Jwenn enfòmasyon kontak ak kote nou ye a
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Info */}
      <section className="py-16 bg-white/80">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <Clock className="h-8 w-8 text-red-600 mx-auto mb-4" />
              <h4 className="font-semibold text-gray-900 mb-2">Orè • Heures</h4>
              <p className="text-gray-600">
                Lendi - Dimanch<br />
                11:00 AM - 10:00 PM
              </p>
            </div>
            
            <div>
              <MapPin className="h-8 w-8 text-blue-600 mx-auto mb-4" />
              <h4 className="font-semibold text-gray-900 mb-2">Kote • Localisation</h4>
              <p className="text-gray-600">
                123 Rue Saint-Denis<br />
                Montréal, QC H2X 3K8
              </p>
            </div>
            
            <div>
              <Phone className="h-8 w-8 text-green-600 mx-auto mb-4" />
              <h4 className="font-semibold text-gray-900 mb-2">Telefòn • Téléphone</h4>
              <p className="text-gray-600">
                (514) 555-DOUNIE<br />
                info@dounie-cuisine.com
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          </div>
          <h4 className="text-xl font-bold text-red-400 mb-2">Dounie Cuisine</h4>
          <p className="text-gray-400 mb-4">
            Gou otantik Ayiti nan kè Montréal • Le goût authentique d'Haïti au cœur de Montréal
          </p>
          <div className="flex justify-center items-center gap-2 text-sm text-gray-500">
            <Heart className="h-4 w-4 text-red-400" />
            <span>Fet ak renmen nan Montréal • Fait avec amour à Montréal</span>
          </div>
        </div>
      </footer>
    </div>
  );
}