'use client'

import { useEffect, useState } from 'react'
import { testSanityConnection } from '../../../lib/sanity'

export default function SanityDebug() {
  const [connectionStatus, setConnectionStatus] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const result = await testSanityConnection()
        setConnectionStatus(result)
      } catch (error) {
        setConnectionStatus({ success: false, error: 'Connection test failed' })
      } finally {
        setLoading(false)
      }
    }

    checkConnection()
  }, [])

  if (loading) {
    return (
      <div className="fixed bottom-4 right-4 bg-blue-100 border border-blue-300 rounded-lg p-4 shadow-lg">
        <p className="text-blue-800">Testing Sanity connection...</p>
      </div>
    )
  }

  return (
    <div className={`fixed bottom-4 right-4 border rounded-lg p-4 shadow-lg ${
      connectionStatus?.success 
        ? 'bg-green-100 border-green-300' 
        : 'bg-red-100 border-red-300'
    }`}>
      <div className="flex items-center space-x-2">
        <div className={`w-3 h-3 rounded-full ${
          connectionStatus?.success ? 'bg-green-500' : 'bg-red-500'
        }`}></div>
        <span className={`font-medium ${
          connectionStatus?.success ? 'text-green-800' : 'text-red-800'
        }`}>
          Sanity: {connectionStatus?.success ? 'Connected' : 'Error'}
        </span>
      </div>
      {connectionStatus?.error && (
        <p className="text-red-600 text-sm mt-1">
          {connectionStatus.error}
        </p>
      )}
      {connectionStatus?.data && (
        <p className="text-green-600 text-sm mt-1">
          Found {connectionStatus.data.length} products
        </p>
      )}
    </div>
  )
}
