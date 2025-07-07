import React from 'react';
import { Heart, Phone, Mail, MapPin } from 'lucide-react';
import siteConfig from '../config';

const Footer = () => {
  // Utilisation de la configuration centralisée
  const { brand, contact, business } = siteConfig;

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center mb-4">
              <Heart className="text-gold mr-2 w-8 h-8" />
              <h3 className="text-2xl font-bold">{brand.name}</h3>
            </div>
            <p className="text-gray-400 mb-4">
              {brand.tagline}
            </p>
            <p className="text-sm text-gray-500">
              Créateurs d'expériences mémorables depuis {business.founded}
            </p>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <div className="space-y-2 text-gray-400">
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-2" />
                <span>{contact.phone}</span>
              </div>
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                <span>{contact.email}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                <span>{contact.address}</span>
              </div>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Liens</h4>
            <div className="space-y-2">
              <a href="#about" className="text-gray-400 hover:text-gold transition-colors block">
                À propos
              </a>
              <a href="#services" className="text-gray-400 hover:text-gold transition-colors block">
                Nos services
              </a>
              <a href="#testimonials" className="text-gray-400 hover:text-gold transition-colors block">
                Témoignages
              </a>
              <a href="#contact" className="text-gray-400 hover:text-gold transition-colors block">
                Contact
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 {brand.name} - {brand.subtitle}. Tous droits réservés.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-gold transition-colors text-sm">
                Mentions légales
              </a>
              <a href="#" className="text-gray-400 hover:text-gold transition-colors text-sm">
                Politique de confidentialité
              </a>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-xs text-gray-500">
              Site créé avec passion • Site web conçu avec excellence
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;