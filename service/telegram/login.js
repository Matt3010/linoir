import {TelegramClient} from "telegram";
import {StringSession} from "telegram/sessions/index.js";

/**
 * Gestisce la logica di login via QR quando riceve un messaggio dal WebSocket.
 */
async function handleWebSocketMessage(ws, data, apiId, apiHash, initialSession) {
  const stringSession = new StringSession(initialSession);
  const client = new TelegramClient(stringSession, apiId, apiHash, {
    connectionRetries: 5,
  });

  await client.connect();
  if (!client.connected) {
    throw new Error("Errore di connessione al client Telegram");
  }

  try {
    const user = await client.signInUserWithQrCode(
      {apiId, apiHash},
      {
        qrCode: async (code) => sendQrCode(ws, code),
        password: async (hint) => await waitForPassword(ws, hint),
        onError: async (err) => handleQrLoginError(ws, err),
      }
    );

    const session = client.session.save();
    ws.send(JSON.stringify({
      status: "authenticated",
      userId: user.id,
      username: user.username,
      session,
    }));

    console.log("✅ Login con QR completato per", user.username, session);
  } catch (err) {
    console.error("❌ Errore login:", err);
    ws.send(JSON.stringify({error: err.message}));
  }
}

function sendQrCode(ws, code) {
  const tokenUrl = `tg://login?token=${code.token.toString("base64url")}`;
  console.log("📱 Invia questo QR code al client:", tokenUrl);
  ws.send(JSON.stringify({status: "qr_code", url: tokenUrl}));
}

function waitForPassword(ws, hint) {
  console.log("📱 2fa_required", hint);
  ws.send(JSON.stringify({status: "2fa_required", hint}));
  return new Promise((resolve) => {
    ws.once("message", (msg) => {
      const data = JSON.parse(msg.toString());
      resolve(data.password);
    });
  });
}

function handleQrLoginError(ws, err) {
  console.error("❌ Errore durante login QR:", err);
  ws.send(JSON.stringify({error: err.message}));
  return true; // interrompe il login
}

export async function loginWithSignInQr(wsServer, apiId, apiHash, initialSession = "") {
  wsServer.on('connection', (ws) => {
    ws.on('message', (data) => {
      handleWebSocketMessage(ws, data, apiId, apiHash, initialSession);
    });
  });
}
