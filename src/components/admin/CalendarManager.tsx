'use client'

import { useEffect, useState } from 'react'
import { getCalendarConfig, updateCalendarConfig } from '@/app/actions/calendar'
import { CalendarConfig } from '@/app/actions/calendar'
import { Save, Plus, Trash2 } from 'lucide-react'

const daysOfWeek = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
]

export default function CalendarManager() {
  const [config, setConfig] = useState<CalendarConfig>({
    blackoutDates: [],
    hoursOfOperation: {},
    specialAvailability: [],
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [newBlackoutDate, setNewBlackoutDate] = useState('')

  useEffect(() => {
    loadConfig()
  }, [])

  const loadConfig = async () => {
    try {
      const data = await getCalendarConfig()
      setConfig(data)
    } catch (error) {
      console.error('Error loading calendar config:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await updateCalendarConfig(config)
      alert('Calendar configuration saved!')
    } catch (error) {
      console.error('Error saving calendar config:', error)
      alert('Failed to save configuration')
    } finally {
      setSaving(false)
    }
  }

  const addBlackoutDate = () => {
    if (newBlackoutDate && !config.blackoutDates.includes(newBlackoutDate)) {
      setConfig({
        ...config,
        blackoutDates: [...config.blackoutDates, newBlackoutDate],
      })
      setNewBlackoutDate('')
    }
  }

  const removeBlackoutDate = (date: string) => {
    setConfig({
      ...config,
      blackoutDates: config.blackoutDates.filter(d => d !== date),
    })
  }

  const updateHours = (day: string, field: string, value: string | boolean) => {
    setConfig({
      ...config,
      hoursOfOperation: {
        ...config.hoursOfOperation,
        [day]: {
          ...config.hoursOfOperation[day],
          [field]: value,
        },
      },
    })
  }

  if (loading) {
    return <div className="text-center py-8">Loading calendar configuration...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Calendar & Scheduling</h2>
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
          <h3 className="text-lg font-semibold mb-4">Hours of Operation</h3>
          <div className="space-y-3">
            {daysOfWeek.map((day) => (
              <div key={day} className="flex items-center gap-4">
                <div className="w-24 capitalize">{day}</div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={config.hoursOfOperation[day]?.closed || false}
                    onChange={(e) => updateHours(day, 'closed', e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm">Closed</span>
                </label>
                {!config.hoursOfOperation[day]?.closed && (
                  <>
                    <input
                      type="time"
                      value={config.hoursOfOperation[day]?.open || '09:00'}
                      onChange={(e) => updateHours(day, 'open', e.target.value)}
                      className="px-3 py-1 border rounded-lg"
                    />
                    <span>to</span>
                    <input
                      type="time"
                      value={config.hoursOfOperation[day]?.close || '17:00'}
                      onChange={(e) => updateHours(day, 'close', e.target.value)}
                      className="px-3 py-1 border rounded-lg"
                    />
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Blackout Dates</h3>
          <div className="flex gap-2 mb-4">
            <input
              type="date"
              value={newBlackoutDate}
              onChange={(e) => setNewBlackoutDate(e.target.value)}
              className="px-4 py-2 border rounded-lg"
            />
            <button
              onClick={addBlackoutDate}
              className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add
            </button>
          </div>
          <div className="space-y-2">
            {config.blackoutDates.map((date) => (
              <div
                key={date}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <span>{new Date(date).toLocaleDateString()}</span>
                <button
                  onClick={() => removeBlackoutDate(date)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}



