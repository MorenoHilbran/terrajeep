import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Testimonials from './components/Testimonials'
import About from './components/About'
import Products from './components/Products'
import WhyChooseUs from './components/WhyChooseUs'
import Gallery from './components/Gallery'
import Contact from './components/Contact'
import Footer from './components/Footer'
import WhatsAppButton from './components/WhatsAppButton'
import { getGallery, getPackages, getSettings } from '@/lib/data'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const [galleryItems, packageItems, siteSettings] = await Promise.all([
    getGallery(),
    getPackages(),
    getSettings(),
  ])

  return (
    <main>
      <Navbar />
      <Hero reviewUrl={siteSettings.googleReviewUrl} />
      <Testimonials reviewUrl={siteSettings.googleReviewUrl} />
      <About />
      <Products items={packageItems} whatsappNumber={siteSettings.whatsappNumber} />
      <WhyChooseUs />
      <Gallery items={galleryItems} />
      <Contact />
      <Footer />
      <WhatsAppButton />
    </main>
  )
}
