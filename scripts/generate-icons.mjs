import { ImageResponse } from 'next/og';
import React from 'react';
import fs from 'fs';
import path from 'path';

function renderIcon(size, fontSize, dotSize) {
  return React.createElement(
    'div',
    {
      style: {
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 30%, #4338ca 70%, #0891b2 100%)',
        borderRadius: `${Math.round(size * 0.24)}px`,
        border: `${Math.max(2, Math.round(size * 0.025))}px solid rgba(255, 255, 255, 0.35)`,
        position: 'relative',
      },
    },
    React.createElement(
      'div',
      {
        style: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          fontSize: `${fontSize}px`,
          fontWeight: 900,
          fontFamily: 'sans-serif',
          letterSpacing: '-2px',
        },
      },
      'D'
    ),
    React.createElement('div', {
      style: {
        position: 'absolute',
        bottom: `${Math.round(size * 0.12)}px`,
        right: `${Math.round(size * 0.12)}px`,
        width: `${dotSize}px`,
        height: `${dotSize}px`,
        borderRadius: '50%',
        backgroundColor: '#10b981',
        border: `${Math.max(2, Math.round(size * 0.02))}px solid #ffffff`,
      },
    })
  );
}

async function generatePng(size, outputPath) {
  const fontSize = Math.round(size * 0.58);
  const dotSize = Math.round(size * 0.16);
  const response = new ImageResponse(renderIcon(size, fontSize, dotSize), {
    width: size,
    height: size,
  });

  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  fs.writeFileSync(outputPath, buffer);
  console.log(`✅ Generated ${path.basename(outputPath)} (${size}x${size}, ${buffer.length} bytes)`);
}

async function main() {
  const publicDir = path.resolve(process.cwd(), 'public');
  const appDir = path.resolve(process.cwd(), 'src/app');

  await generatePng(192, path.join(publicDir, 'icon-192.png'));
  await generatePng(512, path.join(publicDir, 'icon-512.png'));
  await generatePng(180, path.join(publicDir, 'apple-touch-icon.png'));
  await generatePng(32, path.join(publicDir, 'favicon-32x32.png'));
  await generatePng(48, path.join(publicDir, 'favicon.ico'));
  
  // Replace the old 25KB favicon.ico in src/app with the new 48x48 icon!
  await generatePng(48, path.join(appDir, 'favicon.ico'));

  console.log('🎉 All website & PWA app icons successfully generated!');
}

main().catch(err => {
  console.error('Error generating icons:', err);
  process.exit(1);
});
