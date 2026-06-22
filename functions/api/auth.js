function jsonError(message, status = 500) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: {
      'content-type': 'application/json;charset=UTF-8',
      'cache-control': 'no-store',
    },
  });
}

export async function onRequestGet({ request, env }) {
  if (!env.GITHUB_CLIENT_ID) {
    return jsonError('Missing GITHUB_CLIENT_ID environment variable.', 500);
  }

  const requestUrl = new URL(request.url);
  const state = crypto.randomUUID();
  const redirectUrl = new URL('https://github.com/login/oauth/authorize');

  redirectUrl.searchParams.set('client_id', env.GITHUB_CLIENT_ID);
  redirectUrl.searchParams.set(
    'redirect_uri',
    `${requestUrl.origin}/api/callback`,
  );
  redirectUrl.searchParams.set('scope', 'repo user:email');
  redirectUrl.searchParams.set('state', state);

  return new Response(null, {
    status: 302,
    headers: {
      location: redirectUrl.toString(),
      'cache-control': 'no-store',
      'set-cookie': `decap_oauth_state=${state}; Path=/api/callback; HttpOnly; Secure; SameSite=Lax; Max-Age=600`,
    },
  });
}
