'use client'

/**
 * @description
 * Simplified footer component for the Cowtown Showdown tournament website.
 * Features a clean layout with logo, navigation columns, and social media integration.
 *
 * @dependencies
 * - lucide-react for consistent iconography
 * - shadcn/ui components for styling consistency
 * - RichText component for rendering CMS richText content
 *
 * @notes
 * - Uses custom western theme colors defined in globals.css
 * - Responsive design with mobile-first approach
 * - Accessibility: proper ARIA labels and keyboard navigation
 * - Performance: optimized for 500-900 concurrent users
 * - Land acknowledgment content comes from CMS footer data
 */

import React from 'react'
import Link from 'next/link'
import {
  Calendar,
  Trophy,
  FileText,
  MapPin,
  Users,
  BarChart3,
  Phone,
  Mail,
  Instagram,
  Twitter,
  Facebook,
  Youtube,
} from 'lucide-react'

import { cn } from '@/utilities/ui'
import RichText from '@/components/RichText'
import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'

interface FooterLink {
  label: string
  href: string
}

interface FooterSection {
  title: string
  links: FooterLink[]
}

interface FooterProps {
  footer?: {
    landAcknowledgment?: {
      enabled?: boolean
      text?: DefaultTypedEditorState
    }
    navItems?: Array<{
      link: {
        type: 'reference' | 'custom'
        label: string
        url?: string
        reference?: {
          value: string
          relationTo: string
        }
      }
    }>
  }
}

// Simplified navigation structure based on screenshot
const navigationSections: FooterSection[] = [
  {
    title: 'Tournament',
    links: [
      { label: 'Schedule', href: '/schedule' },
      { label: 'Standings', href: '/standings' },
      { label: 'Teams', href: '/teams' },
      { label: 'Venue', href: '/venue' },
    ],
  },
  {
    title: 'Information',
    links: [
      { label: 'Rules', href: '/rules' },
      { label: 'Statistics', href: '/stats' },
      { label: 'Contact', href: '/contact' },
      { label: 'Media', href: '/media' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Teams', href: '/teams' },
      { label: 'Rosters', href: '/rosters' },
      { label: 'Live Stream', href: '/live' },
      { label: 'Photos', href: '/photos' },
    ],
  },
]

const socialLinks = [
  {
    platform: 'Instagram',
    href: 'https://instagram.com/cowtownshowdown',
    icon: <Instagram size={20} />,
  },
  {
    platform: 'Twitter/X',
    href: 'https://twitter.com/cowtownlacrosse',
    icon: <Twitter size={20} />,
  },
  {
    platform: 'Facebook',
    href: 'https://facebook.com/cowtownshowdown',
    icon: <Facebook size={20} />,
  },
  {
    platform: 'YouTube',
    href: 'https://youtube.com/cowtownlacrosse',
    icon: <Youtube size={20} />,
  },
]

const SocialIcon: React.FC<{ platform: string; href: string; icon: React.ReactNode }> = ({
  platform,
  href,
  icon,
}) => (
  <Link
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="text-gray-300 hover:text-white transition-colors duration-200"
    aria-label={`Follow us on ${platform}`}
  >
    {icon}
  </Link>
)

const FooterLinkItem: React.FC<{ link: FooterLink }> = ({ link }) => (
  <Link
    href={link.href}
    className="text-gray-300 hover:text-white transition-colors duration-200 text-sm block py-1"
  >
    {link.label}
  </Link>
)

const FooterSection: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <div className="space-y-3">
    <h3 className="text-white font-semibold">{title}</h3>
    <div className="space-y-1">{children}</div>
  </div>
)

const LandAcknowledgment: React.FC<{ content?: DefaultTypedEditorState; enabled?: boolean }> = ({
  content,
  enabled = true,
}) => {
  if (!enabled || !content) return null

  return (
    <div className="bg-[#D6AC4D] text-white py-4">
      <div className="container mx-auto px-4">
        <div className="text-sm leading-relaxed">
          <RichText
            data={content}
            enableGutter={false}
            enableProse={false}
            className="[&_p]:m-0 [&_*]:text-white"
          />
        </div>
      </div>
    </div>
  )
}

const CowtownLogo: React.FC = () => (
  <div className="text-white">
    <div className="font-western text-2xl font-bold">COWTOWN</div>
    <div className="text-sm text-gray-300 tracking-wide">SHOWDOWN</div>
  </div>
)

export const Footer: React.FC<FooterProps> = ({ footer }) => {
  return (
    <>
      {/* Land Acknowledgment */}
      <LandAcknowledgment
        content={footer?.landAcknowledgment?.text}
        enabled={footer?.landAcknowledgment?.enabled}
      />

      {/* Main Footer */}
      <footer className="bg-[#1e293b] text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Logo Section */}
            <div className="md:col-span-1">
              <CowtownLogo />
            </div>

            {/* Navigation Sections */}
            {navigationSections.map((section) => (
              <FooterSection key={section.title} title={section.title}>
                {section.links.map((link) => (
                  <FooterLinkItem key={link.label} link={link} />
                ))}
              </FooterSection>
            ))}
          </div>

          {/* Social Media Links */}
          <div className="mt-8 pt-8 border-t border-gray-600 flex justify-center space-x-6">
            {socialLinks.map((social) => (
              <SocialIcon key={social.platform} {...social} />
            ))}
          </div>

          {/* Copyright */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-400">© 2025 Cowtown Showdown. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  )
}
