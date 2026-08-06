'use client'

import { useState, useEffect, useRef } from 'react'

const testimonials = [
  {
    name: 'Sarah Mitchell',
    country: 'Australia',
    flag: '🇦🇺',
    photo: 'https://randomuser.me/api/portraits/women/44.jpg',
    rating: 5,
    text: 'Absolutely breathtaking experience! The sunrise from Mount Batur was the highlight of our Bali trip. Our guide was incredibly knowledgeable and made us feel safe throughout the entire adventure.',
    tour: 'Jeep Sunrise Tour',
  },
  {
    name: 'Takeshi Yamamoto',
    country: 'Japan',
    flag: '🇯🇵',
    photo: 'https://randomuser.me/api/portraits/men/32.jpg',
    rating: 5,
    text: 'The trekking experience was unforgettable. Watching the sunrise from the summit while enjoying breakfast was magical. Highly recommend Terra Adventure for anyone visiting Bali!',
    tour: 'Mount Batur Trekking',
  },
  {
    name: 'Emma & James Wilson',
    country: 'United Kingdom',
    flag: '🇬🇧',
    photo: 'https://randomuser.me/api/portraits/women/68.jpg',
    rating: 5,
    text: 'We booked the jeep tour for our honeymoon and it exceeded all expectations. The black lava fields were surreal, and the whole experience felt like a movie scene. 10/10!',
    tour: 'Jeep Sunrise Tour',
  },
  {
    name: 'Lucas van der Berg',
    country: 'Netherlands',
    flag: '🇳🇱',
    photo: 'https://randomuser.me/api/portraits/men/75.jpg',
    rating: 5,
    text: 'Professional, punctual, and passionate! The team picked us up on time and the entire tour was well-organized. The views were absolutely spectacular. Will definitely come back!',
    tour: 'Jeep Sunrise Tour',
  },
  {
    name: 'Priya Sharma',
    country: 'India',
    flag: '🇮🇳',
    photo: 'https://randomuser.me/api/portraits/women/90.jpg',
    rating: 5,
    text: 'The trekking via Pasar Agung route was challenging but so worth it. Our guide was patient and encouraging. The sunrise at the summit was a spiritual experience I will never forget.',
    tour: 'Mount Batur Trekking',
  },
  {
    name: 'Michael & Sophie Chen',
    country: 'Singapore',
    flag: '🇸🇬',
    photo: 'https://randomuser.me/api/portraits/men/22.jpg',
    rating: 5,
    text: 'Best adventure activity in Bali, hands down! The jeep ride through the volcanic landscape was thrilling. Great value for money and an experience we will treasure forever.',
    tour: 'Jeep Sunrise Tour',
  },
]

const StarIcon = ({ filled }: { filled: boolean }) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill={filled ? '#F59E0B' : 'none'}
    stroke={filled ? '#F59E0B' : '#D1D5DB'}
    strokeWidth="2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
    />
  </svg>
)

const QuoteIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" opacity="0.12">
    <path
      d="M14.017 18L14.017 10.609C14.017 4.905 17.748 1.039 23 0L23.995 2.151C21.563 3.068 20 5.789 20 8H24V18H14.017ZM0 18V10.609C0 4.905 3.748 1.039 9 0L9.996 2.151C7.563 3.068 6 5.789 6 8H10V18H0Z"
      fill="#7B2D1F"
    />
  </svg>
)

