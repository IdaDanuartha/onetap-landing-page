/**
 * WhatsApp Gateway API helper (Fonnte)
 *
 * Set FONNTE_API_TOKEN in your .env.local file.
 */

interface SendWAParams {
  /** Target phone number in format: 628xxxxxxxxxx */
  target: string;
  message: string;
  /** Optional custom API token (e.g. for Pro users) */
  token?: string;
}

export async function sendWhatsApp({ target, message, token: customToken }: SendWAParams): Promise<{ success: boolean; error?: string }> {
  const token = customToken || process.env.FONNTE_API_TOKEN;
  if (!token) {
    console.warn('[WhatsApp] API TOKEN not configured. Skipping WA send.');
    return { success: false, error: 'API Token not configured' };
  }

  // Normalize phone number (08xxx -> 628xxx)
  const normalizedTarget = target.startsWith('0') ? '62' + target.substring(1) : target;

  try {
    const res = await fetch('https://api.fonnte.com/send', {
      method: 'POST',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        target: normalizedTarget,
        message,
        countryCode: '62',
      }),
    });

    const text = await res.text();
    if (!res.ok) {
      console.error('[WhatsApp] HTTP error:', res.status, text);
      return { success: false, error: `HTTP ${res.status}: ${text}` };
    }

    const data = JSON.parse(text);
    // Success if status is true
    return { 
      success: data.status === true, 
      error: data.status === true ? undefined : data.reason || 'Fonnte gateway error' 
    };
  } catch (err: any) {
    console.error('[WhatsApp] Send error:', err);
    return { success: false, error: err.message || String(err) };
  }
}

export async function getWhatsAppStatus(customToken?: string): Promise<{ isConnected: boolean; deviceStatus: string }> {
  const token = customToken || process.env.FONNTE_API_TOKEN;
  if (!token) return { isConnected: false, deviceStatus: 'unconfigured' };

  try {
    const res = await fetch('https://api.fonnte.com/device', {
      method: 'POST',
      headers: { Authorization: token },
    });

    if (!res.ok) return { isConnected: false, deviceStatus: 'error' };
    
    const data = await res.json();
    // Fonnte returns status: true and device_status: "connect" when ready
    return {
      isConnected: data.status === true && data.device_status === 'connect',
      deviceStatus: data.device_status || 'unknown'
    };
  } catch (err) {
    console.error('[WhatsApp] Status error:', err);
    return { isConnected: false, deviceStatus: 'error' };
  }
}
