'use client'

/**
 * @description
 * Comprehensive footer component for the Cowtown Showdown tournament website.
 * Features a responsive multi-column layout with tournament info, quick links,
 * resources, and social media integration.
 *
 * @dependencies
 * - @radix-ui/react-accordion for mobile accordion sections
 * - lucide-react for consistent iconography
 * - @radix-ui/react-separator for visual dividers
 * - shadcn/ui components for styling consistency
 *
 * @notes
 * - Uses custom western theme colors defined in globals.css
 * - Responsive: 4 columns desktop, 2x2 tablet, accordion mobile
 * - Accessibility: proper ARIA labels and keyboard navigation
 * - Performance: optimized for 500-900 concurrent users
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
  Hand,
  Crown,
  Book,
  ContactRound,
  Newspaper,
  FolderOpen,
  Camera,
  Mic,
  Car,
  UtensilsCrossed,
  Accessibility,
  HelpCircle,
  Instagram,
  Twitter,
  Facebook,
  Youtube
} from 'lucide-react'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/utilities/ui'

interface FooterLink {
  label: string
  href: string
  icon: React.ReactNode
}

interface FooterSection {
  title: string
  links: FooterLink[]
}

const tournamentInfo = {
  dates: "July 12-14, 2025",
  location: "Calgary, Alberta",
  venue: "Scotiabank Saddledome",
  tagline: "Only the best come to the west"
}

const quickLinks: FooterSection[] = [
  {
    title: "Tournament",
    links: [
      { label: "Schedule", href: "/schedule", icon: <Calendar className="w-4 h-4" /> },
      { label: "Standings", href: "/standings", icon: <Trophy className="w-4 h-4" /> },
      { label: "Rules & Format", href: "/rules", icon: <FileText className="w-4 h-4" /> },
      { label: "Venue Information", href: "/venue", icon: <MapPin className="w-4 h-4" /> }
    ]
  },
  {
    title: "Teams",
    links: [
      { label: "All Teams", href: "/teams", icon: <Users className="w-4 h-4" /> },
      { label: "Rosters", href: "/rosters", icon: <Users className="w-4 h-4" /> },
      { label: "Statistics", href: "/stats", icon: <BarChart3 className="w-4 h-4" /> }
    ]
  },
  {
    title: "Contact",
    links: [
      { label: "Tournament Office", href: "/contact", icon: <Phone className="w-4 h-4" /> },
      { label: "Media Inquiries", href: "/media", icon: <Mail className="w-4 h-4" /> },
      { label: "Volunteer Information", href: "/volunteer", icon: <Hand className="w-4 h-4" /> }
    ]
  }
]

const resources: FooterSection[] = [
  {
    title: "For Teams",
    links: [
      { label: "Captain Resources", href: "/captain-resources", icon: <Crown className="w-4 h-4" /> },
      { label: "Game Sheets", href: "/game-sheets", icon: <FileText className="w-4 h-4" /> },
      { label: "Team Contacts", href: "/team-contacts", icon: <ContactRound className="w-4 h-4" /> },
      { label: "Tournament Handbook", href: "/handbook", icon: <Book className="w-4 h-4" /> }
    ]
  },
  {
    title: "For Media",
    links: [
      { label: "Press Releases", href: "/press", icon: <Newspaper className="w-4 h-4" /> },
      { label: "Media Kit", href: "/media-kit", icon: <FolderOpen className="w-4 h-4" /> },
      { label: "Photo Gallery", href: "/photos", icon: <Camera className="w-4 h-4" /> },
      { label: "Interview Requests", href: "/interviews", icon: <Mic className="w-4 h-4" /> }
    ]
  },
  {
    title: "For Fans",
    links: [
      { label: "Parking Information", href: "/parking", icon: <Car className="w-4 h-4" /> },
      { label: "Concessions", href: "/concessions", icon: <UtensilsCrossed className="w-4 h-4" /> },
      { label: "Accessibility", href: "/accessibility", icon: <Accessibility className="w-4 h-4" /> },
      { label: "FAQs", href: "/faq", icon: <HelpCircle className="w-4 h-4" /> }
    ]
  }
]

const socialLinks = [
  {
    platform: "Instagram",
    handle: "@cowtownshowdown",
    href: "https://instagram.com/cowtownshowdown",
    icon: <Instagram size={24} />
  },
  {
    platform: "Twitter/X",
    handle: "@cowtownlacrosse",
    href: "https://twitter.com/cowtownlacrosse",
    icon: <Twitter size={24} />
  },
  {
    platform: "Facebook",
    handle: "Cowtown Showdown",
    href: "https://facebook.com/cowtownshowdown",
    icon: <Facebook size={24} />
  },
  {
    platform: "YouTube",
    handle: "Cowtown Lacrosse",
    href: "https://youtube.com/cowtownlacrosse",
    icon: <Youtube size={24} />
  },
  {
    platform: "TikTok",
    handle: "@cowtownlax",
    href: "https://tiktok.com/@cowtownlax",
    icon: <div className="w-6 h-6 bg-current rounded-sm flex items-center justify-center text-xs font-bold">T</div>
  }
]

const SocialIcon: React.FC<{ platform: string; handle: string; href: string; icon: React.ReactNode }> = ({ 
  platform, 
  handle, 
  href, 
  icon 
}) => (
  <Link 
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="group flex items-center space-x-2 text-gray-300 hover:text-golden transition-colors duration-200"
    aria-label={`Follow us on ${platform}`}
  >
    <span className="text-gray-400 group-hover:text-golden transition-colors duration-200 grayscale group-hover:grayscale-0">
      {icon}
    </span>
    <span className="text-sm">{handle}</span>
  </Link>
)

const FooterLinkItem: React.FC<{ link: FooterLink }> = ({ link }) => (
  <Link 
    href={link.href}
    className="flex items-center space-x-2 text-gray-300 hover:text-golden transition-colors duration-200 py-1"
  >
    <span className="text-gray-400">{link.icon}</span>
    <span className="text-sm">{link.label}</span>
  </Link>
)

const FooterSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold text-golden">{title}</h3>
    <div className="space-y-2">
      {children}
    </div>
  </div>
)

const NewsletterSignup: React.FC = () => {
  const [email, setEmail] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)
  const [message, setMessage] = React.useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setMessage('Please enter a valid email address')
      setIsLoading(false)
      return
    }

    try {
      // TODO: Implement actual newsletter signup
      await new Promise(resolve => setTimeout(resolve, 1000))
      setMessage('Thank you for subscribing!')
      setEmail('')
    } catch (_error) {
      setMessage('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-golden">Stay Connected</h3>
      <form onSubmit={handleSubmit} className="space-y-2">
        <div>
          <Label htmlFor="newsletter-email" className="text-gray-300 text-sm">
            Get tournament updates
          </Label>
          <div className="flex mt-1">
            <Input
              id="newsletter-email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-dark-brown/50 border-golden/20 text-white placeholder-gray-400 focus:border-golden"
              required
            />
            <Button
              type="submit"
              disabled={isLoading}
              className="ml-2 bg-golden hover:bg-golden/90 text-dark-brown font-medium px-4"
            >
              {isLoading ? 'Subscribing...' : 'Subscribe'}
            </Button>
          </div>
        </div>
        {message && (
          <p className={cn(
            "text-sm",
            message.includes('Thank you') ? 'text-green-400' : 'text-red-400'
          )}>
            {message}
          </p>
        )}
      </form>
      <p className="text-xs text-gray-400">
        We respect your privacy. Unsubscribe at any time.
      </p>
    </div>
  )
}

const SponsorBanner: React.FC = () => (
  <div className="py-6 border-t border-golden/20">
    <div className="container mx-auto px-4">
      <h4 className="text-center text-golden font-semibold mb-4">Tournament Sponsors</h4>
      <div className="flex justify-center items-center space-x-8 opacity-70 hover:opacity-100 transition-opacity">
        {/* Placeholder sponsor logos */}
        <div className="w-24 h-12 bg-gray-600/50 rounded flex items-center justify-center">
          <span className="text-xs text-gray-400">Sponsor 1</span>
        </div>
        <div className="w-24 h-12 bg-gray-600/50 rounded flex items-center justify-center">
          <span className="text-xs text-gray-400">Sponsor 2</span>
        </div>
        <div className="w-24 h-12 bg-gray-600/50 rounded flex items-center justify-center">
          <span className="text-xs text-gray-400">Sponsor 3</span>
        </div>
        <div className="w-24 h-12 bg-gray-600/50 rounded flex items-center justify-center">
          <span className="text-xs text-gray-400">Sponsor 4</span>
        </div>
      </div>
    </div>
  </div>
)

