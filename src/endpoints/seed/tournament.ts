import type { Payload, PayloadRequest } from 'payload'

// Tournament team data with Calgary-inspired team names
const tournamentTeams = [
  {
    name: 'Calgary Mustangs',
    slug: 'calgary-mustangs',
    city: 'Calgary',
    province: 'Alberta',
    primaryColor: '#8B4513',
    secondaryColor: '#DAA520',
    captain: {
      name: 'Jake Thompson',
      email: 'jake.thompson@example.com',
      phone: '403-555-0101',
    },
  },
  {
    name: 'Edmonton Stallions',
    slug: 'edmonton-stallions',
    city: 'Edmonton',
    province: 'Alberta',
    primaryColor: '#2E4057',
    secondaryColor: '#FF6B35',
    captain: {
      name: 'Mike Rodriguez',
      email: 'mike.rodriguez@example.com',
      phone: '780-555-0102',
    },
  },
  {
    name: 'Vancouver Broncos',
    slug: 'vancouver-broncos',
    city: 'Vancouver',
    province: 'British Columbia',
    primaryColor: '#1B4332',
    secondaryColor: '#95D5B2',
    captain: {
      name: 'David Chen',
      email: 'david.chen@example.com',
      phone: '604-555-0103',
    },
  },
  {
    name: 'Toronto Outlaws',
    slug: 'toronto-outlaws',
    city: 'Toronto',
    province: 'Ontario',
    primaryColor: '#800020',
    secondaryColor: '#FFD700',
    captain: {
      name: 'Alex Johnson',
      email: 'alex.johnson@example.com',
      phone: '416-555-0104',
    },
  },
  {
    name: 'Montreal Mavricks',
    slug: 'montreal-mavricks',
    city: 'Montreal',
    province: 'Quebec',
    primaryColor: '#4A148C',
    secondaryColor: '#E1BEE7',
    captain: {
      name: 'Jean-Pierre Dubois',
      email: 'jp.dubois@example.com',
      phone: '514-555-0105',
    },
  },
  {
    name: 'Winnipeg Rangers',
    slug: 'winnipeg-rangers',
    city: 'Winnipeg',
    province: 'Manitoba',
    primaryColor: '#0D47A1',
    secondaryColor: '#90CAF9',
    captain: {
      name: 'Connor O\'Brien',
      email: 'connor.obrien@example.com',
      phone: '204-555-0106',
    },
  },
  {
    name: 'Halifax Hurricanes',
    slug: 'halifax-hurricanes',
    city: 'Halifax',
    province: 'Nova Scotia',
    primaryColor: '#B71C1C',
    secondaryColor: '#FFCDD2',
    captain: {
      name: 'Sean MacKenzie',
      email: 'sean.mackenzie@example.com',
      phone: '902-555-0107',
    },
  },
  {
    name: 'Saskatchewan Roughriders',
    slug: 'saskatchewan-roughriders',
    city: 'Saskatoon',
    province: 'Saskatchewan',
    primaryColor: '#2E7D32',
    secondaryColor: '#A5D6A7',
    captain: {
      name: 'Tyler Anderson',
      email: 'tyler.anderson@example.com',
      phone: '306-555-0108',
    },
  },
]

// Player names for generating realistic rosters
const playerNames = {
  first: [
    'Jake', 'Mike', 'David', 'Alex', 'Connor', 'Tyler', 'Sean', 'Ryan', 'Matt', 'Josh',
    'Kyle', 'Brad', 'Nick', 'Chris', 'Adam', 'Ben', 'Luke', 'Jordan', 'Zach', 'Derek',
    'Trevor', 'Brandon', 'Justin', 'Scott', 'Mark', 'Steve', 'Dan', 'Kevin', 'Jason', 'Eric',
    'Andrew', 'Nathan', 'Cody', 'Mason', 'Hunter', 'Caleb', 'Owen', 'Ethan', 'Cole', 'Blake',
  ],
  last: [
    'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
    'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
    'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson',
    'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores',
  ],
}

