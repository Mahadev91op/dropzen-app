const { ImageResponse } = require('next/dist/compiled/@vercel/og/index.node.js');
const React = require('react');
const fs = require('fs');
const path = require('path');

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
        borderRadius: `${Math.round(size * 0.22)}px`,
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
          letterSpacing: '-1px',
        },
      },
      'D'
    ),
    React.createElement('div', {
      style: {
        position: 'absolute',
        bottom: `${Math.max(2, Math.round(size * 0.1))}px`,
        right: `${Math.max(2, Math.round(size * 0.1))}px`,
        width: `${dotSize}px`,
        height: `${dotSize}px`,
        borderRadius: '50%',
        backgroundColor: '#10b981',
      },
    })
  );
}

async function getPngBuffer(size) {
  const fontSize = Math.round(size * 0.58);
  const dotSize = Math.max(3, Math.round(size * 0.18));
  const res = new ImageResponse(renderIcon(size, fontSize, dotSize), {
    width: size,
    height: size,
  });
  return Buffer.from(await res.arrayBuffer());
}

function packIco(images) {
  // images: array of { size, buffer }
  const count = images.length;
  const headerLen = 6;
  const entryLen = 16;
  let offset = headerLen + (entryLen * count);
  
  const header = Buffer.alloc(headerLen);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // 1 = ICO type
  header.writeUInt16LE(count, 4); // count of images
  
  const entries = [];
  for (const img of images) {
    const entry = Buffer.alloc(entryLen);
    entry.writeUInt8(img.size >= 256 ? 0 : img.size, 0); // width
    entry.writeUInt8(img.size >= 256 ? 0 : img.size, 1); // height
    entry.writeUInt8(0, 2); // color count
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // color planes
    entry.writeUInt16LE(32, 6); // bits per pixel (32bpp)
    entry.writeUInt32LE(img.buffer.length, 8); // image byte length
    entry.writeUInt32LE(offset, 12); // byte offset from file start
    entries.push(entry);
    offset += img.buffer.length;
  }
  
  return Buffer.concat([header, ...entries, ...images.map(img => img.buffer)]);
}

async function main() {
  const publicDir = path.resolve(__dirname, '../public');
  const appDir = path.resolve(__dirname, '../src/app');

  console.log('Generating PNG icons...');
  const b16 = await getPngBuffer(16);
  fs.writeFileSync(path.join(publicDir, 'favicon-16x16.png'), b16);

  const b32 = await getPngBuffer(32);
  fs.writeFileSync(path.join(publicDir, 'favicon-32x32.png'), b32);

  const b48 = await getPngBuffer(48);
  fs.writeFileSync(path.join(publicDir, 'favicon-48x48.png'), b48);

  const b180 = await getPngBuffer(180);
  fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), b180);

  const b192 = await getPngBuffer(192);
  fs.writeFileSync(path.join(publicDir, 'icon-192.png'), b192);

  const b512 = await getPngBuffer(512);
  fs.writeFileSync(path.join(publicDir, 'icon-512.png'), b512);

  console.log('Generating true multi-resolution Windows ICO (16x16, 32x32, 48x48)...');
  const icoBuffer = packIco([
    { size: 16, buffer: b16 },
    { size: 32, buffer: b32 },
    { size: 48, buffer: b48 },
  ]);

  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoBuffer);
  fs.writeFileSync(path.join(appDir, 'favicon.ico'), icoBuffer);

  console.log('🎉 All icons and true multi-resolution favicon.ico generated successfully!');
}

main().catch(err => {
  console.error('Error generating icons:', err);
  process.exit(1);
});
