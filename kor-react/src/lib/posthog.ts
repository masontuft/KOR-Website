import posthog from 'posthog-js'

export const initPostHog = () => {
  // Initialize PostHog in production by default, or when explicitly enabled in development
  const shouldInitialize = process.env.NODE_ENV === 'production' || process.env.REACT_APP_POSTHOG_ENABLED === 'true'
  
  if (typeof window !== 'undefined' && shouldInitialize) {
    posthog.init(process.env.REACT_APP_POSTHOG_KEY || '', {
      api_host: process.env.REACT_APP_POSTHOG_HOST || 'https://us.i.posthog.com',
      person_profiles: 'identified_only',
      // Explicitly enable session recording
      disable_session_recording: false,
      // Enable debug mode in development
      debug: process.env.NODE_ENV === 'development',
      loaded: (posthog) => {
        console.log('✅ PostHog loaded successfully', {
          environment: process.env.NODE_ENV,
          host: window.location.host,
          sessionRecordingEnabled: !posthog.config.disable_session_recording
        })
      }
    })
  } else {
    console.log('🚫 PostHog not initialized', {
      windowAvailable: typeof window !== 'undefined',
      shouldInitialize,
      enabled: process.env.REACT_APP_POSTHOG_ENABLED,
      environment: process.env.NODE_ENV
    })
  }
}

export default posthog