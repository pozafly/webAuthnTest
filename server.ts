import express from 'express';
import base64url from 'base64url';
import crypto from 'crypto';
import cors from 'cors';

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

const users = {}; // 임시 사용자 DB

function generateChallenge() {
  return base64url(crypto.randomBytes(32));
}

app.post('/register', (req, res) => {
  const challenge = generateChallenge();
  const userId = base64url(crypto.randomBytes(32));

  users[userId] = { challenge };

  res.json({
    challenge,
    rp: { name: 'Example Site' },
    user: {
      id: userId,
      name: 'user@example.com',
      displayName: 'Example User',
    },
    pubKeyCredParams: [{ type: 'public-key', alg: -7 }],
    authenticatorSelection: { authenticatorAttachment: 'platform' },
    timeout: 60000,
    attestation: 'direct',
  });
});

app.post('/login', (req, res) => {
  const challenge = generateChallenge();
  const userId = Object.keys(users)[0]; // 예시로 첫 번째 사용자 선택

  users[userId].challenge = challenge;

  res.json({
    challenge,
    allowCredentials: [
      {
        id: userId,
        type: 'public-key',
      },
    ],
    timeout: 60000,
  });
});

app.post('/login/complete', (req, res) => {
  const { id, rawId, type, response } = req.body;
  console.log(id, rawId, type, response);

  // 서버측 검증 로직 구현
  res.sendStatus(200);
});

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
