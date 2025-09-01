import React from "react"
import type { Metadata } from "next"
import "./globals.css"

// 1. Import your provider
import { MiniKitContextProvider } from "@/providers/MiniKitProvider"

// Use only generateMetadata (merge static + dynamic here)
export async function generateMetadata(): Promise<Metadata> {
  const URL = process.env.NEXT_PUBLIC_URL as string

  return {
    title: process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME || "EaseCrypt - Buy Crypto Easily",
    description: "Purchase cryptocurrency with fiat currency. No account needed.",
    generator: "v0.app",
    other: {
      "fc:frame": JSON.stringify({
        version: "next",
        imageUrl: process.env.NEXT_PUBLIC_APP_HERO_IMAGE,
        button: {
          title: `Launch ${process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME || "EaseCrypt"}`,
          action: {
            type: "launch_frame",
            name: process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME || "EaseCrypt",
            url: URL,
            splashImageUrl: process.env.NEXT_PUBLIC_SPLASH_IMAGE,
            splashBackgroundColor: process.env.NEXT_PUBLIC_SPLASH_BACKGROUND_COLOR,
          },
        },
      }),
    },
  }
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
        {/* Wrap everything in MiniKit */}
        <MiniKitContextProvider>
          {children}
        </MiniKitContextProvider>
      </body>
    </html>
  )
}

