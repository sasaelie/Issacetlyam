#!/usr/bin/env node

/**
 * Script de validation des données JSON
 * Vérifie que tous les fichiers JSON sont valides et bien structurés
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataFiles = [
  'src/data/services.json',
  'src/data/testimonials.json',
  'src/data/references.json',
  'src/data/availability.json',
  'src/data/content.json',
  'src/data/booked-dates.json',
  'src/data/news.json'
];

let hasErrors = false;

console.log('🔍 Validation des fichiers de données...\n');

dataFiles.forEach(filePath => {
  try {
    if (!fs.existsSync(filePath)) {
      console.error(`❌ Fichier manquant: ${filePath}`);
      hasErrors = true;
      return;
    }

    const content = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(content);

    console.log(`✅ ${filePath} - JSON valide`);

    // Validation spécifique selon le type de fichier
    if (filePath.includes('services.json')) {
      if (!data.services || !Array.isArray(data.services)) {
        console.error(`❌ ${filePath} - Propriété 'services' manquante ou invalide`);
        hasErrors = true;
      } else {
        console.log(`   📊 ${data.services.length} services trouvés`);
      }
    }

    if (filePath.includes('testimonials.json')) {
      if (!data.testimonials || !Array.isArray(data.testimonials)) {
        console.error(`❌ ${filePath} - Propriété 'testimonials' manquante ou invalide`);
        hasErrors = true;
      } else {
        console.log(`   📊 ${data.testimonials.length} témoignages trouvés`);
      }
    }

    if (filePath.includes('references.json')) {
      if (!data.references || !Array.isArray(data.references)) {
        console.error(`❌ ${filePath} - Propriété 'references' manquante ou invalide`);
        hasErrors = true;
      } else {
        console.log(`   📊 ${data.references.length} références trouvées`);
      }
    }

    if (filePath.includes('availability.json')) {
      if (!data.availability || !Array.isArray(data.availability)) {
        console.error(`❌ ${filePath} - Propriété 'availability' manquante ou invalide`);
        hasErrors = true;
      } else {
        console.log(`   📊 ${data.availability.length} créneaux trouvés`);
      }
    }

    if (filePath.includes('booked-dates.json')) {
      if (!data.bookedDates || !Array.isArray(data.bookedDates)) {
        console.error(`❌ ${filePath} - Propriété 'bookedDates' manquante ou invalide`);
        hasErrors = true;
      } else {
        console.log(`   📊 ${data.bookedDates.length} dates réservées trouvées`);
      }
    }

    if (filePath.includes('news.json')) {
      if (!data.news || !Array.isArray(data.news)) {
        console.error(`❌ ${filePath} - Propriété 'news' manquante ou invalide`);
        hasErrors = true;
      } else {
        console.log(`   📊 ${data.news.length} actualités trouvées`);
      }
    }

    if (filePath.includes('content.json')) {
      const requiredSections = ['hero', 'about', 'contact', 'footer'];
      requiredSections.forEach(section => {
        if (!data[section]) {
          console.error(`❌ ${filePath} - Section '${section}' manquante`);
          hasErrors = true;
        }
      });
      if (!hasErrors) {
        console.log(`   📊 Toutes les sections requises présentes`);
      }
    }

  } catch (error) {
    console.error(`❌ ${filePath} - Erreur: ${error.message}`);
    hasErrors = true;
  }
});

console.log('\n' + '='.repeat(50));

if (hasErrors) {
  console.error('❌ Validation échouée - Des erreurs ont été détectées');
  process.exit(1);
} else {
  console.log('✅ Validation réussie - Tous les fichiers sont valides');
  process.exit(0);
}