const positions = ['offence', 'defence', 'transition', 'faceoff', 'goalie'] as const
const handedness = ['left', 'right'] as const

// Generate a random name
function generatePlayerName(): { firstName: string; lastName: string } {
  const firstName = playerNames.first[Math.floor(Math.random() * playerNames.first.length)]
  const lastName = playerNames.last[Math.floor(Math.random() * playerNames.last.length)]
  return { firstName, lastName }
}

// Generate game schedule for 8 teams (pool play format)
function generateGameSchedule(teams: any[]): any[] {
  const games = []
  let gameNumber = 1
  
  // Pool play: each team plays every other team once (28 games total)
  // But we'll limit to 22 games as per tournament format
  const gamesToGenerate = 22
  
  // Generate pool play games
  for (let i = 0; i < teams.length && games.length < gamesToGenerate - 2; i++) {
    for (let j = i + 1; j < teams.length && games.length < gamesToGenerate - 2; j++) {
      if (games.length >= gamesToGenerate - 2) break
      
      const day = Math.floor(games.length / 8) + 1 // 8 games per day roughly
      const startTime = new Date('2024-07-05T09:00:00Z') // Tournament starts July 5th
      startTime.setDate(startTime.getDate() + (day - 1))
      startTime.setHours(9 + ((games.length % 8) * 1.5)) // Games every 1.5 hours
      
      games.push({
        gameNumber: gameNumber.toString(),
        gameType: 'pool',
        day: Math.min(day, 3),
        scheduledTime: startTime,
        status: 'scheduled',
        homeTeam: teams[i].id,
        awayTeam: teams[j].id,
        homeScore: 0,
        awayScore: 0,
        currentPeriod: 0,
        periodTimeRemaining: 0,
        gamePoints: { home: 0, away: 0 },
        periodPoints: {
          period1: { home: 0, away: 0 },
          period2: { home: 0, away: 0 },
          period3: { home: 0, away: 0 },
        },
        finalGamePoints: { home: 0, away: 0 },
        periodLength: 12,
        overtimeAllowed: false,
      })
      
      gameNumber++
    }
  }
  
  // Add medal games (final 2 games)
  const medalGame1Time = new Date('2024-07-07T16:00:00Z')
  const medalGame2Time = new Date('2024-07-07T18:00:00Z')
  
  games.push({
    gameNumber: (gamesToGenerate - 1).toString(),
    gameType: 'medal',
    day: 3,
    scheduledTime: medalGame1Time,
    status: 'scheduled',
    homeTeam: teams[0].id, // Will be determined by standings
    awayTeam: teams[1].id,
    homeScore: 0,
    awayScore: 0,
    currentPeriod: 0,
    periodTimeRemaining: 0,
    gamePoints: { home: 0, away: 0 },
    periodPoints: {
      period1: { home: 0, away: 0 },
      period2: { home: 0, away: 0 },
      period3: { home: 0, away: 0 },
    },
    finalGamePoints: { home: 0, away: 0 },
    periodLength: 15,
    overtimeAllowed: true,
  })
  
  games.push({
    gameNumber: gamesToGenerate.toString(),
    gameType: 'medal',
    day: 3,
    scheduledTime: medalGame2Time,
    status: 'scheduled',
    homeTeam: teams[2].id,
    awayTeam: teams[3].id,
    homeScore: 0,
    awayScore: 0,
    currentPeriod: 0,
    periodTimeRemaining: 0,
    gamePoints: { home: 0, away: 0 },
    periodPoints: {
      period1: { home: 0, away: 0 },
      period2: { home: 0, away: 0 },
      period3: { home: 0, away: 0 },
    },
    finalGamePoints: { home: 0, away: 0 },
    periodLength: 15,
    overtimeAllowed: true,
  })
  
  return games
}

