import './globals.css'

export const metadata = {
  title: 'Posts App',
  description: 'A modern posts management application',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}