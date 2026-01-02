'use client'

import { useEffect, useState } from 'react'
import { getSEOConfig, updateSEOConfig } from '@/app/actions/seo'
import { SEOConfig } from '@/lib/types/seo'
import { Save } from 'lucide-react'

export default function SEOManager() {
  const [config, setConfig] = useState<SEOConfig>({
    title: '',
    description: '',
    ogImage: '',
    canonicalUrl: '',
    structuredData: {},
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadConfig()
  }, [])

  const loadConfig = async () => {
    try {
      const data = await getSEOConfig()
      setConfig(data)
    } catch (error) {
      console.error('Error loading SEO config:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await updateSEOConfig(config)
      alert('SEO configuration saved!')
    } catch (error) {
      console.error('Error saving SEO config:', error)
      alert('Failed to save configuration')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading SEO configuration...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">SEO Configuration</h2>
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
          <label className="block text-sm font-medium mb-2">Page Title</label>
          <input
            type="text"
            value={config.title}
            onChange={(e) => setConfig({ ...config, title: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="Your Site Title"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Meta Description</label>
          <textarea
            value={config.description}
            onChange={(e) => setConfig({ ...config, description: e.target.value })}
            rows={3}
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="A brief description of your site"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">OG Image URL</label>
          <input
            type="url"
            value={config.ogImage || ''}
            onChange={(e) => setConfig({ ...config, ogImage: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Canonical URL</label>
          <input
            type="url"
            value={config.canonicalUrl || ''}
            onChange={(e) => setConfig({ ...config, canonicalUrl: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="https://example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Structured Data (JSON-LD)</label>
          <textarea
            value={JSON.stringify(config.structuredData || {}, null, 2)}
            onChange={(e) => {
              try {
                const parsed = JSON.parse(e.target.value)
                setConfig({ ...config, structuredData: parsed })
              } catch {
                // Invalid JSON, ignore
              }
            }}
            rows={10}
            className="w-full px-4 py-2 border rounded-lg font-mono text-sm"
            placeholder='{"@context": "https://schema.org", ...}'
          />
        </div>
      </div>
    </div>
  )
}



