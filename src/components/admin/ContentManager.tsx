'use client'

import { useEffect, useState } from 'react'
import { getLandingContent, updateLandingContent } from '@/app/actions/content'
import { LandingContent } from '@/lib/types/content'
import { Save, Plus, Trash2 } from 'lucide-react'

export default function ContentManager() {
  const [content, setContent] = useState<LandingContent>({
    hero: { title: '', subtitle: '', ctaText: '' },
    services: [],
    contact: { email: '' },
    footer: { text: '' },
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadContent()
  }, [])

  const loadContent = async () => {
    try {
      const data = await getLandingContent()
      setContent(data)
    } catch (error) {
      console.error('Error loading content:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await updateLandingContent(content)
      alert('Content saved!')
    } catch (error) {
      console.error('Error saving content:', error)
      alert('Failed to save content')
    } finally {
      setSaving(false)
    }
  }

  const addService = () => {
    setContent({
      ...content,
      services: [
        ...content.services,
        { id: Date.now().toString(), title: '', description: '' },
      ],
    })
  }

  const removeService = (id: string) => {
    setContent({
      ...content,
      services: content.services.filter(s => s.id !== id),
    })
  }

  const updateService = (id: string, field: string, value: string) => {
    setContent({
      ...content,
      services: content.services.map(s =>
        s.id === id ? { ...s, [field]: value } : s
      ),
    })
  }

  if (loading) {
    return <div className="text-center py-8">Loading content...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Landing Page Content</h2>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50"
        >
          <Save className="w-5 h-5 mr-2" />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Hero Section</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <input
                type="text"
                value={content.hero.title}
                onChange={(e) =>
                  setContent({
                    ...content,
                    hero: { ...content.hero, title: e.target.value },
                  })
                }
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Subtitle</label>
              <input
                type="text"
                value={content.hero.subtitle}
                onChange={(e) =>
                  setContent({
                    ...content,
                    hero: { ...content.hero, subtitle: e.target.value },
                  })
                }
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">CTA Button Text</label>
              <input
                type="text"
                value={content.hero.ctaText}
                onChange={(e) =>
                  setContent({
                    ...content,
                    hero: { ...content.hero, ctaText: e.target.value },
                  })
                }
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Services</h3>
            <button
              onClick={addService}
              className="inline-flex items-center px-3 py-1 bg-primary text-white rounded-lg hover:bg-primary/90 text-sm"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Service
            </button>
          </div>
          <div className="space-y-4">
            {content.services.map((service) => (
              <div
                key={service.id}
                className="p-4 border rounded-lg space-y-3"
              >
                <div>
                  <label className="block text-sm font-medium mb-2">Service Title</label>
                  <input
                    type="text"
                    value={service.title}
                    onChange={(e) =>
                      updateService(service.id, 'title', e.target.value)
                    }
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={service.description}
                    onChange={(e) =>
                      updateService(service.id, 'description', e.target.value)
                    }
                    rows={3}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <button
                  onClick={() => removeService(service.id)}
                  className="inline-flex items-center px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-sm"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={content.contact.email}
              onChange={(e) =>
                setContent({
                  ...content,
                  contact: { ...content.contact, email: e.target.value },
                })
              }
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Footer</h3>
          <div>
            <label className="block text-sm font-medium mb-2">Footer Text</label>
            <textarea
              value={content.footer.text}
              onChange={(e) =>
                setContent({
                  ...content,
                  footer: { ...content.footer, text: e.target.value },
                })
              }
              rows={3}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
        </div>
      </div>
    </div>
  )
}



