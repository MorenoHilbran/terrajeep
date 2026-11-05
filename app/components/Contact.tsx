'use client'

export default function Contact() {
  return (
    <section id="contact" className="py-20 bg-[#7B2D1F] text-white">
      <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Left: Heading & Info (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          <div>
            <p className="text-white/60 text-xs font-semibold tracking-[0.2em] uppercase mb-3">
              Get In Touch
            </p>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">
              READY FOR YOUR<br />NEXT ADVENTURE?
            </h2>
            <p className="text-white/80 text-sm md:text-base max-w-xl leading-relaxed">
              Book your Mount Batur experience today and create unforgettable memories in Bali. Contact us via WhatsApp, TikTok, or email.
            </p>
          </div>

          {/* Contact Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-2">
            {[
              {
                icon: (
                  <svg width="24" height="24" fill="#25D366" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                ),
                value: '+62 812 1607 4831',
                label: 'WhatsApp',
                link: 'https://wa.me/6281216074831',
              },
              {
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.89-.6-4.09-1.51-.71-.53-1.3-1.22-1.74-2v7.37c-.12 2.01-.84 4.02-2.3 5.41-1.63 1.55-4.07 2.22-6.26 1.83-2.35-.41-4.52-2.12-5.32-4.44-1.07-3.08.19-6.8 2.76-8.52 1.49-1 3.34-1.39 5.12-1.09v4.07c-1.12-.32-2.37-.15-3.32.55-1.15.82-1.68 2.37-1.26 3.74.37 1.25 1.54 2.22 2.85 2.33 1.44.13 2.94-.65 3.52-1.97.23-.5.33-1.06.32-1.62V0h.02z" fill="#000000"/>
                  </svg>
                ),
                value: '@terra.adventure.bali',
                label: 'TikTok',
                link: 'https://www.tiktok.com/@terra.adventure.bali',
              },
              {
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M2 6L12 13L22 6" stroke="#EA4335" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <rect x="2" y="4" width="20" height="16" rx="3" stroke="#4285F4" strokeWidth="1.5"/>
                    <path d="M2 6L2 18C2 19.657 3.343 21 5 21H19C20.657 21 22 19.657 22 18V6" stroke="#34A853" strokeWidth="0" fill="none"/>
                    <path d="M2 18L8.5 12" stroke="#FBBC04" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M22 18L15.5 12" stroke="#34A853" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                ),
                value: 'terraadventure9@gmail.com',
                label: 'Email',
                link: 'mailto:terraadventure9@gmail.com',
              },
              {
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#EA4335"/>
                    <circle cx="12" cy="9" r="3" fill="#B31412"/>
                    <circle cx="12" cy="9" r="1.5" fill="white"/>
                  </svg>
                ),
                value: 'Kintamani, Bali',
                label: 'Location',
                link: 'https://share.google/csqO5RheRkpH7AVh4',
              },
            ].map((item, i) => (
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                key={i}
                className="flex items-center gap-4 p-4 rounded-xl bg-white hover:bg-gray-50 transition-colors duration-200 no-underline group"
              >
                <div className="flex-shrink-0">
                  {item.icon}
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] text-gray-400 tracking-[0.15em] font-semibold uppercase mb-0.5">
                    {item.label}
                  </div>
                  <div className="text-xs sm:text-sm font-semibold text-gray-800 leading-snug break-all sm:break-normal">
                    {item.value}
                  </div>
                </div>
              </a>
            ))}
          </div>

          {/* Booking CTA Button */}
          <div>
            <a
              href="https://wa.me/6281216074831?text=Hi%20Terra%20Adventure%2C%20I'm%20interested%20in%20booking%20a%20tour"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 bg-[#25D366] text-white hover:bg-[#20bd5a] active:scale-[0.98] transition-all px-8 py-4 rounded-xl text-sm font-bold tracking-wider uppercase group no-underline"
            >
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24" className="transition-transform group-hover:scale-110">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              BOOK VIA WHATSAPP
            </a>
          </div>
        </div>

        {/* Right: Map Card (5 cols) */}
        <div className="lg:col-span-5 w-full">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm flex flex-col gap-5">
            <div>
              <p className="text-white/60 text-xs font-semibold tracking-[0.2em] uppercase mb-1">
                Meeting Point / Titik Jemput
              </p>
              <h3 className="font-serif text-xl md:text-2xl font-bold">
                Jess Mount Batur and Jeep Sunrise
              </h3>
              <p className="text-white/70 text-xs mt-1">
                Kintamani, Bangli Regency, Bali 80522
              </p>
            </div>
            
            {/* Embedded Google Map */}
            <div className="w-full aspect-[4/3] rounded-xl overflow-hidden border border-white/10 relative">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7897.548387689686!2d115.39992928504945!3d-8.225448542868893!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd1f1fd19f25749%3A0x9dd797145c7349c2!2sJess%20Mount%20Batur%20and%20Jeep%20Sunrise!5e0!3m2!1sid!2sid!4v1793802327949!5m2!1sid!2sid" 
                className="absolute inset-0 w-full h-full border-0"
                allowFullScreen={true}
                loading="lazy" 
                referrerPolicy="strict-origin-when-cross-origin"
              ></iframe>
            </div>

            {/* Direction button */}
            <a 
              href="https://share.google/csqO5RheRkpH7AVh4"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-white text-[#7B2D1F] hover:bg-white/95 active:scale-[0.98] transition-all py-3.5 px-5 rounded-xl text-xs font-bold tracking-wider uppercase no-underline"
            >
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
              DIRECTIONS ON GOOGLE MAPS
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
