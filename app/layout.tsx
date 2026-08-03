import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Terra Adventure Bali | Mount Batur Jeep & Trekking Tours',
  description: 'Experience unforgettable journeys through Mount Batur with our exclusive Jeep Tours and Trekking Adventures. Authentic Bali adventure with professional local guides.',
  keywords: 'Mount Batur, Bali tours, Jeep tour, Trekking, Sunrise tour, Bali adventure',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
