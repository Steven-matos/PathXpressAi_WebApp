declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_USER_POOL_ID: string;
    NEXT_PUBLIC_USER_POOL_CLIENT_ID: string;
    NEXT_PUBLIC_GRAPHQL_ENDPOINT: string;
  }
}

interface Window {
  __ENV?: {
    NEXT_PUBLIC_USER_POOL_ID: string;
    NEXT_PUBLIC_USER_POOL_CLIENT_ID: string;
    NEXT_PUBLIC_GRAPHQL_ENDPOINT: string;
  };
} 