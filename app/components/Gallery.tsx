'use client'

import { useState } from 'react'

const images = [
  '/images/jeep-1.jpeg',
  '/images/jeep-2.jpeg',
  '/images/tracking-gunungbatur-.jpg',
  '/images/jeep-3.jpeg',
  '/images/tracking-gunungbatur-1.jpeg',
  '/images/jeep-4.jpeg',
  '/images/tracking-gunungbatur-2.jpeg',
  '/images/jeep-5.jpeg',
  '/images/tracking-gunungbatur-3.jpeg',
  '/images/jeep-6.jpeg',
  '/images/jeep-7.jpeg',
  '/images/jeep-9.jpeg',
  '/images/jeep-10.jpeg',
  '/images/jeep-11.jpeg',
  '/images/jeep-12.jpeg',
  '/images/jeep-13.jpeg',
  '/images/jeep-14.jpeg',
  '/images/jeep-15.jpeg',
]

const VISIBLE = 6

export default function Gallery() {
  const [startIndex, setStartIndex] = useState(0)

  const totalSlides = Math.ceil(images.length / VISIBLE)
  const currentSlide = Math.floor(startIndex / VISIBLE)

  const goTo = (slideIndex: number) => {
    setStartIndex(slideIndex * VISIBLE)
  }

  const visibleImages = images.slice(startIndex, startIndex + VISIBLE)

  return (
    <section id="gallery" style={{ backgroundColor: '#F5F2EE', padding: '72px 0 56px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        {/* Label */}
        <p style={{
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: '0.2em',
          color: '#1a1a1a',
          marginBottom: 24,
        }}>
          GALLERY
        </p>

        {/* Image row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-1.5 w-full">
          {visibleImages.map((src, i) => (
            <div key={i} style={{ aspectRatio: '3/4', overflow: 'hidden', borderRadius: 3 }}>
              <img
                src={src}
                alt={`Gallery ${startIndex + i + 1}`}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </div>
          ))}
        </div>

        {/* Dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 24 }}>
          {Array.from({ length: totalSlides }).map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              style={{
                width: i === currentSlide ? 32 : 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: i === currentSlide ? '#7B2D1F' : '#C8B89A',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                transition: 'width 0.2s',
              }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
