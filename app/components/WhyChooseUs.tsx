'use client'

const reasons = [
  {
    icon: (
      <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.3" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: 'LOCAL EXPERTISE',
    desc: 'Our local guides know every trail, viewpoint, and hidden gem in Bali.',
  },
  {
    icon: (
      <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.3" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: 'SAFETY FIRST',
    desc: 'Safety is our top priority with professional equipment and trained guides.',
  },
  {
    icon: (
      <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.3" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
        <circle cx="12" cy="12" r="9" />
      </svg>
    ),
    title: 'AUTHENTIC EXPERIENCE',
    desc: 'We offer real experiences that connect you with nature and local culture.',
  },
  {
    icon: (
      <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.3" viewBox="0 0 24 24">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="16" y1="2" x2="16" y2="6" strokeLinecap="round" />
        <line x1="8" y1="2" x2="8" y2="6" strokeLinecap="round" />
        <line x1="3" y1="10" x2="21" y2="10" strokeLinecap="round" />
      </svg>
    ),
    title: 'FLEXIBLE BOOKING',
    desc: 'Easy reservations, flexible reschedule, and responsive support.',
  },
]

export default function WhyChooseUs() {
  return (
    <section style={{ backgroundColor: '#1a1a1a', padding: '72px 0' }}>
      <div 
        className="max-w-[1200px] mx-auto px-6 flex flex-col lg:flex-row gap-10 lg:gap-16 items-start w-full"
        style={{
          margin: '0 auto',
        }}
      >
        {/* Left: heading */}
        <div className="w-full lg:w-[220px] lg:flex-shrink-0">
          <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.2em', color: '#888', marginBottom: 14, textTransform: 'uppercase' }}>
            Why Choose Us
          </p>
          <h2 style={{
            fontFamily: 'Georgia, serif',
            fontSize: 'clamp(22px, 2.5vw, 32px)',
            fontWeight: 700,
            color: 'white',
            lineHeight: 1.2,
          }}>
            YOUR SAFETY &amp; SATISFACTION IS OUR PRIORITY
          </h2>
        </div>

        {/* Vertical divider */}
        <div className="hidden lg:block w-[1px] self-stretch bg-white/10 flex-shrink-0" />

        {/* Right: 4 columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-full">
          {reasons.map((r, i) => (
            <div key={i}>
              <div style={{ color: 'rgba(255,255,255,0.75)', marginBottom: 14 }}>{r.icon}</div>
              <h3 style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.12em',
                color: 'white',
                marginBottom: 10,
              }}>
                {r.title}
              </h3>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', lineHeight: 1.7 }}>
                {r.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
