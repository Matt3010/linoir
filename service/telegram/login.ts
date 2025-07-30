import {Api, TelegramClient} from "telegram";
import {StringSession} from "telegram/sessions";

// Definizione del tipo per il risultato, con userId come 'number'
type LoginResult = {
  userId: number;
  username?: string;
  session: string;
};

// Definizione del tipo per le callback per maggiore chiarezza
type LoginCallbacks = {
  sendQrCode: (tokenUrl: string) => void;
  waitForPassword: (hint: string) => Promise<string>;
  onError: (err: Error) => void;
};

/**
 * Esegue il login a un account Telegram tramite QR code.
 *
 * @param apiId Il tuo API ID di Telegram.
 * @param apiHash Il tuo API Hash di Telegram.
 * @param initialSession Una sessione stringa opzionale per riprendere una sessione esistente.
 * @param callbacks Un oggetto con funzioni per gestire la visualizzazione del QR, la richiesta di password e gli errori.
 * @returns Una Promise che si risolve con un oggetto contenente ID utente, username e stringa di sessione in caso di successo, altrimenti null.
 */
export async function loginWithSignInQr(
  apiId: number,
  apiHash: string,
  callbacks: LoginCallbacks,
  initialSession: string = ""
): Promise<LoginResult | null> {
  const stringSession = new StringSession(initialSession);
  const client = new TelegramClient(stringSession, apiId, apiHash, {
    connectionRetries: 5,
  });

  try {
    await client.connect();

    // Controlla se il client è già autorizzato
    if (await client.isUserAuthorized()) {
      const me = await client.getMe();
      if (me instanceof Api.User) {
        console.log("✅ Già loggato come", me.username);
        return {
          // Convertito da bigint a number
          userId: Number(me.id),
          username: me.username,
          session: client.session.save(),
        };
      }
    }

    // Avvia il flusso di login con QR code
    const user = await client.signInUserWithQrCode(
      {apiId, apiHash},
      {
        qrCode: async (code) => {
          const tokenUrl = `tg://login?token=${code.token.toString("base64url")}`;
          callbacks.sendQrCode(tokenUrl);
        },
        password: (hint) => callbacks.waitForPassword(hint),
        onError: (err) => {
          throw err; // Centralizza la gestione degli errori
        },
      }
    );

    if (user instanceof Api.User) {
      const session = client.session.save();
      console.log("✅ Login con QR completato per", user.username);
      return {
        // Convertito da bigint a number
        userId: Number(user.id),
        username: user.username,
        session,
      };
    }

    // Se il login non va a buon fine, lancia un errore
    throw new Error("Login completato ma non sono stati ricevuti i dati utente.");

  } catch (err: any) {
    callbacks.onError(err);
    return null;
  } finally {
    // Assicura sempre la disconnessione del client
    if (client.connected) {
      await client.disconnect();
    }
  }
}
