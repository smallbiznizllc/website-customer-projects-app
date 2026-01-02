import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { getSEOConfig } from '@/app/actions/seo'

const inter = Inter({ subsets: ['latin'] })

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
      ...(seo.canonicalUrl && {
        alternates: {
          canonical: seo.canonicalUrl,
        },
      }),
    }
  } catch (error) {
    return {
      title: 'SmallBizNiz LLC',
      description: 'Business Solutions',
    }
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}



