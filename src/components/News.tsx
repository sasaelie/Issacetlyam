import React, { useEffect, useState } from 'react';
import { Calendar, ArrowRight, Share2 } from 'lucide-react';
import { validateData, validateArray } from '../utils/dataValidation';
import DataError from './DataError';
import EmptyState from './EmptyState';

// Import sécurisé avec gestion d'erreur complète
let newsData: any = {};
try {
  newsData = require('../data/news.json');
} catch (error) {
  if (process.env.NODE_ENV === 'development') {
    console.warn('Impossible de charger news.json:', error);
  }
  newsData = { news: [] };
}

interface NewsItem {
  id: string;
  title: string;
  date: string;
  summary: string;
  image: string;
  category: string;
  visible: boolean;
}

const News = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasError, setHasError] = useState(false);
  
  // Déstructuration sécurisée avec validation complète
  const { news = [] } = newsData || {};
  
  // Validation robuste des données
  const validNews = validateArray(news)
    ? news.filter((item): item is NewsItem => {
        const isValid = validateData(item) &&
          typeof item.id === 'string' &&
          typeof item.title === 'string' &&
          typeof item.date === 'string' &&
          typeof item.summary === 'string' &&
          typeof item.visible === 'boolean' &&
          item.visible === true;
        
        if (process.env.NODE_ENV === 'development' && !isValid) {
          console.warn('Invalid news item:', item);
        }
        return isValid;
      })
    : [];

  // Validation runtime en développement
  if (process.env.NODE_ENV === 'development') {
    console.assert(typeof newsData === 'object', 'newsData should be valid object');
    console.assert(Array.isArray(news), 'news should be valid array');
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById('news');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const handleRetry = () => {
    setHasError(false);
    window.location.reload();
  };

  const formatDate = (dateString: string) => {
    if (!dateString || typeof dateString !== 'string') {
      return 'Date invalide';
    }
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Date invalide';
    }
    return date.toLocaleDateString('fr-FR', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const handleShare = (newsItem: NewsItem) => {
    try {
      if (typeof window === 'undefined') return;
      
      const message = `Découvrez cette actualité d'Isaac & Alyam : ${newsItem.title}`;
      const currentUrl = window.location.href;
      
      if (!currentUrl || typeof currentUrl !== 'string') {
        throw new Error('URL invalide');
      }
      
      const encodedMessage = encodeURIComponent(message);
      const encodedUrl = encodeURIComponent(currentUrl);
      const whatsappUrl = `https://wa.me/?text=${encodedMessage} ${encodedUrl}`;
      
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      
      if (process.env.NODE_ENV === 'development') {
        console.log('✅ Partage WhatsApp initié pour:', newsItem.title);
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Erreur lors du partage WhatsApp:', error);
      }
    }
  };

  // Gestion d'erreur
  if (hasError) {
    return (
      <section id="news" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <DataError 
            message="Impossible de charger les actualités"
            retry={handleRetry}
          />
        </div>
      </section>
    );
  }

  return (
    <section id="news" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className={`text-4xl md:text-5xl font-bold text-gray-900 mb-4 transform transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            Actualités
          </h2>
          <p className={`text-xl text-gray-600 max-w-3xl mx-auto transform transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '200ms' }}>
            Découvrez nos dernières réalisations et nouveautés
          </p>
        </div>

        {validNews.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {validNews.map((item, index) => (
              <article
                key={item.id || `news-${index}`}
                className={`bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-500 transform hover:scale-105 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="aspect-video relative overflow-hidden">
                  <img 
                    src={item.image || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQ1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5YTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vbiBkaXNwb25pYmxlPC90ZXh0Pjwvc3ZnPg=='} 
                    alt={item.title || 'Actualité'}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQ1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5YTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vbiBkaXNwb25pYmxlPC90ZXh0Pjwvc3ZnPg==';
                    }}
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-gold text-white px-3 py-1 rounded-full text-xs font-medium">
                      {item.category || 'Actualité'}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <Calendar className="w-4 h-4 mr-2" />
                    {formatDate(item.date)}
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                    {item.title || 'Titre non disponible'}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                    {item.summary || 'Résumé non disponible.'}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <button className="flex items-center text-gold hover:text-gold-dark transition-colors">
                      <span className="text-sm font-medium">Lire la suite</span>
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={() => handleShare(item)}
                      className="p-2 text-gray-400 hover:text-gold transition-colors rounded-full hover:bg-gray-50"
                      title="Partager sur WhatsApp"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState 
            title="Actualités bientôt disponibles"
            message="Nos dernières actualités et réalisations seront affichées ici prochainement."
            icon={Calendar}
          />
        )}
      </div>
    </section>
  );
};

export default News;