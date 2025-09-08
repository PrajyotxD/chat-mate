import type { Metadata } from 'next'
import { Roboto } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/lib/auth-context'
import { Toaster } from '@/components/ui/toaster'
import { Analytics } from '@vercel/analytics/react'
import Script from 'next/script'

const roboto = Roboto({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
})

export const metadata: Metadata = {
  title: 'Oryo - Your Personal AI Assistant',
  description: 'Your Personal AI, Powered by Your API Key. Chat with multiple AI providers securely.',
  keywords: 'AI, chatbot, OpenAI, Groq, Anthropic, Gemini, personal assistant',
  authors: [{ name: 'Oryo Team' }],
  openGraph: {
    title: 'Oryo - Your Personal AI Assistant',
    description: 'Your Personal AI, Powered by Your API Key',
    url: 'https://oryo.vercel.app',
    siteName: 'Oryo',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Oryo - Your Personal AI Assistant',
    description: 'Your Personal AI, Powered by Your API Key',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* Google Analytics */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
          `}
        </Script>
      </head>
      <body className={roboto.className}>
        <AuthProvider>
          {children}
          <Toaster />
          <Analytics />
        </AuthProvider>
      </body>
    </html>
  )
}
