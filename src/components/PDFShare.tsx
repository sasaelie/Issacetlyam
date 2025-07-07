import React, { useState, useEffect } from 'react';
import { Download, Share2, AlertTriangle, FileText } from 'lucide-react';
import siteConfig from '../config';
import DataError from './DataError';

const PDFShare = () => {
  const [pdfExists, setPdfExists] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);
  
  // 🎯 ÉTAPE 1: Validation du fichier PDF avec vérification d'existence
  const { pdf, brand, contact } = siteConfig;
  const pdfPath = pdf.path;
  const pdfFileName = pdf.fileName;
  
  // Console de vérification en dev
  if (process.env.NODE_ENV === 'development') {
    console.assert(typeof pdfPath === 'string' && pdfPath.length > 0, '❌ Lien PDF manquant ou invalide');
  }

  useEffect(() => {
    // Vérification de l'existence du fichier PDF
    const checkPDFExists = async () => {
      try {
        const response = await fetch(pdfPath, { method: 'HEAD' });
        setPdfExists(response.ok);
        
        if (process.env.NODE_ENV === 'development') {
          console.log(`PDF ${pdfPath} ${response.ok ? 'trouvé' : 'non trouvé'}`);
        }
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('Erreur lors de la vérification du PDF:', error);
        }
        setPdfExists(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkPDFExists();
  }, [pdfPath]);

  // 🎯 ÉTAPE 3: Fonction handleDownload sécurisée
  const handleDownloadPDF = () => {
    if (!pdfPath || !pdfExists) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('❌ Tentative de téléchargement sans PDF valide');
      }
      return;
    }

    try {
      const link = document.createElement('a');
      link.href = pdfPath;
      link.download = pdfFileName;
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
      
      // Ajout temporaire au DOM pour déclencher le téléchargement
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      if (process.env.NODE_ENV === 'development') {
        console.log('✅ Téléchargement du PDF initié');
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Erreur lors du téléchargement du PDF:', error);
      }
      
      // Fallback: ouvrir dans un nouvel onglet
      try {
        window.open(pdfPath, '_blank', 'noopener,noreferrer');
      } catch (fallbackError) {
        console.error('Impossible d\'ouvrir le PDF:', fallbackError);
        setHasError(true);
      }
    }
  };

  // 🎯 ÉTAPE 3: Fonction handleShare sécurisée
  const handleShareWhatsApp = () => {
    try {
      const message = `Découvrez ${brand.name} – ${brand.subtitle}, ${brand.slogan} ! 🎉`;
      const currentUrl = window.location.href;
      
      if (!currentUrl || typeof currentUrl !== 'string') {
        throw new Error('URL invalide');
      }
      
      const encodedMessage = encodeURIComponent(message);
      const encodedUrl = encodeURIComponent(currentUrl);
      const whatsappUrl = `https://wa.me/?text=${encodedMessage} ${encodedUrl}`;
      
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      
      if (process.env.NODE_ENV === 'development') {
        console.log('✅ Partage WhatsApp initié');
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Erreur lors du partage WhatsApp:', error);
      }
    }
  };

  const handleRetry = () => {
    setHasError(false);
    setIsLoading(true);
    // Relancer la vérification du PDF
    window.location.reload();
  };

  // Gestion d'erreur critique
  if (hasError) {
    return (
      <section className="py-16 bg-gradient-to-r from-gold to-gold-light">
        <div className="max-w-7xl mx-auto px-4">
          <DataError 
            message="Impossible de charger les options de partage"
            retry={handleRetry}
            className="bg-white/10 backdrop-blur-sm rounded-xl"
          />
        </div>
      </section>
    );
  }

  // État de chargement
  if (isLoading) {
    return (
      <section className="py-16 bg-gradient-to-r from-gold to-gold-light">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-white opacity-90">Vérification des documents...</p>
          </div>
        </div>
      </section>
    );
  }

  // 🎯 ÉTAPE 1: Validation et fallback si PDF absent
  if (!pdfPath || !pdfExists) {
    return (
      <section className="py-16 bg-gradient-to-r from-gold to-gold-light">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Partagez notre expertise
            </h2>
            <p className="text-xl text-white opacity-90 mb-8 max-w-2xl mx-auto">
              Aucun document disponible pour le moment. Contactez-nous au {contact.phone} pour plus d'informations.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {/* Bouton de partage toujours disponible */}
              <button
                onClick={handleShareWhatsApp}
                className="inline-flex items-center px-8 py-4 bg-white text-gold font-semibold rounded-full hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <Share2 className="w-5 h-5 mr-2" />
                Partager notre site
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-r from-gold to-gold-light">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Partagez notre expertise
          </h2>
          <p className="text-xl text-white opacity-90 mb-8 max-w-2xl mx-auto">
            Téléchargez notre carte de visite ou partagez notre savoir-faire avec vos proches
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {/* 🎯 ÉTAPE 2: Bouton de téléchargement avec protection */}
            <button
              onClick={handleDownloadPDF}
              disabled={!pdfExists}
              className={`inline-flex items-center px-8 py-4 font-semibold rounded-full transition-all duration-300 transform shadow-lg ${
                pdfExists 
                  ? 'bg-white text-gold hover:bg-gray-100 hover:scale-105 cursor-pointer' 
                  : 'bg-white/50 text-gold/50 cursor-not-allowed opacity-50'
              }`}
              title={pdfExists ? 'Télécharger la carte de visite' : 'Document non disponible'}
            >
              <Download className="w-5 h-5 mr-2" />
              {pdfExists ? 'Télécharger la carte' : 'Document indisponible'}
            </button>
            
            {/* Bouton de partage toujours actif */}
            <button
              onClick={handleShareWhatsApp}
              className="inline-flex items-center px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-gold transition-all duration-300 transform hover:scale-105"
            >
              <Share2 className="w-5 h-5 mr-2" />
              Partager sur WhatsApp
            </button>
          </div>

          {/* Indicateur de statut du PDF */}
          {!pdfExists && (
            <div className="mt-6 flex items-center justify-center text-white/80 text-sm">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Le document PDF sera bientôt disponible
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default PDFShare;