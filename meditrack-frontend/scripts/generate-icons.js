import sharp from 'sharp'
import { mkdirSync } from 'fs'

mkdirSync('public/icons', { recursive: true })

// Creates a simple dark square with "M" — replace with your logo SVG later
const svgIcon = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="80" fill="#0A0E13"/>
  <rect x="80" y="80" width="352" height="352" rx="60" fill="#111720" stroke="#00D4AA" stroke-width="8"/>
  <text x="256" y="320" font-family="sans-serif" font-size="220" font-weight="bold" 
        fill="#00D4AA" text-anchor="middle">M</text>
</svg>`

const svgBuffer = Buffer.from(svgIcon)

await sharp(svgBuffer).resize(192, 192).png().toFile('public/icons/icon-192.png')
await sharp(svgBuffer).resize(512, 512).png().toFile('public/icons/icon-512.png')

console.log('Icons generated.')
