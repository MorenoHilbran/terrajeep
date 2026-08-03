'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        backgroundColor: scrolled || isOpen ? 'rgba(0,0,0,0.95)' : 'rgba(0,0,0,0.35)',
        borderBottom: scrolled || isOpen ? '1px solid rgba(255,255,255,0.08)' : 'none',
        backdropFilter: 'blur(6px)',
        transition: 'background-color 0.3s',
      }}
    >
      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        padding: '0 24px',
        height: 64,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 24,
      }}>
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', flexShrink: 0 }}>
          <img
            src="/logo.jpg"
            alt="Terra Jeep Adventure Bali Logo"
            style={{
              height: 42,
              width: 42,
              borderRadius: '50%',
              objectFit: 'cover',
            }}
          />
          <div style={{ color: 'white', lineHeight: 1.1 }}>
            <div style={{ fontSize: 14, fontWeight: 800, letterSpacing: '0.12em', fontFamily: 'Georgia, serif' }}>TERRA</div>
            <div style={{ fontSize: 9, letterSpacing: '0.08em', fontWeight: 600, opacity: 0.9 }}>JEEP ADVENTURE</div>
            <div style={{ fontSize: 8, letterSpacing: '0.22em', fontWeight: 400, opacity: 0.75 }}>B A L I</div>
          </div>
        </Link>

        {/* Desktop Nav links */}
        <div className="hidden md:flex items-center gap-9">
          <a href="#" style={{ color: '#C9865A', fontSize: 13, fontWeight: 600, letterSpacing: '0.04em', textDecoration: 'none' }}>HOME</a>
          <a href="#about" style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13, fontWeight: 400, letterSpacing: '0.04em', textDecoration: 'none' }}>ABOUT US</a>
          <a href="#products" style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13, fontWeight: 400, letterSpacing: '0.04em', textDecoration: 'none' }}>PACKAGES</a>
          <a href="#contact" style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13, fontWeight: 400, letterSpacing: '0.04em', textDecoration: 'none' }}>CONTACT</a>
        </div>

        {/* Desktop CTA */}
        <a
          href="https://wa.me/6281234567890"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:flex items-center gap-2 bg-[#7B2D1F] text-white py-[9px] px-[18px] rounded-[4px] text-[12px] font-semibold tracking-[0.05em] no-underline"
          style={{ flexShrink: 0 }}
        >
          <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>
          BOOK VIA WHATSAPP
        </a>

        {/* Hamburger Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden flex flex-col justify-between w-6 h-[18px] bg-transparent border-0 p-0 cursor-pointer focus:outline-none z-[101]"
          aria-label="Toggle menu"
        >
          <span className={`w-full h-[2px] bg-white rounded transition-transform duration-300 ${isOpen ? 'rotate-45 translate-y-[8px]' : ''}`} />
          <span className={`w-full h-[2px] bg-white rounded transition-opacity duration-300 ${isOpen ? 'opacity-0' : ''}`} />
          <span className={`w-full h-[2px] bg-white rounded transition-transform duration-300 ${isOpen ? '-rotate-45 -translate-y-[8px]' : ''}`} />
        </button>
      </div>

      {/* Mobile Drawer Dropdown */}
      <div 
        className={`md:hidden absolute top-[64px] left-0 right-0 bg-[#0a0a0a]/95 backdrop-blur-lg border-b border-white/10 px-6 py-6 flex flex-col gap-5 transition-all duration-300 origin-top shadow-xl ${
          isOpen ? 'opacity-100 scale-y-100 pointer-events-auto' : 'opacity-0 scale-y-0 pointer-events-none'
        }`}
        style={{
          transformStyle: 'preserve-3d',
        }}
      >
        <a 
          href="#" 
          onClick={() => setIsOpen(false)}
          className="text-[#C9865A] text-[14px] font-semibold tracking-[0.06em] no-underline py-1.5"
        >
          HOME
        </a>
        <a 
          href="#about" 
          onClick={() => setIsOpen(false)}
          className="text-white/85 text-[14px] font-semibold tracking-[0.06em] no-underline py-1.5 border-t border-white/5"
        >
          ABOUT US
        </a>
        <a 
          href="#products" 
          onClick={() => setIsOpen(false)}
          className="text-white/85 text-[14px] font-semibold tracking-[0.06em] no-underline py-1.5 border-t border-white/5"
        >
          PACKAGES
        </a>
        <a 
          href="#contact" 
          onClick={() => setIsOpen(false)}
          className="text-white/85 text-[14px] font-semibold tracking-[0.06em] no-underline py-1.5 border-t border-white/5"
        >
          CONTACT
        </a>
        <a
          href="https://wa.me/6281234567890"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 bg-[#7B2D1F] text-white py-3 px-6 rounded-md text-[13px] font-semibold tracking-[0.05em] no-underline mt-2 shadow-lg active:scale-[0.98] transition-transform"
        >
          <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>
          BOOK VIA WHATSAPP
        </a>
      </div>
    </nav>
  )
}
