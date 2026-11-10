// Public environment contract adapted from the CInCoders ReactJS starter.
const mode = import.meta.env.VITE_APP_MODE || 'demo'
export const demo = mode === 'demo'
export const env = {
  apiUrl: (import.meta.env.VITE_API_URL || 'http://localhost:3000/frequencia/api').replace(/\/+$/, ''),
  baseUrl: import.meta.env.BASE_URL,
}

export function keycloakConfig() {
  if (mode !== 'keycloak') throw new Error('VITE_APP_MODE deve ser demo ou keycloak.')
  const config = JSON.parse(import.meta.env.VITE_KEYCLOAK_JSON || '{}')
  if (!config?.['auth-server-url'] || !config?.realm || !config?.resource) {
    throw new Error('Configure VITE_KEYCLOAK_JSON com URL, realm e client ID.')
  }
  return config as { 'auth-server-url': string; realm: string; resource: string }
}
