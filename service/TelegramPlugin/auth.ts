import {TelegramClient} from "telegram";
import {StringSession} from "telegram/sessions";
import WebSocket, {RawData, WebSocketServer} from "ws";
import {Message} from '../websocket';

// --- Interface Definitions ---

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

interface TelegramQrCodeLoginErrorRequestMessage {
  topic: "TelegramPluginLoginQrLoginError";
  payload: {
    error: string;
  };
  ignoreSelf: boolean;
}

// --- Core Function ---

async function handleWebSocketMessage(
  ws: WebSocket,
  apiId: number,
  apiHash: string,
  initialSession: string
): Promise<void> {
  try {
    const stringSession = new StringSession(initialSession);

    const telegramClient = new TelegramClient(stringSession, apiId, apiHash, {
      connectionRetries: 5,
    });

    await telegramClient.connect();
    console.log("🔗 Connected to Telegram API");

    // Check if the user is already authorized with the provided session
    if (await telegramClient.isUserAuthorized()) {
      console.log("✅ User is already logged in.");
      const session = telegramClient.session.save() as unknown as string;
      const response: Message<TelegramLoginEventPayload> = {
        payload: {
          apiId,
          apiHash,
          stringSession: session,
          isLogged: true,
        },
        ignoreSelf: false,
        topic: "TelegramLoginEventPayload",
      };
      ws.send(JSON.stringify(response));
      // Return early as the user is already logged in. The 'finally' block will still execute.
      return;
    }

    // If not logged in, proceed with the QR code sign-in process
    console.log("👤 User not logged in. Starting QR code login...");
    const user = await telegramClient.signInUserWithQrCode(
      {apiId, apiHash},
      {
        qrCode: (code) => sendQrCode(ws, code),
        password: (hint) => waitForPassword(ws, hint),
        onError: (err) => handleQrLoginError(ws, err),
      }
    );
    console.log("🔑 User signed in with QR code:", user);

    if (!user || ("className" in user && user.className === "UserEmpty")) {
      const errorResponse: TelegramQrCodeLoginErrorRequestMessage = {
        payload: {
          error: "Login failed. User not found or empty session.",
        },
        ignoreSelf: false,
        topic: "TelegramPluginLoginQrLoginError",
      };
      ws.send(JSON.stringify(errorResponse));
      return;
    }

    const session = telegramClient.session.save() as unknown as string;
    const response: Message<TelegramLoginEventPayload> = {
      payload: {
        apiId,
        apiHash,
        stringSession: session,
        isLogged: true,
      },
      ignoreSelf: false,
      topic: "TelegramLoginEventPayload",
    };
    ws.send(JSON.stringify(response));

  } catch (err: any) {
    console.log("❌ Error during Telegram login:", err.message);
    const errorResponse: TelegramQrCodeLoginErrorRequestMessage = {
      payload: {
        error: err.message,
      },
      ignoreSelf: false,
      topic: "TelegramPluginLoginQrLoginError",
    };
    ws.send(JSON.stringify(errorResponse));

  }
}

// --- Helper Functions ---

function sendQrCode(ws: WebSocket, code: { token: Buffer }): Promise<void> {
  return new Promise((resolve) => {
    const tokenUrl = `tg://login?token=${code.token.toString("base64url")}`;
    const message: Message<TelegramQrCodeTokenEventPayload> = {
      payload: {
        qrCodeToken: tokenUrl,
      },
      ignoreSelf: false,
      topic: "TelegramPluginLoginQrCodeTokenUpdate",
    };
    ws.send(JSON.stringify(message));
    resolve();
  })
}

function waitForPassword(ws: WebSocket, hint?: string): Promise<string> {
  console.log("📱 2FA required", hint);
  const message: Message<TelegramQrCode2FAEventRequestPayload> = {
    payload: {
      hint: hint ?? null,
    },
    ignoreSelf: false,
    topic: "TelegramPluginLogin2FARequest",
  };
  ws.send(JSON.stringify(message));

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
        // Ignora messaggi non validi
      }
    };
    ws.on("message", listener);
    setTimeout(() => {
      reject(new Error("Timeout: Did not receive the 2FA password within 60 seconds."));
    }, 60000);
  });
}

function handleQrLoginError(ws: WebSocket, err: Error): void | Promise<boolean> {
  return new Promise((resolve) => {
    const errorMessage: TelegramQrCodeLoginErrorRequestMessage = {
      payload: {error: err.message},
      topic: "TelegramPluginLoginQrLoginError",
      ignoreSelf: false,
    };
    ws.send(JSON.stringify(errorMessage));
    resolve(true);
  });
}

// --- Entrypoint ---

export async function loginWithSignInQr(
  wsServer: WebSocketServer,
): Promise<void> {
  wsServer.on("connection", (ws: WebSocket) => {
    ws.on("message", async (data: RawData) => {
      try {
        const parsed = JSON.parse(data.toString()) as Message<TelegramLoginEventPayload>;
        if (parsed.topic !== "TelegramLoginEventPayload") return;

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
