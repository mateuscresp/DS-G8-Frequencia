import type { AuthProviderProps } from 'react-oidc-context'
import { env, keycloakConfig } from '../config/env'

// OIDC provider configuration adapted from the CInCoders starter.
export function authProviderProps(): AuthProviderProps {
  const config = keycloakConfig()
  const redirectUri = new URL(env.baseUrl, window.location.origin).href
  return {
    authority: config['auth-server-url'].replace(/\/+$/, '') + '/realms/' + encodeURIComponent(config.realm),
    client_id: config.resource,
    redirect_uri: redirectUri,
    post_logout_redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid profile email',
    accessTokenExpiringNotificationTimeInSeconds: 30,
    automaticSilentRenew: true,
    onSigninCallback: () => window.history.replaceState({}, document.title, env.baseUrl),
  }
}
