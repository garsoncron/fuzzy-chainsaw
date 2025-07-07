import React from 'react'
import type { TournamentInfoBlock } from '@/payload-types'

interface TournamentInfoProps {
  block: TournamentInfoBlock
}

const IconComponent = ({ icon }: { icon: string }) => {
  const iconProps = {
    className: 'w-8 h-8 text-amber-600',
    strokeWidth: 2,
    fill: 'none',
    stroke: 'currentColor',
    viewBox: '0 0 24 24',
  }

  switch (icon) {
    case 'trophy':
      return (
        <svg {...iconProps}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.871m0 0L9 15H4.5A2.25 2.25 0 012.25 12.75V6A2.25 2.25 0 014.5 3.75h15A2.25 2.25 0 0121.75 6v6.75A2.25 2.25 0 0119.5 15h-4.5z" />
        </svg>
      )
    case 'calendar':
      return (
        <svg {...iconProps}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
        </svg>
      )
    case 'users':
      return (
        <svg {...iconProps}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
        </svg>
      )
    case 'mapPin':
      return (
        <svg {...iconProps}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
        </svg>
      )
    case 'clock':
      return (
        <svg {...iconProps}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    case 'star':
      return (
        <svg {...iconProps}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
        </svg>
      )
    default:
      return (
        <svg {...iconProps}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
  }
}

export function TournamentInfo({ block }: TournamentInfoProps) {
  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-amber-900 mb-4">
              {block.title}
            </h2>
            <p className="text-lg text-amber-700 max-w-2xl mx-auto leading-relaxed">
              {block.description}
            </p>
          </div>

          {/* Statistics */}
          {block.stats && block.stats.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
              {block.stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl font-bold text-amber-900 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-amber-700 font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Highlights */}
          {block.highlights && block.highlights.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {block.highlights.map((highlight, index) => (
                <div key={index} className="bg-white rounded-lg shadow-lg p-6 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center">
                      <IconComponent icon={highlight.icon} />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-amber-900 mb-3">
                    {highlight.title}
                  </h3>
                  <p className="text-amber-700 leading-relaxed">
                    {highlight.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}