export default function Testimonials() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      setCanScrollLeft(scrollLeft > 10)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  useEffect(() => {
    checkScroll()
    const el = scrollRef.current
    if (el) {
      el.addEventListener('scroll', checkScroll)
      window.addEventListener('resize', checkScroll)
      return () => {
        el.removeEventListener('scroll', checkScroll)
        window.removeEventListener('resize', checkScroll)
      }
    }
  }, [])

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 380
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      })
    }
  }

  return (
    <section
      id="testimonials"
      style={{
        backgroundColor: '#F5F2ED',
        padding: '80px 0',
        overflow: 'hidden',
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        {/* Header */}
        <div
          className="flex flex-col md:flex-row md:items-end justify-between gap-6"
          style={{ marginBottom: 40 }}
        >
          <div>
            <p
              style={{
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '0.2em',
                color: '#7B2D1F',
                marginBottom: 10,
                textTransform: 'uppercase',
              }}
            >
              Testimonials
            </p>
            <h2
              style={{
                fontFamily: 'Georgia, serif',
                fontSize: 'clamp(28px, 3.5vw, 44px)',
                fontWeight: 700,
                color: '#1a1a1a',
                lineHeight: 1.1,
              }}
            >
              WHAT OUR GUESTS SAY
            </h2>
          </div>

          {/* Scroll buttons */}
          <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
            <button
              onClick={() => scroll('left')}
              style={{
                width: 40,
                height: 40,
                borderRadius: 4,
                border: '1.5px solid',
                borderColor: canScrollLeft ? '#7B2D1F' : '#D1C9BE',
                backgroundColor: 'transparent',
                cursor: canScrollLeft ? 'pointer' : 'default',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
                opacity: canScrollLeft ? 1 : 0.4,
              }}
            >
              <svg
                width="16"
                height="16"
                fill="none"
                stroke={canScrollLeft ? '#7B2D1F' : '#888'}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button
              onClick={() => scroll('right')}
              style={{
                width: 40,
                height: 40,
                borderRadius: 4,
                border: '1.5px solid',
                borderColor: canScrollRight ? '#7B2D1F' : '#D1C9BE',
                backgroundColor: canScrollRight ? '#7B2D1F' : 'transparent',
                cursor: canScrollRight ? 'pointer' : 'default',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
                opacity: canScrollRight ? 1 : 0.4,
              }}
            >
              <svg
                width="16"
                height="16"
                fill="none"
                stroke={canScrollRight ? 'white' : '#888'}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>

        {/* Scrollable cards */}
        <div
          ref={scrollRef}
          style={{
            display: 'flex',
            gap: 20,
            overflowX: 'auto',
            scrollSnapType: 'x mandatory',
            scrollbarWidth: 'none',
            paddingBottom: 8,
          }}
          className="hide-scrollbar"
        >
          {testimonials.map((t, i) => (
            <div
              key={i}
              style={{
                flex: '0 0 350px',
                scrollSnapAlign: 'start',
                backgroundColor: 'white',
                borderRadius: 8,
                padding: '28px 24px 24px',
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
                border: '1px solid rgba(0,0,0,0.06)',
                transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                position: 'relative',
                overflow: 'hidden',
              }}
              className="testimonial-card"
            >
              {/* Quote icon background */}
              <div
                style={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                }}
              >
                <QuoteIcon />
              </div>

              {/* Stars */}
              <div style={{ display: 'flex', gap: 2 }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIcon key={star} filled={star <= t.rating} />
                ))}
              </div>

              {/* Review text */}
              <p
                style={{
                  fontSize: 13.5,
                  color: '#444',
                  lineHeight: 1.7,
                  flex: 1,
                  margin: 0,
                }}
              >
                &ldquo;{t.text}&rdquo;
              </p>

              {/* Tour badge */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  backgroundColor: '#F5F2ED',
                  padding: '5px 12px',
                  borderRadius: 20,
                  alignSelf: 'flex-start',
                }}
              >
                <svg
                  width="12"
                  height="12"
                  fill="none"
                  stroke="#7B2D1F"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 600,
                    color: '#7B2D1F',
                    letterSpacing: '0.04em',
                  }}
                >
                  {t.tour}
                </span>
              </div>

              {/* Divider */}
              <div
                style={{
                  height: 1,
                  backgroundColor: 'rgba(0,0,0,0.06)',
                  margin: '0 -24px',
                }}
              />

              {/* Author */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <img
                  src={t.photo}
                  alt={t.name}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    objectFit: 'cover',
                    flexShrink: 0,
                    border: '2px solid rgba(123,45,31,0.15)',
                  }}
                />
                <div>
                  <p
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: '#1a1a1a',
                      margin: 0,
                      lineHeight: 1.3,
                    }}
                  >
                    {t.name}
                  </p>
                  <p
                    style={{
                      fontSize: 11,
                      color: '#888',
                      margin: 0,
                      marginTop: 2,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    <span>{t.flag}</span>
                    {t.country}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom stats */}
        <div
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
          style={{ marginTop: 40 }}
        >
          {[
            { value: '500+', label: 'Happy Guests' },
            { value: '5.0', label: 'Average Rating' },
            { value: '100%', label: 'Safety Record' },
            { value: '3+', label: 'Years Experience' },
          ].map((stat, i) => (
            <div
              key={i}
              style={{
                textAlign: 'center',
                padding: '20px 16px',
                backgroundColor: 'white',
                borderRadius: 6,
                border: '1px solid rgba(0,0,0,0.06)',
              }}
            >
              <p
                style={{
                  fontFamily: 'Georgia, serif',
                  fontSize: 28,
                  fontWeight: 700,
                  color: '#7B2D1F',
                  margin: 0,
                  lineHeight: 1,
                }}
              >
                {stat.value}
              </p>
              <p
                style={{
                  fontSize: 11,
                  color: '#888',
                  margin: 0,
                  marginTop: 6,
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}
              >
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .testimonial-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.08);
        }
      `}</style>
    </section>
  )
}
