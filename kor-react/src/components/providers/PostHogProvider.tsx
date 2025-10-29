import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { PostHog } from 'posthog-js/react';
import posthog from '../../lib/posthog';

interface PostHogContextType {
  posthog: PostHog;
}

const PostHogContext = createContext<PostHogContextType | undefined>(undefined);

interface PostHogProviderProps {
  children: ReactNode;
}

export const PostHogProvider: React.FC<PostHogProviderProps> = ({ children }) => {
  useEffect(() => {
    // PostHog is already initialized in App.tsx, so we just need to provide context
  }, []);

  return (
    <PostHogContext.Provider value={{ posthog }}>
      {children}
    </PostHogContext.Provider>
  );
};

export const usePostHog = (): PostHogContextType => {
  const context = useContext(PostHogContext);
  if (context === undefined) {
    throw new Error('usePostHog must be used within a PostHogProvider');
  }
  return context;
};

export default PostHogProvider;