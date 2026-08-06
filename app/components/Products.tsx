'use client'

import { useState } from 'react'

const packages = [
  {
    num: '01',
    name: 'MOUNT BATUR JEEP SUNRISE TOUR',
    prices: {
      IDR: { value: 'IDR 475K', unit: '/ jeep (2 pax)' },
      USD: { value: '$30', unit: '/ jeep (2 pax)' },
    },
    images: [
      '/images/jeep-2.jpeg',
      '/images/jeep-1.jpeg',
      '/images/jeep-3.jpeg',
      '/images/jeep-4.jpeg',
    ],
    highlights: [
      { left: 'Sunrise Viewpoint', right: 'Black Lava Exploration' },
      { left: '4WD Jeep Adventure', right: 'Hotel Pickup Available' },
    ],
  },
  {
    num: '02',
    name: 'MOUNT BATUR TREKKING VIA PASAR AGUNG',
    prices: {
      IDR: { value: 'IDR 425K', unit: '/ person' },
      USD: { value: '$27', unit: '/ person' },
    },
    images: [
      '/images/tracking-gunungbatur-.jpg',
      '/images/tracking-gunungbatur-1.jpeg',
      '/images/tracking-gunungbatur-2.jpeg',
      '/images/tracking-gunungbatur-3.jpeg',
    ],
    highlights: [
      { left: 'Sunrise Summit Experience', right: 'Scenic Trekking Trail' },
      { left: 'Experienced Guide', right: 'Breakfast at Summit' },
    ],
  },
]

const CheckIcon = () => (
  <svg width="14" height="14" fill="none" stroke="#7B2D1F" strokeWidth="2" viewBox="0 0 24 24" style={{ flexShrink: 0, marginTop: 1 }}>
    <circle cx="12" cy="12" r="9" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.5 12.5l2.5 2.5 4-5" />
  </svg>
)

const ChevronLeft = () => (
  <svg width="16" height="16" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M15 18l-6-6 6-6" />
  </svg>
)

const ChevronRight = () => (
  <svg width="16" height="16" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M9 18l6-6-6-6" />
  </svg>
)

