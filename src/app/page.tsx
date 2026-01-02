import { getLandingContent } from '@/app/actions/content'
import { getSEOConfig } from '@/app/actions/seo'
import Hero from '@/components/landing/Hero'
import Services from '@/components/landing/Services'
import Footer from '@/components/landing/Footer'
import { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  try {
    const seo = await getSEOConfig()
    
    return {
      title: seo.title,
      description: seo.description,
      openGraph: {
        title: seo.title,
        description: seo.description,
        images: seo.ogImage ? [seo.ogImage] : [],
      },
    }
  } catch (error) {
    return {
      title: 'SmallBizNiz LLC',
      description: 'Business Solutions',
    }
  }
}

export default async function HomePage() {
  const content = await getLandingContent()

  return (
    <main className="min-h-screen">
      <Hero content={content.hero} />
      <Services services={content.services} />
      <Footer footer={content.footer} contact={content.contact} />
    </main>
  )
}



