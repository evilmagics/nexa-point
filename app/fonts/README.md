# Local Fonts Directory

Silakan letakkan file font lokal (contoh: `.woff2`, `.woff`, `.ttf`) di dalam folder ini.
Berdasarkan `DESIGN.md`, Anda mungkin memerlukan:
- `GT Walsheim Medium`
- `Inter Variable`
- `Mona Sans`
- `Azeret Mono`
- `Open Runde`

## Cara Menggunakan (Next.js Local Font)

Setelah font dimasukkan ke dalam folder ini, Anda bisa memanggilnya di dalam `app/layout.tsx` menggunakan `next/font/local` seperti berikut:

```tsx
import localFont from "next/font/local";

const gtWalsheim = localFont({
  src: "./fonts/GTWalsheimMedium.woff2",
  variable: "--font-gt-walsheim",
  weight: "500",
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${gtWalsheim.variable}`}>
      ...
    </html>
  );
}
```

Kemudian, di `app/globals.css` Anda dapat menggunakannya:

```css
@theme inline {
  --font-display: var(--font-gt-walsheim);
}
```
