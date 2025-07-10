import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

import type { HeroBannerBlock as SuperheroBannerBlockProps } from '@/payload-types'
import type { Media } from '@/payload-types'

import { cn } from '@/utilities/cn'
import { resolveLinkUrl } from '@/utilities/resolveLinkUrl'

type Props = {
  className?: string
  disableInnerContainer?: boolean
} & SuperheroBannerBlockProps

/**
 * @description
 * SuperheroBanner block component featuring a full-screen hero section with Cowtown Showdown branding.
 * Includes customizable background image, announcement badge, heading, subheading, and dual CTA buttons.
 * Maintains western/Calgary Stampede theme with warm browns and golden accents.
 *
 * @dependencies Next.js Image, Lucide React icons, resolveLinkUrl utility
 * @accessibility Full ARIA labeling, semantic HTML structure, keyboard navigation
 * @performance Optimized images with Next.js Image component
 */
export const SuperheroBannerBlock: React.FC<Props> = ({
  className,
  disableInnerContainer,
  backgroundImage,
  announcementBadge,
  heading,
  subheading,
  primaryCTA,
  secondaryCTA,
  enableGradientOverlay = true,
}) => {
  const backgroundImageUrl =
    backgroundImage && typeof backgroundImage === 'object' ? (backgroundImage as Media).url : null

  return (
    <div className={cn('min-h-screen', className)}>
      <div className="relative isolate overflow-hidden pt-14 min-h-screen">
        {/* Background Image */}
        <Image
          alt=""
          src={backgroundImageUrl || '/media/swalm-lax.jpg'}
          fill
          className="absolute inset-0 size-full object-cover"
          priority
          sizes="100vw"
        />

        {/* Dark overlay for better contrast */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Custom Orange to Red to Brown Gradient Overlay from top-left to bottom-right */}
        {enableGradientOverlay && (
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(135deg, rgba(251, 146, 60, 0.5) 0%, rgba(239, 68, 68, 0.4) 35%, rgba(220, 38, 38, 0.4) 65%, rgba(120, 53, 15, 0.5) 100%)',
            }}
          />
        )}

        {/* Content */}
        <div
          className={cn(
            'relative z-10 mx-auto max-w-7xl px-6 lg:px-8 min-h-screen flex items-center',
            !disableInnerContainer && 'container',
          )}
        >
          <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56 w-full">
            {/* Announcement Badge */}
            {announcementBadge?.text && (
              <div className="hidden sm:mb-8 sm:flex sm:justify-center">
                <div className="relative rounded-full px-3 py-1 text-sm/6 text-white ring-1 ring-white/10 hover:ring-white/20">
                  {announcementBadge.text}
                  {announcementBadge.linkText && announcementBadge.linkUrl && (
                    <>
                      {' '}
                      <Link
                        href={announcementBadge.linkUrl}
                        className="font-semibold text-white hover:text-gray-200"
                      >
                        <span aria-hidden="true" className="absolute inset-0" />
                        {announcementBadge.linkText}
                        <span aria-hidden="true">&rarr;</span>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Main Content */}
            <div className="text-center">
              <h1 className="text-balance text-5xl font-semibold tracking-tight text-white sm:text-7xl font-western">
                {heading}
              </h1>
              <p className="mt-8 text-pretty text-lg font-medium text-white/90 sm:text-xl/8">
                {subheading}
              </p>

              {/* CTA Buttons */}
              <div className="mt-10 flex items-center justify-center gap-x-6">
                {/* Primary CTA */}
                {primaryCTA?.text && (
                  <Link
                    href={resolveLinkUrl(primaryCTA) || '#'}
                    className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-red-600 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    {...(primaryCTA.newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  >
                    {primaryCTA.text}
                  </Link>
                )}

                {/* Secondary CTA */}
                {secondaryCTA?.text && (
                  <Link
                    href={resolveLinkUrl(secondaryCTA) || '#'}
                    className="text-sm/6 font-semibold text-white"
                    {...(secondaryCTA.newTab
                      ? { target: '_blank', rel: 'noopener noreferrer' }
                      : {})}
                  >
                    {secondaryCTA.text}
                    <span aria-hidden="true">→</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
