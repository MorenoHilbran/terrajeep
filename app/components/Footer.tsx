'use client'

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#5a1f14', padding: '24px 24px' }}>
      <div 
        className="max-w-[1200px] mx-auto flex flex-col sm:flex-row gap-4 items-center justify-between text-center sm:text-left"
        style={{
          margin: '0 auto',
        }}
      >
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.04em' }}>
          © {new Date().getFullYear()} Terra Adventure Bali. All rights reserved.
        </p>
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.06em' }}>
          Kintamani, Bali, Indonesia
        </p>
      </div>
    </footer>
  )
}
