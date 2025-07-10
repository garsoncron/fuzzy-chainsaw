import type { Block } from 'payload'

export const YouTubeEmbed: Block = {
  slug: 'youtubeEmbed',
  interfaceName: 'YouTubeEmbed',
  fields: [
    {
      name: 'url',
      type: 'text',
      required: true,
      label: 'YouTube URL',
      admin: {
        description: 'Enter the YouTube video URL (e.g., https://www.youtube.com/watch?v=VIDEO_ID or https://youtu.be/VIDEO_ID)',
      },
      validate: (value) => {
        if (!value) return 'YouTube URL is required'
        
        // Basic YouTube URL validation
        const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/|live\/)|youtu\.be\/)[\w-]+(&[\w=]*)?$/
        if (!youtubeRegex.test(value)) {
          return 'Please enter a valid YouTube URL'
        }
        return true
      },
    },
    {
      name: 'title',
      type: 'text',
      label: 'Title (Optional)',
      admin: {
        description: 'Optional title to display above the video',
      },
    },
    {
      name: 'autoplay',
      type: 'checkbox',
      label: 'Autoplay',
      defaultValue: false,
      admin: {
        description: 'Autoplay the video when it comes into view (requires muted)',
      },
    },
    {
      name: 'muted',
      type: 'checkbox',
      label: 'Muted',
      defaultValue: true,
      admin: {
        description: 'Start the video muted (required for autoplay)',
      },
    },
    {
      name: 'showControls',
      type: 'checkbox',
      label: 'Show Controls',
      defaultValue: true,
      admin: {
        description: 'Show video player controls',
      },
    },
    {
      name: 'aspectRatio',
      type: 'select',
      label: 'Aspect Ratio',
      defaultValue: '16:9',
      options: [
        {
          label: '16:9 (Widescreen)',
          value: '16:9',
        },
        {
          label: '4:3 (Standard)',
          value: '4:3',
        },
        {
          label: '21:9 (Ultrawide)',
          value: '21:9',
        },
        {
          label: '1:1 (Square)',
          value: '1:1',
        },
      ],
      admin: {
        description: 'Video aspect ratio for responsive sizing',
      },
    },
    {
      name: 'privacyEnhanced',
      type: 'checkbox',
      label: 'Privacy Enhanced Mode',
      defaultValue: true,
      admin: {
        description: 'Use youtube-nocookie.com domain for enhanced privacy',
      },
    },
  ],
}