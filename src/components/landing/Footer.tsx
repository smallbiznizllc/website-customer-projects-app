interface FooterProps {
  footer: {
    text: string
    links?: Array<{ label: string; url: string }>
  }
  contact: {
    email: string
    phone?: string
    address?: string
  }
}

export default function Footer({ footer, contact }: FooterProps) {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <p className="text-gray-400">{contact.email}</p>
            {contact.phone && <p className="text-gray-400">{contact.phone}</p>}
            {contact.address && <p className="text-gray-400">{contact.address}</p>}
          </div>
          <div>
            {footer.links && footer.links.length > 0 && (
              <>
                <h3 className="text-lg font-semibold mb-4">Links</h3>
                <ul className="space-y-2">
                  {footer.links.map((link, idx) => (
                    <li key={idx}>
                      <a
                        href={link.url}
                        className="text-gray-400 hover:text-white"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
          <div>
            <p className="text-gray-400">{footer.text}</p>
          </div>
        </div>
      </div>
    </footer>
  )
}



