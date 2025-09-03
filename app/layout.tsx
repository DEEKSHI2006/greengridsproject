import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'GREEN GRIDS',
  description: 'Green Grids is an IoT-enabled AI platform that predicts soil type and recommends fertilizers using real-time sensor data and CNN-based analysis.',
  generator: 'agro'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
