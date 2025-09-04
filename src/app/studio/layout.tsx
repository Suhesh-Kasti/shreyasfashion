import { Metadata } from 'next'
import { getBrandName } from '@/config/brand'

export const metadata: Metadata = {
  title: `${getBrandName()} Studio | Content Management`,
  description: `Manage ${getBrandName()} products and content`,
  robots: 'noindex',
}

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <div suppressHydrationWarning>
          {children}
        </div>
      </body>
    </html>
  )
}
