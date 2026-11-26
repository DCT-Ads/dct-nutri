import fs from 'fs';
import zlib from 'zlib';

function crc32(buf) {
  let c = ~0;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1));
  }
  return ~c >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const body = Buffer.concat([Buffer.from(type), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body), 0);
  return Buffer.concat([len, body, crc]);
}

function makePng(size) {
  const raw = Buffer.alloc((size * 4 + 1) * size);
  const cx = (size - 1) / 2;
  const cy = (size - 1) / 2;
  for (let y = 0; y < size; y++) {
    const row = y * (size * 4 + 1);
    raw[row] = 0;
    for (let x = 0; x < size; x++) {
      const o = row + 1 + x * 4;
      const dx = x - cx;
      const dy = y - cy;
      const r = Math.hypot(dx, dy);
      let R = 0xe5;
      let G = 0x19;
      let B = 0x8d;
      if (r < size * 0.26) {
        R = 0xff;
        G = 0xc2;
        B = 0xd6;
      }
      if (dx > size * 0.02 && dx < size * 0.16 && dy < -size * 0.16 && dy > -size * 0.32) {
        R = 0x2f;
        G = 0xcf;
        B = 0xbe;
      }
      raw[o] = R;
      raw[o + 1] = G;
      raw[o + 2] = B;
      raw[o + 3] = 255;
    }
  }
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  return Buffer.concat([
    sig,
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(raw)),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

fs.mkdirSync('public', { recursive: true });
fs.writeFileSync('public/icon-192.png', makePng(192));
fs.writeFileSync('public/icon-512.png', makePng(512));
fs.writeFileSync('public/apple-touch-icon.png', makePng(180));
