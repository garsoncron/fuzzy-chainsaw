// Mock Next.js router for Storybook
export const useRouter = () => ({
  pathname: '/storybook',
  route: '/storybook',
  query: {},
  asPath: '/storybook',
  push: () => Promise.resolve(true),
  replace: () => Promise.resolve(true),
  reload: () => {},
  back: () => {},
  prefetch: () => Promise.resolve(),
  beforePopState: () => {},
  events: {
    on: () => {},
    off: () => {},
    emit: () => {},
  },
  isFallback: false,
  isLocaleDomain: true,
  isReady: true,
  isPreview: false,
})

export const usePathname = () => '/storybook'

export const useSearchParams = () => new URLSearchParams()

export const notFound = () => {
  throw new Error('Not found - this is a Storybook mock')
}