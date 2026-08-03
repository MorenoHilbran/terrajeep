'use client'

const stats = [
  {
    icon: (
      <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.4" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    value: '1000+',
    label: 'Happy Travelers',
  },
  {
    icon: (
      <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.4" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    value: 'Professional',
    label: 'Local Guides',
  },
  {
    icon: (
      <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.4" viewBox="0 0 24 24">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="16" y1="2" x2="16" y2="6" strokeLinecap="round" />
        <line x1="8" y1="2" x2="8" y2="6" strokeLinecap="round" />
        <line x1="3" y1="10" x2="21" y2="10" strokeLinecap="round" />
      </svg>
    ),
    value: 'Daily',
    label: 'Departures',
  },
  {
    icon: (
      <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.4" viewBox="0 0 24 24">
        <polygon strokeLinecap="round" strokeLinejoin="round" points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
    value: '5-Star',
    label: 'Experiences',
  },
]

export default function About() {
  return (
    <section id="about" style={{ backgroundColor: '#F5F2EE', padding: '80px 0' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'flex', gap: 64, alignItems: 'center' }}>
        {/* Left: Text */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '0.2em',
            color: '#7B2D1F',
            marginBottom: 16,
            textTransform: 'uppercase',
          }}>
            About Us
          </p>
          <h2 style={{
            fontFamily: 'Georgia, serif',
            fontSize: 'clamp(32px, 4vw, 52px)',
            fontWeight: 700,
            color: '#1a1a1a',
            lineHeight: 1.1,
            marginBottom: 24,
          }}>
            ABOUT<br />TERRA ADVENTURE
          </h2>
          <p style={{ fontSize: 14, lineHeight: 1.8, color: '#444', marginBottom: 16, maxWidth: 420 }}>
            Terra Adventure is a local tour operator in Bali specializing in Mount Batur Jeep Tours and Mount Batur Trekking experiences.
          </p>
          <p style={{ fontSize: 14, lineHeight: 1.8, color: '#444', marginBottom: 48, maxWidth: 420 }}>
            We are passionate about providing authentic adventures, outstanding service, and unforgettable moment for every traveler.
          </p>

          {/* Stats */}
          <div style={{ display: 'flex', gap: 0 }}>
            {stats.map((s, i) => (
              <div key={i} style={{
                flex: 1,
                paddingRight: i < stats.length - 1 ? 24 : 0,
                borderRight: i < stats.length - 1 ? '1px solid #ddd' : 'none',
                paddingLeft: i > 0 ? 24 : 0,
                textAlign: 'center',
              }}>
                <div style={{ color: '#7B2D1F', marginBottom: 8, display: 'flex', justifyContent: 'center' }}>
                  {s.icon}
                </div>
                <div style={{ fontFamily: 'Georgia, serif', fontSize: 18, fontWeight: 700, color: '#1a1a1a', marginBottom: 4 }}>{s.value}</div>
                <div style={{ fontSize: 11, color: '#888', letterSpacing: '0.04em' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Image */}
        <div style={{ flexShrink: 0, width: '45%' }}>
          <img
            src="/images/jeep-1.jpeg"
            alt="Terra Adventure Bali"
            style={{ width: '100%', height: 420, objectFit: 'cover', borderRadius: 8, display: 'block' }}
          />
        </div>
      </div>
    </section>
  )
}
