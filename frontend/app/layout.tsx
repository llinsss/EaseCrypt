import React from "react"
import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "EaseCrypt - Buy Crypto Easily",
  description: "Purchase cryptocurrency with fiat currency. No account needed.",
  generator: "v0.app",
}

type LayoutProps = {
  children: React.ReactNode
  params?: Record<string, string | string[]>
  searchParams?: Record<string, string | string[] | undefined>
}

export default function RootLayout({
  children,
  params,
  searchParams,
  ...rest
}: LayoutProps) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
