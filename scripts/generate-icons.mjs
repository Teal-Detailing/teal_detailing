import sharp from 'sharp'
import { mkdir } from 'fs/promises'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const src = join(root, 'public/images/logo.png.png')
const out = join(root, 'public/images/icons')

await mkdir(out, { recursive: true })

const webpSizes = [
  { size: 192, name: 'logo-192.webp' },
  { size: 256, name: 'logo-256.webp' },
  { size: 384, name: 'logo-384.webp' },
  { size: 512, name: 'logo-512.webp' },
  { size: 1024, name: 'logo-1024.webp' },
]

for (const { size, name } of webpSizes) {
  await sharp(src)
    .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .webp({ quality: 90 })
    .toFile(join(out, name))
  console.log(`Generated ${name}`)
}

await sharp(src)
  .resize(180, 180, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png()
  .toFile(join(out, 'apple-touch-icon.png'))
console.log('Generated apple-touch-icon.png')

await sharp(src)
  .resize(32, 32, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png()
  .toFile(join(out, 'favicon-32.png'))
console.log('Generated favicon-32.png')

await sharp(src)
  .resize(16, 16, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png()
  .toFile(join(out, 'favicon-16.png'))
console.log('Generated favicon-16.png')

console.log('All icons generated successfully.')
