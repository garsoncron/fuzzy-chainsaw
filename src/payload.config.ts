// storage-adapter-import-placeholder
import { postgresAdapter } from '@payloadcms/db-postgres'

import sharp from 'sharp' // sharp-import
import path from 'path'
import { buildConfig, PayloadRequest } from 'payload'
import { fileURLToPath } from 'url'

import { Categories } from './collections/Categories'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Posts } from './collections/Posts'
import { Users } from './collections/Users' // Using the enhanced Users collection with role-based access

// Tournament Collections
import { Teams } from './collections/Teams'
import { Players } from './collections/Players'
import { Games } from './collections/Games'
import { Goals } from './collections/Goals'
import { Penalties } from './collections/Penalties'
import { Faceoffs } from './collections/Faceoffs'
import { Shots } from './collections/Shots'
import { LooseBalls } from './collections/LooseBalls'
import { AuditLogs } from './collections/AuditLogs'
import { Footer } from './Footer/config'
import { Header } from './Header/config'
import { Homepage } from './globals/Homepage/config'
import { plugins } from './plugins'
import { defaultLexical } from '@/fields/defaultLexical'
import { getServerSideURL } from './utilities/getURL'
import { seed } from './endpoints/seed'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    components: {
      // The `BeforeLogin` component renders a message that you see while logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below.
      beforeLogin: ['@/components/BeforeLogin'],
      // The `BeforeDashboard` component renders the 'welcome' block that you see after logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below.
      beforeDashboard: ['@/components/BeforeDashboard'],
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    user: Users.slug,
    livePreview: {
      breakpoints: [
        {
          label: 'Mobile',
          name: 'mobile',
          width: 375,
          height: 667,
        },
        {
          label: 'Tablet',
          name: 'tablet',
          width: 768,
          height: 1024,
        },
        {
          label: 'Desktop',
          name: 'desktop',
          width: 1440,
          height: 900,
        },
      ],
    },
  },
  // This config helps us configure global or default features that the other editors can inherit
  editor: defaultLexical,
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),
  collections: [
    // Core CMS Collections
    Pages, 
    Posts, 
    Media, 
    Categories, 
    Users,
    
    // Tournament Collections
    Teams,
    Players,
    Games,
    Goals,
    Penalties,
    Faceoffs,
    Shots,
    LooseBalls,
    AuditLogs,
  ],
  cors: [getServerSideURL()].filter(Boolean),
  globals: [Header, Footer, Homepage],
  plugins: [
    ...plugins,
    // storage-adapter-placeholder
  ],
  secret: process.env.PAYLOAD_SECRET,
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  onInit: async (payload) => {
    if (process.env.PAYLOAD_SEED === 'true') {
      const req = { user: { id: 'seed' } } as any
      await seed({ payload, req })
      process.exit(0)
    }
  },
  jobs: {
    access: {
      run: ({ req }: { req: PayloadRequest }): boolean => {
        // Allow logged in users to execute this endpoint (default)
        if (req.user) return true

        // If there is no logged in user, then check
        // for the Vercel Cron secret to be present as an
        // Authorization header:
        const authHeader = req.headers.get('authorization')
        return authHeader === `Bearer ${process.env.CRON_SECRET}`
      },
    },
    tasks: [],
  },
})
