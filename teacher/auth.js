/*
 * Google Identity Services sign-in for the teacher portal.
 * The ID token is also verified by Apps Script before teacher-only actions.
 */
(() => {
  const ALLOWED_DOMAIN = "sfusd.edu";
  const GOOGLE_CLIENT_ID = "REPLACE_WITH_GOOGLE_OAUTH_WEB_CLIENT_ID";

  window.teacherAuth = {
    idToken: null,
    email: null
  };

  const gate = document.getElementById("sign-in-gate");
  const editor = document.getElementById("editor-content");
  const message = document.getElementById("auth-message");
  const button = document.getElementById("google-sign-in-button");

  function setSignedIn(email, token) {
    window.teacherAuth.idToken = token;
    window.teacherAuth.email = email;
    document.getElementById("signed-in-email").textContent = email;
    gate.hidden = true;
    editor.hidden = false;
    window.dispatchEvent(new CustomEvent("teacher-auth-ready"));
  }

  function handleCredential(response) {
    try {
      const encoded = response.credential.split(".")[1];
      const base64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
      const claims = JSON.parse(atob(base64));

      if (claims.hd !== ALLOWED_DOMAIN) {
        message.textContent = "Use a Google account from " + ALLOWED_DOMAIN + ".";
        window.google.accounts.id.disableAutoSelect();
        return;
      }

      setSignedIn(claims.email || "SFUSD account", response.credential);
    } catch (error) {
      message.textContent = "Google sign-in could not be verified. Please try again.";
      console.error("Google sign-in error:", error);
    }
  }

  function initializeSignIn() {
    if (GOOGLE_CLIENT_ID.startsWith("REPLACE_")) {
      message.textContent = "Google sign-in setup is required before the teacher portal can be used.";
      return;
    }

    if (!window.google?.accounts?.id) {
      window.setTimeout(initializeSignIn, 100);
      return;
    }

    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleCredential,
      hd: ALLOWED_DOMAIN
    });

    window.google.accounts.id.renderButton(button, {
      type: "standard",
      theme: "outline",
      size: "large",
      text: "signin_with"
    });
  }

  document.getElementById("sign-out").addEventListener("click", () => {
    window.teacherAuth.idToken = null;
    window.teacherAuth.email = null;
    editor.hidden = true;
    gate.hidden = false;
    message.textContent = "You have signed out.";
    window.google?.accounts?.id?.disableAutoSelect();
  });

  initializeSignIn();
})();
