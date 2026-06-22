const REPOSITORY = 'w1075207-gif/shanehairstudioSite';
const CONTENT_PATH = 'src/content/shaneContent.json';
const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json;charset=UTF-8',
      'cache-control': 'no-store',
    },
  });
}

function decodeBase64(base64) {
  const clean = String(base64 || '').replace(/\s/g, '');
  const binary = atob(clean);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return bytes;
}

function decodeBase64Text(base64) {
  return new TextDecoder().decode(decodeBase64(base64));
}

function getPassword(request) {
  const header = request.headers.get('authorization') || '';
  const prefix = 'Bearer ';
  if (!header.startsWith(prefix)) return '';
  return header.slice(prefix.length).trim();
}

function requireEnv(env) {
  if (!env.ADMIN_PASSWORD) {
    return 'Missing ADMIN_PASSWORD environment variable.';
  }
  if (!env.GITHUB_TOKEN) {
    return 'Missing GITHUB_TOKEN environment variable.';
  }
  return '';
}

function authorize(request, env) {
  const missing = requireEnv(env);
  if (missing) return json({ error: missing }, 500);

  if (getPassword(request) !== env.ADMIN_PASSWORD) {
    return json({ error: 'Invalid admin password.' }, 401);
  }

  return null;
}

function githubHeaders(env) {
  return {
    accept: 'application/vnd.github+json',
    authorization: `Bearer ${env.GITHUB_TOKEN}`,
    'content-type': 'application/json',
    'user-agent': 'shanehairstudio-admin',
    'x-github-api-version': '2022-11-28',
  };
}

async function github(env, path, options = {}) {
  const response = await fetch(
    `https://api.github.com/repos/${REPOSITORY}${path}`,
    {
      ...options,
      headers: {
        ...githubHeaders(env),
        ...(options.headers || {}),
      },
    },
  );
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message =
      data.message || `GitHub API request failed: ${response.status}`;
    throw new Error(message);
  }

  return data;
}

async function createBlob(env, content, encoding = 'utf-8') {
  const blob = await github(env, '/git/blobs', {
    method: 'POST',
    body: JSON.stringify({ content, encoding }),
  });
  return blob.sha;
}

function normalizeUpload(upload) {
  const path = String(upload?.path || '').replace(/^\/+/, '');
  const base64 = String(upload?.contentBase64 || '');

  if (!path.startsWith('public/uploads/shane/')) {
    throw new Error(`Invalid upload path: ${path}`);
  }
  if (path.includes('..') || !/^[a-zA-Z0-9._/-]+$/.test(path)) {
    throw new Error(`Unsafe upload path: ${path}`);
  }

  const bytes = decodeBase64(base64);
  if (!bytes.byteLength) throw new Error(`Empty upload: ${path}`);
  if (bytes.byteLength > MAX_UPLOAD_BYTES) {
    throw new Error(`Upload is larger than 5 MB: ${path}`);
  }

  return { path, base64 };
}

export async function onRequestGet({ request, env }) {
  const authError = authorize(request, env);
  if (authError) return authError;

  try {
    const branch = env.GITHUB_BRANCH || 'main';
    const file = await github(
      env,
      `/contents/${encodeURIComponent(CONTENT_PATH).replaceAll('%2F', '/')}?ref=${encodeURIComponent(branch)}`,
      { method: 'GET' },
    );
    const content = JSON.parse(decodeBase64Text(file.content || ''));
    return json({ content, sha: file.sha, branch });
  } catch (error) {
    return json({ error: error.message }, 500);
  }
}

export async function onRequestPost({ request, env }) {
  const authError = authorize(request, env);
  if (authError) return authError;

  try {
    const branch = env.GITHUB_BRANCH || 'main';
    const body = await request.json();
    if (!body.content || typeof body.content !== 'object') {
      return json(
        { error: 'Request body must include a content object.' },
        400,
      );
    }

    const uploads = Array.isArray(body.uploads)
      ? body.uploads.map(normalizeUpload)
      : [];

    const refName = `heads/${branch}`;
    const ref = await github(env, `/git/ref/${refName}`, { method: 'GET' });
    const headSha = ref.object.sha;
    const headCommit = await github(env, `/git/commits/${headSha}`, {
      method: 'GET',
    });

    const contentSha = await createBlob(
      env,
      `${JSON.stringify(body.content, null, 2)}\n`,
    );

    const tree = [
      {
        path: CONTENT_PATH,
        mode: '100644',
        type: 'blob',
        sha: contentSha,
      },
    ];

    for (const upload of uploads) {
      tree.push({
        path: upload.path,
        mode: '100644',
        type: 'blob',
        sha: await createBlob(env, upload.base64, 'base64'),
      });
    }

    const newTree = await github(env, '/git/trees', {
      method: 'POST',
      body: JSON.stringify({
        base_tree: headCommit.tree.sha,
        tree,
      }),
    });

    const commit = await github(env, '/git/commits', {
      method: 'POST',
      body: JSON.stringify({
        message: `Update site content from admin`,
        tree: newTree.sha,
        parents: [headSha],
      }),
    });

    await github(env, `/git/refs/${refName}`, {
      method: 'PATCH',
      body: JSON.stringify({
        sha: commit.sha,
        force: false,
      }),
    });

    return json({
      commitSha: commit.sha,
      commitUrl: commit.html_url,
      uploads: uploads.map((upload) => upload.path),
    });
  } catch (error) {
    return json({ error: error.message }, 500);
  }
}