export const seedTournament = async ({
  payload,
  req,
}: {
  payload: Payload
  req: PayloadRequest
}): Promise<void> => {
  payload.logger.info('🏆 Seeding tournament data...')
  
  // Clear existing tournament data
  payload.logger.info('— Clearing existing tournament data...')
  await Promise.all([
    payload.db.deleteMany({ collection: 'teams', req, where: {} }),
    payload.db.deleteMany({ collection: 'players', req, where: {} }),
    payload.db.deleteMany({ collection: 'games', req, where: {} }),
    payload.db.deleteMany({ collection: 'goals', req, where: {} }),
    payload.db.deleteMany({ collection: 'penalties', req, where: {} }),
    payload.db.deleteMany({ collection: 'shots', req, where: {} }),
    payload.db.deleteMany({ collection: 'faceoffs', req, where: {} }),
    payload.db.deleteMany({ collection: 'loose-balls', req, where: {} }),
  ])
  
  // Create teams
  payload.logger.info('— Creating teams...')
  const createdTeams = await Promise.all(
    tournamentTeams.map(async (teamData) => {
      return await payload.create({
        collection: 'teams',
        data: teamData,
        depth: 0,
        context: {
          disableRevalidate: true,
        },
      })
    })
  )
  
  // Create players for each team
  payload.logger.info('— Creating players...')
  const allPlayers = []
  
  for (const team of createdTeams) {
    const players = []
    
    // Create 2 goalies per team
    for (let i = 0; i < 2; i++) {
      const { firstName, lastName } = generatePlayerName()
      const player = await payload.create({
        collection: 'players',
        data: {
          firstName,
          lastName,
          jerseyNumber: i + 1, // Goalies get 1, 2
          team: team.id,
          primaryPosition: 'goalie',
          handedness: handedness[Math.floor(Math.random() * handedness.length)],
          playerType: 'goalie',
        },
        depth: 0,
        context: {
          disableRevalidate: true,
        },
      })
      players.push(player)
    }
    
    // Create 18 runners per team
    for (let i = 0; i < 18; i++) {
      const { firstName, lastName } = generatePlayerName()
      const position = positions[Math.floor(Math.random() * (positions.length - 1))] // Exclude goalie
      const player = await payload.create({
        collection: 'players',
        data: {
          firstName,
          lastName,
          jerseyNumber: i + 3, // Runners get 3-20
          team: team.id,
          primaryPosition: position,
          handedness: handedness[Math.floor(Math.random() * handedness.length)],
          playerType: 'runner',
        },
        depth: 0,
        context: {
          disableRevalidate: true,
        },
      })
      players.push(player)
    }
    
    allPlayers.push(...players)
  }
  
  // Create game schedule
  payload.logger.info('— Creating game schedule...')
  const gameSchedule = generateGameSchedule(createdTeams)
  
  const createdGames = await Promise.all(
    gameSchedule.map(async (gameData) => {
      // Find starting goalies for each team
      const homeGoalie = allPlayers.find(p => p.team === gameData.homeTeam && p.playerType === 'goalie')
      const awayGoalie = allPlayers.find(p => p.team === gameData.awayTeam && p.playerType === 'goalie')
      
      return await payload.create({
        collection: 'games',
        data: {
          ...gameData,
          homeStartingGoalie: homeGoalie?.id,
          awayStartingGoalie: awayGoalie?.id,
          homeCurrentGoalie: homeGoalie?.id,
          awayCurrentGoalie: awayGoalie?.id,
        },
        depth: 0,
        context: {
          disableRevalidate: true,
        },
      })
    })
  )
  
  // Generate some sample statistics for a few completed games
  payload.logger.info('— Generating sample game statistics...')
  
  // Mark first 3 games as completed with sample stats
  const completedGames = createdGames.slice(0, 3)
  
  for (const game of completedGames) {
    // Update game to final status with scores
    const homeScore = Math.floor(Math.random() * 8) + 5 // 5-12 goals
    const awayScore = Math.floor(Math.random() * 8) + 5
    
    await payload.update({
      collection: 'games',
      id: game.id,
      data: {
        status: 'final',
        homeScore,
        awayScore,
        currentPeriod: 3,
        gamePoints: {
          home: homeScore > awayScore ? 3 : homeScore === awayScore ? 1 : 0,
          away: awayScore > homeScore ? 3 : awayScore === homeScore ? 1 : 0,
        },
        finalGamePoints: {
          home: homeScore > awayScore ? 2 : homeScore === awayScore ? 1 : 0,
          away: awayScore > homeScore ? 2 : awayScore === homeScore ? 1 : 0,
        },
        periodPoints: {
          period1: { home: 1, away: 0 },
          period2: { home: 0, away: 1 },
          period3: { home: homeScore > awayScore ? 1 : 0, away: awayScore > homeScore ? 1 : 0 },
        },
      },
      depth: 0,
      context: {
        disableRevalidate: true,
      },
    })
    
    // Generate goals for this game
    const homePlayers = allPlayers.filter(p => p.team === game.homeTeam && p.playerType === 'runner')
    const awayPlayers = allPlayers.filter(p => p.team === game.awayTeam && p.playerType === 'runner')
    
    // Create goals for home team
    for (let i = 0; i < homeScore; i++) {
      const scorer = homePlayers[Math.floor(Math.random() * homePlayers.length)]
      const period = Math.floor(Math.random() * 3) + 1
      const time = `${Math.floor(Math.random() * 12)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`
      
      await payload.create({
        collection: 'goals',
        data: {
          game: game.id,
          period: period.toString(),
          time,
          scorer: scorer.id,
          team: game.homeTeam,
          goalType: 'even_strength',
        },
        depth: 0,
        context: {
          disableRevalidate: true,
        },
      })
    }
    
    // Create goals for away team
    for (let i = 0; i < awayScore; i++) {
      const scorer = awayPlayers[Math.floor(Math.random() * awayPlayers.length)]
      const period = Math.floor(Math.random() * 3) + 1
      const time = `${Math.floor(Math.random() * 12)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`
      
      await payload.create({
        collection: 'goals',
        data: {
          game: game.id,
          period: period.toString(),
          time,
          scorer: scorer.id,
          team: game.awayTeam,
          goalType: 'even_strength',
        },
        depth: 0,
        context: {
          disableRevalidate: true,
        },
      })
    }
    
    // Generate some penalties
    const penaltyCount = Math.floor(Math.random() * 6) + 2 // 2-7 penalties per game
    for (let i = 0; i < penaltyCount; i++) {
      const allGamePlayers = [...homePlayers, ...awayPlayers]
      const player = allGamePlayers[Math.floor(Math.random() * allGamePlayers.length)]
      const period = Math.floor(Math.random() * 3) + 1
      const time = `${Math.floor(Math.random() * 12)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`
      
      const infractions = ['slashing', 'tripping', 'interference', 'holding', 'cross_checking']
      const infraction = infractions[Math.floor(Math.random() * infractions.length)]
      
      await payload.create({
        collection: 'penalties',
        data: {
          game: game.id,
          period: period.toString(),
          time,
          player: player.id,
          team: player.team,
          infraction,
          duration: '2min',
          penaltyType: 'minor',
        },
        depth: 0,
        context: {
          disableRevalidate: true,
        },
      })
    }
  }
  
  payload.logger.info('🎉 Tournament seeding completed successfully!')
  payload.logger.info(`   • Created ${createdTeams.length} teams`)
  payload.logger.info(`   • Created ${allPlayers.length} players`)
  payload.logger.info(`   • Created ${createdGames.length} games`)
  payload.logger.info(`   • Generated statistics for ${completedGames.length} completed games`)
}