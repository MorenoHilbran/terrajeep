'use client'

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#5a1f14', padding: '16px 24px' }}>
      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
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
