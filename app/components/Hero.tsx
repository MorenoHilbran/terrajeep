'use client'

export default function Hero() {
  const features = [
    {
      icon: (
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707" />
          <circle cx="12" cy="12" r="4" />
        </svg>
      ),
      label: 'BEST SUNRISE VIEW',
    },
    {
      icon: (
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
      ),
      label: 'EXCITING ADVENTURE',
    },
    {
      icon: (
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      label: 'LOCAL EXPERT GUIDE',
    },
    {
      icon: (
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      label: 'SAFETY FIRST',
    },
  ]

  return (
    <section style={{ position: 'relative', width: '100%', minHeight: '100vh', overflow: 'hidden' }} className="flex items-center">
      {/* Background image */}
      <img
        src="/images/jeep-2.jpeg"
        alt="Mount Batur"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
      />
      {/* Dark overlay */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.3) 60%, rgba(0,0,0,0.1) 100%)' }} />

      {/* Content */}
      <div 
        className="max-w-[1200px] mx-auto px-6 w-full flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10 lg:gap-8 pt-28 pb-16 lg:py-0"
        style={{
          position: 'relative',
          zIndex: 2,
        }}
      >
        {/* Left: Text */}
        <div className="w-full lg:max-w-[480px]">
          <h1 style={{
            fontFamily: 'Georgia, serif',
            fontSize: 'clamp(38px, 6vw, 72px)',
            fontWeight: 700,
            color: 'white',
            lineHeight: 1.05,
            letterSpacing: '-0.01em',
            marginBottom: 8,
          }}>
            EXPLORE<br />MOUNT BATUR
          </h1>
          <p style={{
            fontFamily: 'Helvetica Neue, sans-serif',
            fontSize: 14,
            fontWeight: 400,
            color: 'rgba(255,255,255,0.85)',
            letterSpacing: '0.2em',
            marginBottom: 20,
          }}>
            LIKE NEVER BEFORE
          </p>
          {/* Divider */}
          <div style={{ width: 40, height: 2, backgroundColor: '#7B2D1F', marginBottom: 20 }} />
          <p style={{
            fontSize: 14,
            color: 'rgba(255,255,255,0.8)',
            lineHeight: 1.7,
            maxWidth: 360,
            marginBottom: 36,
          }}>
            Experience the best of Bali's volcanic landscape with our Jeep Tours and Trekking Adventures.
          </p>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <a
              href="#products"
              style={{
                display: 'inline-block',
                backgroundColor: '#7B2D1F',
                color: 'white',
                padding: '12px 24px',
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: '0.08em',
                textDecoration: 'none',
                borderRadius: 3,
              }}
            >
              EXPLORE PACKAGES
            </a>
            <a
              href="https://wa.me/6281234567890"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                backgroundColor: 'transparent',
                color: 'white',
                padding: '11px 22px',
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: '0.08em',
                textDecoration: 'none',
                border: '1.5px solid rgba(255,255,255,0.6)',
                borderRadius: 3,
              }}
            >
              <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              BOOK VIA WHATSAPP
            </a>
          </div>
        </div>

        {/* Right: Feature badges */}
        <div className="flex flex-row lg:flex-col gap-4 lg:gap-4 lg:ml-auto flex-wrap lg:flex-nowrap w-full lg:w-auto mt-2 lg:mt-0">
          {features.map((f, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 36,
                height: 36,
                borderRadius: 2,
                border: '1px solid rgba(255,255,255,0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                flexShrink: 0,
              }}>
                {f.icon}
              </div>
              <span style={{ color: 'white', fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', lineHeight: 1.3 }}>{f.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
