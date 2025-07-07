#!/usr/bin/env node

/**
 * Script de test avec données vides
 * Simule des fichiers JSON vides pour tester la robustesse
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const backupDir = 'data-backup';
const dataDir = 'src/data';

const emptyData = {
  'services.json': { services: [] },
  'testimonials.json': { testimonials: [] },
  'references.json': { references: [] },
  'availability.json': { availability: [] },
  'booked-dates.json': { bookedDates: [] },
  'news.json': { news: [] },
  'content.json': {
    hero: { title: "", subtitle: "", tagline: "", description: "", cta: "" },
    about: { title: "", description: "", values: [] },
    contact: { title: "", subtitle: "", phone: "", email: "", address: "" },
    footer: { tagline: "", credits: "" }
  }
};

function createBackup() {
  console.log('📦 Création de la sauvegarde...');
  
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  Object.keys(emptyData).forEach(filename => {
    const originalPath = path.join(dataDir, filename);
    const backupPath = path.join(backupDir, filename);
    
    if (fs.existsSync(originalPath)) {
      fs.copyFileSync(originalPath, backupPath);
      console.log(`✅ Sauvegardé: ${filename}`);
    }
  });
}

function applyEmptyData() {
  console.log('\n🧪 Application des données vides...');
  
  Object.entries(emptyData).forEach(([filename, data]) => {
    const filePath = path.join(dataDir, filename);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`✅ Données vides appliquées: ${filename}`);
  });
}

function restoreBackup() {
  console.log('\n🔄 Restauration des données originales...');
  
  Object.keys(emptyData).forEach(filename => {
    const originalPath = path.join(dataDir, filename);
    const backupPath = path.join(backupDir, filename);
    
    if (fs.existsSync(backupPath)) {
      fs.copyFileSync(backupPath, originalPath);
      console.log(`✅ Restauré: ${filename}`);
    }
  });

  // Nettoyage du dossier de sauvegarde
  fs.rmSync(backupDir, { recursive: true, force: true });
  console.log('🧹 Sauvegarde nettoyée');
}

const command = process.argv[2];

switch (command) {
  case 'apply':
    createBackup();
    applyEmptyData();
    console.log('\n🎯 Données vides appliquées. Testez maintenant votre application.');
    console.log('💡 Utilisez "npm run test-empty-data restore" pour restaurer les données originales.');
    break;
    
  case 'restore':
    restoreBackup();
    console.log('\n✅ Données originales restaurées.');
    break;
    
  default:
    console.log('Usage:');
    console.log('  npm run test-empty-data apply   - Applique des données vides');
    console.log('  npm run test-empty-data restore - Restaure les données originales');
    break;
}