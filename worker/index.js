import {
  onRequestGet,
  onRequestPost,
} from '../functions/api/admin/content.js';

function methodNotAllowed() {
  return new Response(JSON.stringify({ error: 'Method not allowed.' }), {
    status: 405,
    headers: {
      'content-type': 'application/json;charset=UTF-8',
      allow: 'GET, POST',
    },
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/api/admin/content') {
      if (request.method === 'GET') return onRequestGet({ request, env });
      if (request.method === 'POST') return onRequestPost({ request, env });
      return methodNotAllowed();
    }

    return env.ASSETS.fetch(request);
  },
};