export const Footer: React.FC = () => {
  return (
    <footer className="bg-dark-brown text-white mt-auto">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Desktop Layout - 4 columns */}
        <div className="hidden lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Column 1: Tournament Information */}
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="font-western text-2xl text-golden">
                Cowtown Showdown
              </h2>
              <div className="space-y-1 text-sm text-gray-300">
                <p>{tournamentInfo.dates}</p>
                <p>{tournamentInfo.location}</p>
                <p>{tournamentInfo.venue}</p>
              </div>
              <p className="text-golden italic text-sm font-medium">
                &ldquo;{tournamentInfo.tagline}&rdquo;
              </p>
            </div>
            <div className="w-16 h-16 bg-golden/20 rounded-full flex items-center justify-center">
              <Trophy className="w-8 h-8 text-golden" />
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-6">
            {quickLinks.map((section) => (
              <FooterSection key={section.title} title={section.title}>
                {section.links.map((link) => (
                  <FooterLinkItem key={link.label} link={link} />
                ))}
              </FooterSection>
            ))}
          </div>

          {/* Column 3: Resources */}
          <div className="space-y-6">
            {resources.map((section) => (
              <FooterSection key={section.title} title={section.title}>
                {section.links.map((link) => (
                  <FooterLinkItem key={link.label} link={link} />
                ))}
              </FooterSection>
            ))}
          </div>

          {/* Column 4: Connect & Follow */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-golden">Follow Us</h3>
              <div className="space-y-3">
                {socialLinks.map((social) => (
                  <SocialIcon key={social.platform} {...social} />
                ))}
              </div>
            </div>
            <Separator className="bg-golden/20" />
            <NewsletterSignup />
          </div>
        </div>

        {/* Tablet Layout - 2x2 grid */}
        <div className="hidden md:grid md:grid-cols-2 md:gap-8 lg:hidden">
          {/* Row 1, Col 1: Tournament Info */}
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="font-western text-2xl text-golden">
                Cowtown Showdown
              </h2>
              <div className="space-y-1 text-sm text-gray-300">
                <p>{tournamentInfo.dates}</p>
                <p>{tournamentInfo.location}</p>
                <p>{tournamentInfo.venue}</p>
              </div>
              <p className="text-golden italic text-sm font-medium">
                &ldquo;{tournamentInfo.tagline}&rdquo;
              </p>
            </div>
            <div className="w-16 h-16 bg-golden/20 rounded-full flex items-center justify-center">
              <Trophy className="w-8 h-8 text-golden" />
            </div>
          </div>

          {/* Row 1, Col 2: Quick Links */}
          <div className="space-y-6">
            {quickLinks.map((section) => (
              <FooterSection key={section.title} title={section.title}>
                {section.links.map((link) => (
                  <FooterLinkItem key={link.label} link={link} />
                ))}
              </FooterSection>
            ))}
          </div>

          {/* Row 2, Col 1: Social */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-golden">Follow Us</h3>
              <div className="space-y-3">
                {socialLinks.map((social) => (
                  <SocialIcon key={social.platform} {...social} />
                ))}
              </div>
            </div>
            <Separator className="bg-golden/20" />
            <NewsletterSignup />
          </div>

          {/* Row 2, Col 2: Resources */}
          <div className="space-y-6">
            {resources.map((section) => (
              <FooterSection key={section.title} title={section.title}>
                {section.links.map((link) => (
                  <FooterLinkItem key={link.label} link={link} />
                ))}
              </FooterSection>
            ))}
          </div>
        </div>

        {/* Mobile Layout - Accordion */}
        <div className="md:hidden">
          {/* Tournament Info - Always visible */}
          <div className="space-y-6 mb-8">
            <div className="space-y-2">
              <h2 className="font-western text-2xl text-golden">
                Cowtown Showdown
              </h2>
              <div className="space-y-1 text-sm text-gray-300">
                <p>{tournamentInfo.dates}</p>
                <p>{tournamentInfo.location}</p>
                <p>{tournamentInfo.venue}</p>
              </div>
              <p className="text-golden italic text-sm font-medium">
                &ldquo;{tournamentInfo.tagline}&rdquo;
              </p>
            </div>
            <div className="w-16 h-16 bg-golden/20 rounded-full flex items-center justify-center">
              <Trophy className="w-8 h-8 text-golden" />
            </div>
          </div>

          {/* Accordion Sections */}
          <Accordion type="multiple" className="space-y-2">
            {/* Quick Links */}
            <AccordionItem value="quick-links" className="border-golden/20">
              <AccordionTrigger className="text-golden hover:text-golden/90">
                Quick Links
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-6">
                  {quickLinks.map((section) => (
                    <FooterSection key={section.title} title={section.title}>
                      {section.links.map((link) => (
                        <FooterLinkItem key={link.label} link={link} />
                      ))}
                    </FooterSection>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Social & Newsletter */}
            <AccordionItem value="social" className="border-golden/20">
              <AccordionTrigger className="text-golden hover:text-golden/90">
                Connect & Follow
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-golden">Follow Us</h3>
                    <div className="grid grid-cols-1 gap-3">
                      {socialLinks.map((social) => (
                        <SocialIcon key={social.platform} {...social} />
                      ))}
                    </div>
                  </div>
                  <Separator className="bg-golden/20" />
                  <NewsletterSignup />
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Resources */}
            <AccordionItem value="resources" className="border-golden/20">
              <AccordionTrigger className="text-golden hover:text-golden/90">
                Resources
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-6">
                  {resources.map((section) => (
                    <FooterSection key={section.title} title={section.title}>
                      {section.links.map((link) => (
                        <FooterLinkItem key={link.label} link={link} />
                      ))}
                    </FooterSection>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      {/* Sponsor Banner */}
      <SponsorBanner />

      {/* Footer Bottom */}
      <div className="border-t border-golden/20 bg-dark-brown/50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-sm text-gray-400">
                © 2025 Cowtown Showdown. All rights reserved.
              </p>
            </div>
            <div className="flex flex-wrap justify-center md:justify-end space-x-6 text-sm">
              <Link href="/privacy" className="text-gray-400 hover:text-golden transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-golden transition-colors">
                Terms of Service
              </Link>
              <Link href="/conduct" className="text-gray-400 hover:text-golden transition-colors">
                Code of Conduct
              </Link>
            </div>
          </div>
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              Tournament management by <span className="text-golden">Cowtown Lacrosse Systems</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}