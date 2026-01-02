import Link from 'next/link'

interface HeroProps {
  content: {
    title: string
    subtitle: string
    ctaText: string
  }
}

export default function Hero({ content }: HeroProps) {
  return (
    <section className="bg-gradient-to-r from-primary to-blue-600 text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            {content.title}
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            {content.subtitle}
          </p>
          <Link
            href="/login"
            className="inline-block px-8 py-3 bg-white text-primary rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            {content.ctaText}
          </Link>
        </div>
      </div>
    </section>
  )
}



