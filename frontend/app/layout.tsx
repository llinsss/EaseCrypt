import React from "react"
import type { Metadata } from "next"
import "./globals.css"

// 1. Import your provider
import { MiniKitContextProvider } from "@/providers/MiniKitProvider"

// Helper to ensure URLs are absolute
function toAbsolute(url: string | undefined, base: string) {
  if (!url) return undefined
  if (url.startsWith("http://") || url.startsWith("https://")) return url
  const needsSlash = url.startsWith("/") ? "" : "/"
  return `${base}${needsSlash}${url}`
}

// Use only generateMetadata (merge static + dynamic here)
export async function generateMetadata(): Promise<Metadata> {
  const URL = process.env.NEXT_PUBLIC_URL as string
  const name = process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME || "EaseCrypt"
  const hero = toAbsolute(process.env.NEXT_PUBLIC_APP_HERO_IMAGE, URL)
  const splash = toAbsolute(process.env.NEXT_PUBLIC_SPLASH_IMAGE, URL)
  const splashBg = process.env.NEXT_PUBLIC_SPLASH_BACKGROUND_COLOR || "#101010"

  return {
    title: name,
    description: "Purchase cryptocurrency with fiat currency. No account needed.",
    generator: "v0.app",
    other: {
      "fc:frame": JSON.stringify({
        version: "next",
        imageUrl: hero,
        button: {
          title: `Launch ${name}`,
          action: {
            type: "launch_frame",
            name,
            url: URL,
            splashImageUrl: splash,
            splashBackgroundColor: splashBg,
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
