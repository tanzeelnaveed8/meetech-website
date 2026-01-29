const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, '../public/images');
const images = [
  'Deterministic.jpg',
  'ecommerce.jpg',
  'engineering.jpg',
  'Mobile.jpg',
  'mvp.jpg',
  'software.jpg',
  'Websites.jpg'
];

async function convertToWebP() {
  console.log('Starting image conversion to WebP...\n');

  for (const image of images) {
    const inputPath = path.join(imagesDir, image);
    const outputPath = path.join(imagesDir, image.replace('.jpg', '.webp'));

    try {
      const info = await sharp(inputPath)
        .webp({ quality: 75 })
        .toFile(outputPath);

      const originalSize = fs.statSync(inputPath).size;
      const newSize = info.size;
      const savings = ((originalSize - newSize) / originalSize * 100).toFixed(1);

      console.log(`✓ ${image} -> ${image.replace('.jpg', '.webp')}`);
      console.log(`  Original: ${(originalSize / 1024).toFixed(1)}KB`);
      console.log(`  WebP: ${(newSize / 1024).toFixed(1)}KB`);
      console.log(`  Savings: ${savings}%\n`);
    } catch (error) {
      console.error(`✗ Failed to convert ${image}:`, error.message);
    }
  }

  console.log('Image conversion complete!');
}

convertToWebP();
