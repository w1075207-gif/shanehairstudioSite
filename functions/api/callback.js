function readCookie(request, name) {
  const cookie = request.headers.get('cookie') || '';
  return cookie
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`))
    ?.slice(name.length + 1);
}

function renderAuthMessage(status, content) {
  const message = `authorization:github:${status}:${JSON.stringify(content)}`;
  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Authorizing</title>
  </head>
  <body>
    <script>
      (function () {
        const message = ${JSON.stringify(message)};
        function receiveMessage(event) {
          if (!window.opener) return;
          window.opener.postMessage(message, event.origin);
          window.removeEventListener('message', receiveMessage, false);
        }
        window.addEventListener('message', receiveMessage, false);
        if (window.opener) window.opener.postMessage('authorizing:github', '*');
      })();
    </script>
  </body>
</html>`;

  return new Response(html, {
    status: status === 'success' ? 200 : 401,
    headers: {
      'content-type': 'text/html;charset=UTF-8',
      'cache-control': 'no-store',
      'set-cookie':
        'decap_oauth_state=; Path=/api/callback; HttpOnly; Secure; SameSite=Lax; Max-Age=0',
    },
  });
}

export async function onRequestGet({ request, env }) {
  if (!env.GITHUB_CLIENT_ID || !env.GITHUB_CLIENT_SECRET) {
    return renderAuthMessage('error', {
      error: 'missing_environment_variables',
      error_description: 'Missing GITHUB_CLIENT_ID or GITHUB_CLIENT_SECRET.',
    });
  }

  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const state = requestUrl.searchParams.get('state');
  const cookieState = readCookie(request, 'decap_oauth_state');

  if (!code) {
    return renderAuthMessage('error', {
      error: 'missing_code',
      error_description: 'GitHub did not return an authorization code.',
    });
  }

  if (!state || !cookieState || state !== cookieState) {
    return renderAuthMessage('error', {
      error: 'invalid_state',
      error_description: 'OAuth state validation failed.',
    });
  }

  const tokenResponse = await fetch(
    'https://github.com/login/oauth/access_token',
    {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        'user-agent': 'shanehairstudio-decap-cms',
      },
      body: JSON.stringify({
        client_id: env.GITHUB_CLIENT_ID,
        client_secret: env.GITHUB_CLIENT_SECRET,
        code,
      }),
    },
  );

  const result = await tokenResponse.json();

  if (!tokenResponse.ok || result.error) {
    return renderAuthMessage('error', result);
  }

  return renderAuthMessage('success', {
    token: result.access_token,
    provider: 'github',
  });
}
