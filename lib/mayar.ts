const MAYAR_BASE_URL = 'https://api.mayar.id/hl/v1';

function getApiKey(): string {
  const key = process.env.MAYAR_API_KEY;
  if (!key) throw new Error('MAYAR_API_KEY is not set');
  return key;
}

interface MayarCreateInvoiceParams {
  name: string;
  email: string;
  mobile?: string;
  amount: number;
  description: string;
  redirectUrl: string;
  expiredAt: string; // ISO 8601
  planId: string;
  billingCycle: string;
  referenceId: string;
}

interface MayarInvoiceResponse {
  statusCode: number;
  messages: string;
  data: {
    id: string;
    transaction_id: string;
    transactionId: string;
    link: string;
  };
}

interface MayarInvoiceDetail {
  statusCode: number;
  messages: string;
  data: {
    id: string;
    amount: number;
    status: 'paid' | 'unpaid' | 'expired' | 'canceled';
    link: string;
    expiredAt: number;
    paymentUrl: string;
    paymentLinkId: string;
    transactionId: string;
    customer: {
      id: string;
      email: string;
      mobile: string;
      name: string;
    };
  };
}

export async function createMayarInvoice(
  params: MayarCreateInvoiceParams
): Promise<{ id: string; paymentUrl: string }> {
  const { name, email, mobile, amount, description, redirectUrl, expiredAt, planId, billingCycle, referenceId } = params;

  const res = await fetch(`${MAYAR_BASE_URL}/invoice/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getApiKey()}`,
    },
    body: JSON.stringify({
      name,
      email,
      mobile,
      description: `${description} REF ${referenceId}`,
      items: [
        {
          quantity: 1,
          rate: amount,
          description: description,
        },
      ],
      redirectUrl,
      expiredAt,
      extraData: {
        project: 'onetap',
        planId,
        billingCycle,
        referenceId,
      },
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Mayar API error ${res.status}: ${text}`);
  }

  const json: MayarInvoiceResponse = await res.json();

  if (json.statusCode !== 200) {
    throw new Error(`Mayar error: ${json.messages}`);
  }

  // The link might be a full URL or just a slug
  const paymentUrl = json.data.link.startsWith('http') 
    ? json.data.link 
    : `https://pay.mayar.id/invoices/${json.data.link}`;

  return {
    id: json.data.id,
    paymentUrl,
  };
}

export async function getMayarInvoice(invoiceId: string): Promise<MayarInvoiceDetail['data']> {
  const res = await fetch(`${MAYAR_BASE_URL}/invoice/${invoiceId}`, {
    headers: {
      Authorization: `Bearer ${getApiKey()}`,
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Mayar API error ${res.status}: ${text}`);
  }

  const json: MayarInvoiceDetail = await res.json();
  return json.data;
}

export async function findMayarInvoice(params: {
  referenceId?: string;
  email?: string;
  amount?: number;
}): Promise<MayarInvoiceDetail['data'] | null> {
  const { referenceId, email, amount } = params;
  
  // Search through first 2 pages of invoices
  for (let page = 1; page <= 2; page++) {
    const res = await fetch(`${MAYAR_BASE_URL}/invoice?page=${page}`, {
      headers: {
        Authorization: `Bearer ${getApiKey()}`,
      },
      cache: 'no-store',
    });

    if (!res.ok) continue;

    const json = await res.json();
    const invoices = json.data as any[];

    if (!invoices || invoices.length === 0) break;

    const match = invoices.find((inv) => {
      // Try matching by referenceId in description or metadata
      const hasRef = referenceId && (
        (inv.description && inv.description.includes(referenceId)) ||
        (inv.transactions?.[0]?.extraData?.referenceId === referenceId)
      );

      if (hasRef) return true;

      // Fallback to email + amount match if status is pending/unpaid
      const hasEmailAmount = email && amount && 
        inv.customer?.email === email && 
        inv.amount === amount;

      return hasEmailAmount;
    });

    if (match) {
      // Need to fetch full detail to match the return type
      return getMayarInvoice(match.id);
    }
  }

  return null;
}

