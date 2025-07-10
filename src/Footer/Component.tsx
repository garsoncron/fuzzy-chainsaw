import { Footer as TournamentFooter } from '@/components/tournament/Footer'
import React from 'react'
import { unstable_cache } from 'next/cache'

import configPromise from '@payload-config'
import { getPayload } from 'payload'

const payload = await getPayload({ config: configPromise })

export async function Footer() {
  const footer = await unstable_cache(
    async () => {
      return await payload.findGlobal({
        slug: 'footer',
      })
    },
    ['footer'],
    {
      tags: ['footer'],
    },
  )()

  return <TournamentFooter footer={footer} />
}
