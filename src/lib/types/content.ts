export interface LandingContent {
  hero: {
    title: string
    subtitle: string
    ctaText: string
  }
  services: Array<{
    id: string
    title: string
    description: string
    icon?: string
  }>
  contact: {
    email: string
    phone?: string
    address?: string
  }
  footer: {
    text: string
    links?: Array<{ label: string; url: string }>
  }
}



