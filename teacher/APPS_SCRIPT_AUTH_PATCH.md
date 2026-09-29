# Apps Script teacher authentication patch

This patch protects teacher-only actions in the existing Apps Script while leaving the student quiz actions available to anyone who has a quiz link.

## 1. Configure Script Properties

In the Apps Script project, open **Project Settings → Script properties** and add:

| Property | Value |
| --- | --- |
| `GOOGLE_OAUTH_CLIENT_ID` | `261731970237-u6jlichq228l780as0ssnrsl5oqqroi7.apps.googleusercontent.com` |
| `TEACHER_DOMAIN` | `sfusd.edu` |

Do not change the web app deployment to domain-only access. The student quiz uses the same deployment, and that setting would block students outside the organization.

## 2. Add the teacher authorization helpers

Add these functions to the Apps Script project:

```js
function isTeacherAction_(action) {
  return [
    'saveQuiz',
    'saveQuestions',
    'addMediaImage',
    'getTeacherMediaImages',
    'listTeacherQuizzes'
  ].includes(String(action || ''));
}

function requireTeacher_(idToken) {
  const token = String(idToken || '').trim();
  if (!token) {
    throw new Error('Sign in with your SFUSD Google account to continue.');
  }

  const properties = PropertiesService.getScriptProperties();
  const clientID = properties.getProperty('GOOGLE_OAUTH_CLIENT_ID');
  const allowedDomain = String(
    properties.getProperty('TEACHER_DOMAIN') || ''
  ).trim().toLowerCase();

  if (!clientID || !allowedDomain) {
    throw new Error('Teacher sign-in has not been configured in Script Properties.');
  }

  // Cache successful Google verification briefly to avoid a validation request
  // on every editor action. The raw token is never stored in the cache key.
  const digest = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    token,
    Utilities.Charset.UTF_8
  );
  const cacheKey = 'teacher-token-' + Utilities.base64EncodeWebSafe(digest);
  const cache = CacheService.getScriptCache();
  let claims = cache.get(cacheKey);

  if (claims) {
    claims = JSON.parse(claims);
  } else {
    const verifyURL =
      'https://oauth2.googleapis.com/tokeninfo?id_token=' +
      encodeURIComponent(token);
    const response = UrlFetchApp.fetch(verifyURL, {
      muteHttpExceptions: true
    });

    if (response.getResponseCode() !== 200) {
      throw new Error('Google sign-in expired or could not be verified. Sign in again.');
    }

    claims = JSON.parse(response.getContentText());
  }

  const issuer = String(claims.iss || '');
  const expiry = Number(claims.exp || 0);
  const emailVerified =
    claims.email_verified === true ||
    String(claims.email_verified).toLowerCase() === 'true';

  if (
    String(claims.aud || '') !== clientID ||
    !['accounts.google.com', 'https://accounts.google.com'].includes(issuer) ||
    expiry * 1000 <= Date.now() ||
    String(claims.hd || '').toLowerCase() !== allowedDomain ||
    !emailVerified
  ) {
    throw new Error('This action is limited to verified ' + allowedDomain + ' accounts.');
  }

  if (!cache.get(cacheKey)) {
    const cacheSeconds = Math.max(
      1,
      Math.min(3300, expiry - Math.floor(Date.now() / 1000) - 30)
    );
    cache.put(cacheKey, JSON.stringify(claims), cacheSeconds);
  }

  return {
    email: String(claims.email || ''),
    domain: String(claims.hd || '')
  };
}

function listTeacherQuizzes() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet()
    .getSheetByName(CONFIG.QUIZZES_SHEET);

  if (!sheet) {
    throw new Error('Quizzes sheet not found.');
  }

  const quizzes = getSheetData(sheet)
    .filter(row => row.QuizID)
    .map(row => ({
      quizID: String(row.QuizID),
      title: String(row.Title || '')
    }))
    .sort((a, b) => a.title.localeCompare(b.title));

  return {
    success: true,
    quizzes: quizzes
  };
}
```

## 3. Update the request routing

In `doPost(e)`, immediately after parsing `data`, add:

```js
if (isTeacherAction_(data.action)) {
  requireTeacher_(data.idToken);
}
```

In the `switch (data.action)`, add:

```js
case 'getTeacherMediaImages':
  return jsonResponse(getTeacherMediaImages());

case 'listTeacherQuizzes':
  return jsonResponse(listTeacherQuizzes());
```

In `doGet(e)`, remove the `getTeacherMediaImages` branch. The editor now sends this action through POST with the ID token. Leave `getQuiz` available for the student quiz.

Finally, deploy a **new version** of the Apps Script web app. The editor's sign-in gate is only a user interface; this server-side check is what blocks non-SFUSD users from teacher actions.

## Verification note

The helper asks Google's token information endpoint to verify the token, then checks the audience, issuer, expiry, verified email, and Workspace hosted-domain claim. Google documents that endpoint for development/debugging and recommends a Google API client library or a general-purpose JWT library for production verification. Apps Script does not provide a built-in ID-token verifier, so this is a practical low-volume option for the current setup; for a strict production deployment, put verification behind a small backend using Google's supported authentication library.
