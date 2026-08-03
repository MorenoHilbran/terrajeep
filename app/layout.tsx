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
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                // Instantly remove simulator preloader to avoid hydration mismatch
                const removePreloader = (node) => {
                  if (node.nodeType === 1 && (
                    node.classList.contains('simulator-pre-loader') || 
                    node.classList.contains('simulator') ||
                    node.id === 'simulator-pre-loader'
                  )) {
                    node.remove();
                  }
                };
                
                const observer = new MutationObserver((mutations) => {
                  for (const mutation of mutations) {
                    for (const node of mutation.addedNodes) {
                      removePreloader(node);
                    }
                  }
                });
                
                observer.observe(document.documentElement, { childList: true, subtree: true });
                
                window.addEventListener('DOMContentLoaded', () => {
                  document.querySelectorAll('.simulator-pre-loader, .simulator').forEach(el => el.remove());
                  observer.disconnect();
                });
              })();
            `
          }}
        />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}
