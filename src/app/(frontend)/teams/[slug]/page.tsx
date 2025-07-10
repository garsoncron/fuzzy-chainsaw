import type { Metadata } from 'next'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { notFound } from 'next/navigation'
import { TeamProfilePage } from '@/components/tournament/TeamProfilePage'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const teams = await payload.find({
    collection: 'teams',
    limit: 8,
    select: {
      slug: true,
    },
  })

  return teams.docs.map(({ slug }) => ({
    slug,
  }))
}

type Args = {
  params: Promise<{
    slug: string
  }>
}

export default async function TeamProfilePageRoute({ params: paramsPromise }: Args) {
  const { slug } = await paramsPromise
  const payload = await getPayload({ config: configPromise })

  const teamsResult = await payload.find({
    collection: 'teams',
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
  })

  if (!teamsResult.docs.length) {
    notFound()
  }

  const team = teamsResult.docs[0]

  const playersResult = await payload.find({
    collection: 'players',
    where: {
      team: {
        equals: team.id,
      },
    },
    sort: ['jerseyNumber'],
    depth: 1,
  })

  const gamesResult = await payload.find({
    collection: 'games',
    where: {
      or: [
        {
          homeTeam: {
            equals: team.id,
          },
        },
        {
          awayTeam: {
            equals: team.id,
          },
        },
      ],
    },
    sort: 'scheduledTime',
    depth: 1,
  })

  return <TeamProfilePage team={team} players={playersResult.docs} games={gamesResult.docs} />
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug } = await paramsPromise
  const payload = await getPayload({ config: configPromise })

  const teamsResult = await payload.find({
    collection: 'teams',
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
  })

  if (!teamsResult.docs.length) {
    return {
      title: 'Team Not Found - Cowtown Showdown',
      description: 'The requested team could not be found.',
    }
  }

  const team = teamsResult.docs[0]

  return {
    title: `${team.name} - Cowtown Showdown`,
    description: `Team profile for ${team.name}. View roster, schedule, and team information for the Cowtown Showdown tournament.`,
    keywords: [`${team.name}`, 'team profile', 'tournament roster', 'Cowtown Showdown'],
  }
}