function PackageCarousel({ pkg, currency }: { pkg: typeof packages[0]; currency: 'IDR' | 'USD' }) {
  const [active, setActive] = useState(0)

  const prev = () => setActive(i => (i === 0 ? pkg.images.length - 1 : i - 1))
  const next = () => setActive(i => (i === pkg.images.length - 1 ? 0 : i + 1))

  return (
    <div style={{ backgroundColor: 'white', borderRadius: 4, overflow: 'hidden' }}>
      {/* Image carousel */}
      <div style={{ position: 'relative', aspectRatio: '4/3', backgroundColor: '#111', overflow: 'hidden' }}>
        <img
          key={active}
          src={pkg.images[active]}
          alt={pkg.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            display: 'block',
          }}
        />

        {/* Number badge */}
        <div style={{
          position: 'absolute',
          top: 14,
          left: 14,
          backgroundColor: '#7B2D1F',
          color: 'white',
          fontSize: 12,
          fontWeight: 700,
          padding: '4px 10px',
          borderRadius: 2,
          letterSpacing: '0.05em',
          zIndex: 2,
        }}>
          {pkg.num}
        </div>

        {/* Prev button */}
        <button
          onClick={prev}
          style={{
            position: 'absolute',
            left: 12,
            top: '50%',
            transform: 'translateY(-50%)',
            backgroundColor: 'rgba(0,0,0,0.4)',
            border: 'none',
            borderRadius: 2,
            width: 30,
            height: 30,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 2,
          }}
        >
          <ChevronLeft />
        </button>

        {/* Next button */}
        <button
          onClick={next}
          style={{
            position: 'absolute',
            right: 12,
            top: '50%',
            transform: 'translateY(-50%)',
            backgroundColor: 'rgba(0,0,0,0.4)',
            border: 'none',
            borderRadius: 2,
            width: 30,
            height: 30,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 2,
          }}
        >
          <ChevronRight />
        </button>

        {/* Dot indicators */}
        <div style={{
          position: 'absolute',
          bottom: 12,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 6,
          zIndex: 2,
        }}>
          {pkg.images.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              style={{
                width: i === active ? 20 : 6,
                height: 6,
                borderRadius: 3,
                backgroundColor: i === active ? 'white' : 'rgba(255,255,255,0.5)',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                transition: 'width 0.2s',
              }}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '20px 24px 24px' }}>
        <h3 style={{
          fontFamily: 'Georgia, serif',
          fontSize: 15,
          fontWeight: 700,
          color: '#1a1a1a',
          marginBottom: 16,
          lineHeight: 1.3,
        }}>
          {pkg.name}
        </h3>

        {/* Highlights + price row */}
        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
          {/* Highlights */}
          <div style={{ flex: 1 }}>
            {pkg.highlights.map((row, i) => (
              <div key={i} style={{ display: 'flex', gap: 20, marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6, flex: 1 }}>
                  <CheckIcon />
                  <span style={{ fontSize: 12, color: '#444', lineHeight: 1.4 }}>{row.left}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6, flex: 1 }}>
                  <CheckIcon />
                  <span style={{ fontSize: 12, color: '#444', lineHeight: 1.4 }}>{row.right}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Price + CTA */}
          <div style={{ flexShrink: 0, textAlign: 'right' }}>
            <p style={{ fontSize: 10, color: '#888', letterSpacing: '0.08em', marginBottom: 2 }}>START FROM</p>
            <p style={{
              fontFamily: 'Georgia, serif',
              fontSize: 22,
              fontWeight: 700,
              color: '#7B2D1F',
              marginBottom: 2,
              whiteSpace: 'nowrap',
            }}>
              {pkg.prices[currency].value}
            </p>
            <p style={{
              fontSize: 10,
              color: '#666',
              marginBottom: 12,
              whiteSpace: 'nowrap',
            }}>
              {pkg.prices[currency].unit}
            </p>
            <a
              href="https://wa.me/6281216074831"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                backgroundColor: '#7B2D1F',
                color: 'white',
                padding: '9px 20px',
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.08em',
                textDecoration: 'none',
                borderRadius: 2,
              }}
            >
              BOOK NOW
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Products() {
  const [currency, setCurrency] = useState<'IDR' | 'USD'>('IDR')

  return (
    <section id="products" style={{ backgroundColor: '#EAE6E0', padding: '80px 0' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-9">
          <div>
            <p style={{
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '0.2em',
              color: '#7B2D1F',
              marginBottom: 10,
              textTransform: 'uppercase',
            }}>
              Our Adventures
            </p>
            <h2 style={{
              fontFamily: 'Georgia, serif',
              fontSize: 'clamp(28px, 3.5vw, 44px)',
              fontWeight: 700,
              color: '#1a1a1a',
              lineHeight: 1.1,
            }}>
              CHOOSE YOUR ADVENTURE
            </h2>
          </div>
          
          {/* Controls: Currency Switcher & Button */}
          <div className="flex items-center gap-4 self-start md:self-auto">
            {/* Currency Switcher */}
            <div style={{
              display: 'inline-flex',
              backgroundColor: '#D1C9BE',
              borderRadius: 4,
              padding: 3,
              gap: 2,
            }}>
              <button
                onClick={() => setCurrency('IDR')}
                style={{
                  padding: '6px 14px',
                  fontSize: 11,
                  fontWeight: 700,
                  borderRadius: 2,
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: currency === 'IDR' ? '#7B2D1F' : 'transparent',
                  color: currency === 'IDR' ? 'white' : '#444',
                  transition: 'all 0.2s ease',
                  letterSpacing: '0.05em',
                }}
              >
                IDR
              </button>
              <button
                onClick={() => setCurrency('USD')}
                style={{
                  padding: '6px 14px',
                  fontSize: 11,
                  fontWeight: 700,
                  borderRadius: 2,
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: currency === 'USD' ? '#7B2D1F' : 'transparent',
                  color: currency === 'USD' ? 'white' : '#444',
                  transition: 'all 0.2s ease',
                  letterSpacing: '0.05em',
                }}
              >
                USD
              </button>
            </div>

            <a
              href="#contact"
              style={{
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '0.1em',
                color: '#1a1a1a',
                textDecoration: 'none',
                border: '1px solid #1a1a1a',
                padding: '8px 16px',
                borderRadius: 2,
                whiteSpace: 'nowrap',
              }}
            >
              VIEW ALL PACKAGES
            </a>
          </div>
        </div>

        {/* Package cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {packages.map((pkg) => (
            <PackageCarousel key={pkg.num} pkg={pkg} currency={currency} />
          ))}
        </div>
      </div>
    </section>
  )
}
