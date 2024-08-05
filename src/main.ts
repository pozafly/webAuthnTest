// async function register() {
//   const response = await fetch('http://localhost:3000/register', {
//     method: 'POST',
//   });
//   const options = await response.json();

//   options.challenge = Uint8Array.from(atob(options.challenge), (c) =>
//     c.charCodeAt(0)
//   );
//   options.user.id = Uint8Array.from(atob(options.user.id), (c) =>
//     c.charCodeAt(0)
//   );

//   const credential = await navigator.credentials.create({ publicKey: options });
//   const credentialData = {
//     id: credential?.id,
//     rawId: btoa(String.fromCharCode(...new Uint8Array(credential?.rawId))),
//     type: credential?.type,
//     response: {
//       attestationObject: btoa(
//         String.fromCharCode(
//           ...new Uint8Array(credential?.response.attestationObject)
//         )
//       ),
//       clientDataJSON: btoa(
//         String.fromCharCode(
//           ...new Uint8Array(credential?.response.clientDataJSON)
//         )
//       ),
//     },
//   };

//   await fetch('http://localhost:3000/register/complete', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(credentialData),
//   });
// }

function base64UrlToBase64(base64UrlString: string): string {
  return base64UrlString.replace(/-/g, '+').replace(/_/g, '/');
}

async function register() {
  const response = await fetch('http://localhost:3000/register', {
    method: 'POST',
  });
  const options = await response.json();

  options.challenge = Uint8Array.from(
    atob(base64UrlToBase64(options.challenge)),
    (c) => c.charCodeAt(0)
  );
  options.user.id = Uint8Array.from(
    atob(base64UrlToBase64(options.user.id)),
    (c) => c.charCodeAt(0)
  );

  const credential = await navigator.credentials.create({ publicKey: options });

  const credentialData = {
    id: credential.id,
    rawId: btoa(String.fromCharCode(...new Uint8Array(credential.rawId))),
    type: credential.type,
    response: {
      attestationObject: btoa(
        String.fromCharCode(
          ...new Uint8Array(credential.response.attestationObject)
        )
      ),
      clientDataJSON: btoa(
        String.fromCharCode(
          ...new Uint8Array(credential.response.clientDataJSON)
        )
      ),
    },
  };

  await fetch('http://localhost:3000/register/complete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentialData),
  });
}

async function login() {
  const response = await fetch('http://localhost:3000/login', {
    method: 'POST',
  });
  const options = await response.json();

  options.challenge = Uint8Array.from(atob(options.challenge), (c) =>
    c.charCodeAt(0)
  );
  options.allowCredentials = options.allowCredentials.map((cred) => {
    cred.id = Uint8Array.from(atob(cred.id), (c) => c.charCodeAt(0));
    return cred;
  });

  const assertion = await navigator.credentials.get({ publicKey: options });

  const assertionData = {
    id: assertion?.id,
    rawId: btoa(String.fromCharCode(...new Uint8Array(assertion?.rawId))),
    type: assertion?.type,
    response: {
      authenticatorData: btoa(
        String.fromCharCode(
          ...new Uint8Array(assertion?.response.authenticatorData)
        )
      ),
      clientDataJSON: btoa(
        String.fromCharCode(
          ...new Uint8Array(assertion?.response.clientDataJSON)
        )
      ),
      signature: btoa(
        String.fromCharCode(...new Uint8Array(assertion?.response.signature))
      ),
      userHandle: assertion?.response.userHandle
        ? btoa(
            String.fromCharCode(
              ...new Uint8Array(assertion?.response.userHandle)
            )
          )
        : null,
    },
  };

  await fetch('http://localhost:3000/login/complete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(assertionData),
  });
}

document.getElementById('register')?.addEventListener('click', register);
document.getElementById('login')?.addEventListener('click', login);
