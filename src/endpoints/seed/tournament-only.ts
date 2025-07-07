import type { Payload, PayloadRequest } from 'payload'
import { seedTournament } from './tournament'

export const seedTournamentOnly = async ({
  payload,
  req,
}: {
  payload: Payload
  req: PayloadRequest
}): Promise<void> => {
  payload.logger.info('🏆 Seeding tournament data only...')
  
  // Only seed tournament data, skip the regular website content
  await seedTournament({ payload, req })
  
  payload.logger.info('🎉 Tournament-only seeding completed!')
}