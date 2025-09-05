'use client'

import { useEffect } from 'react'
import { getBrandName } from '@/config/brand'

export default function StudioRedirectPage() {
  useEffect(() => {
    // Redirect to the actual studio URL
    const studioUrl = process.env.NODE_ENV === 'production' 
      ? 'https://shreyastudio.vercel.app' 
      : 'http://localhost:3333'
    
    window.location.href = studioUrl
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <div className="text-4xl mb-4">👗</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {getBrandName()} Studio
          </h1>
          <p className="text-gray-600">
            Redirecting to Content Management System...
          </p>
        </div>
        
        <div className="space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          
          <div className="text-sm text-gray-500">
            <p>If you&apos;re not redirected automatically,</p>
            <a 
              href={process.env.NODE_ENV === 'production' 
                ? 'https://shreyastudio.vercel.app' 
                : 'http://localhost:3333'
              }
              className="text-blue-600 hover:text-blue-800 underline"
            >
              click here to access the studio
            </a>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-400">
            Content Management System for {getBrandName()}
          </p>
        </div>
      </div>
    </div>
  )
}
