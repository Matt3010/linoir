import {Api, TelegramClient} from "telegram";
import {StringSession} from "telegram/sessions";
import WebSocket, {RawData, WebSocketServer} from "ws";
import {Message} from "../websocket";


interface TelegramLoginEventPayload {
  apiId: number;
  apiHash: string;
  stringSession: string;
  isLogged: boolean;
}

interface TelegramQrCodeTokenEventPayload {
  qrCodeToken: string;
}

interface TelegramQrCode2FAEventRequestPayload {
  hint: string | null;
}

interface TelegramQrCode2FAEventResponsePayload {
  password: string;
}

interface TelegramQrCodeLoginErrorEventPayload {
  error: string;
}

// --- Core Function ---

let telegramClient: TelegramClient | null = null;


async function handleWebSocketMessage(
  ws: WebSocket,
  apiId: number,
  apiHash: string,
  initialSession: string
): Promise<void> {
  try {
    const stringSession = new StringSession(initialSession);

    telegramClient ??= new TelegramClient(stringSession, apiId, apiHash, {
      connectionRetries: 5,
    });

    await telegramClient.connect();

    telegramClient.addEventHandler((update) => {
      if (update instanceof Api.UpdatesTooLong) {
        sendLoginFailure(ws, apiId, apiHash);
      }
    });

    if (await telegramClient.isUserAuthorized()) {
      console.log("✅ User is already logged in.");
      const session = telegramClient.session.save() as unknown as string;
      sendLoginSuccess(ws, apiId, apiHash, session);
      return;
    }

    sendLoginFailure(ws, apiId, apiHash);

    const user = await telegramClient.signInUserWithQrCode(
      {apiId, apiHash},
      {
        qrCode: (code: { token: Buffer; expires: number }): Promise<void> => sendQrCode(ws, code),
        password: (hint: string | undefined): Promise<string> => waitForPassword(ws, hint),
        onError: (err: Error): Promise<boolean> => handleQrLoginError(ws, err),
      }
    );

    if (!user || ("className" in user && user.className === "UserEmpty")) {
      sendError(ws, "Login failed. User not found or empty session.");
      return;
    }

    const session = telegramClient.session.save() as unknown as string;
    sendLoginSuccess(ws, apiId, apiHash, session);

  } catch (err: any) {
    sendError(ws, err.message);
  }
}


function sendMessage<T>(ws: WebSocket, topic: string, payload: T): void {
  const message: Message<T> = {
    topic,
    payload,
    ignoreSelf: false,
  };
  ws.send(JSON.stringify(message));
}

function sendLoginSuccess(ws: WebSocket, apiId: number, apiHash: string, session: string): void {
  sendMessage<TelegramLoginEventPayload>(ws, "TelegramPlugin:LoginEvent", {
    apiId,
    apiHash,
    stringSession: session,
    isLogged: true,
  });
}


function sendLoginFailure(ws: WebSocket, apiId: number, apiHash: string): void {
  sendMessage<TelegramLoginEventPayload>(ws, "TelegramPlugin:LoginEvent", {
    apiId,
    apiHash,
    stringSession: '',
    isLogged: false,
  });
}

function sendError(ws: WebSocket, error: string): void {
  sendMessage<TelegramQrCodeLoginErrorEventPayload>(ws, "TelegramPluginLoginQrLoginError", {error});
}

function sendQrCode(ws: WebSocket, code: { token: Buffer }): Promise<void> {
  const tokenUrl = `tg://login?token=${code.token.toString("base64url")}`;
  sendMessage<TelegramQrCodeTokenEventPayload>(ws, "TelegramPlugin:QrCodeTokenUpdate", {
    qrCodeToken: tokenUrl,
  });
  return Promise.resolve();
}

function waitForPassword(ws: WebSocket, hint?: string): Promise<string> {
  console.log("📱 2FA required", hint);
  sendMessage<TelegramQrCode2FAEventRequestPayload>(ws, "TelegramPluginLogin2FARequest", {
    hint: hint ?? null,
  });

  return new Promise((resolve, reject) => {
    const listener = (msg: WebSocket.RawData) => {
      try {
        const parsed = JSON.parse(msg.toString());
        if (parsed.topic === "TelegramPluginLogin2FARequest") {
          ws.removeListener("message", listener);
          const response = parsed as Message<TelegramQrCode2FAEventResponsePayload>;
          resolve(response.payload.password);
        }
      } catch {
      }
    };
    ws.on("message", listener);
    setTimeout(() => {
      ws.removeListener("message", listener);
      reject(new Error("Timeout: Did not receive the 2FA password within 60 seconds."));
    }, 60000);
  });
}

function handleQrLoginError(ws: WebSocket, err: Error): Promise<boolean> {
  sendError(ws, err.message);
  return Promise.resolve(true);
}

export async function loginWithSignInQr(
  wsServer: WebSocketServer
): Promise<void> {
  wsServer.on("connection", (ws: WebSocket) => {
    ws.on("message", async (data: RawData) => {
      try {
        const parsed = JSON.parse(data.toString()) as Message<TelegramLoginEventPayload>;
        if (parsed.topic !== "TelegramPlugin:LoginEvent") return;

        await handleWebSocketMessage(
          ws,
          parsed.payload.apiId,
          parsed.payload.apiHash,
          parsed.payload.stringSession
        );
      } catch (e) {
        console.error("Failed to process message:", e);
      }
    });
  });
}
