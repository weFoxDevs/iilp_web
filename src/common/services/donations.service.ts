export type DonationFrequency = 'ONE_TIME' | 'MONTHLY';
export type PaymentMethod = 'STRIPE' | 'PAYPAL';
export type DonationStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED' | 'REFUNDED';

export interface DonationData {
  id: string;
  donorName: string;
  donorEmail: string;
  amount: number;
  currency: string;
  frequency: DonationFrequency;
  paymentMethod: PaymentMethod;
  status: DonationStatus;
  transactionId?: string;
  customerReference?: string;
  message?: string;
  isAnonymous: boolean;
  paymentDetails: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface DonationStats {
  totalDonations: number;
  totalRaised: number;
  monthlyRaised: number;
  oneTimeRaised: number;
  stripeRaised: number;
  paypalRaised: number;
  completedCount: number;
  pendingCount: number;
  refundedCount: number;
  failedCount: number;
}

export interface DonationsListResponse {
  items: DonationData[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  stats: DonationStats;
}

export interface GatewayConfig {
  stripePublishableKey: string;
  paypalClientId: string;
  paypalMode: string;
  isStripeConfigured: boolean;
  isPayPalConfigured: boolean;
}

const getApiUrl = () =>
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

/**
 * Public Gateway Config
 */
export async function fetchGatewayConfig(): Promise<GatewayConfig> {
  try {
    const res = await fetch(`${getApiUrl()}/donations/config`, {
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) throw new Error('Failed to load gateway config');
    return await res.json();
  } catch {
    return {
      stripePublishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
      paypalClientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '',
      paypalMode: process.env.NEXT_PUBLIC_PAYPAL_MODE || 'sandbox',
      isStripeConfigured: false,
      isPayPalConfigured: false,
    };
  }
}

/**
 * Stripe: Create Checkout Session
 */
export async function createStripeSession(payload: {
  donorName: string;
  donorEmail: string;
  amount: number;
  frequency: DonationFrequency;
  message?: string;
  isAnonymous?: boolean;
  successUrl?: string;
  cancelUrl?: string;
}): Promise<{ sessionId: string; url: string; donationId: string; isMock?: boolean }> {
  const res = await fetch(`${getApiUrl()}/donations/stripe/checkout-session`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to initialize Stripe checkout.');
  }
  return data;
}

/**
 * Stripe: Verify Checkout Session
 */
export async function verifyStripeSession(
  sessionId: string,
  donationId?: string
): Promise<{ success: boolean; donation: DonationData }> {
  const res = await fetch(`${getApiUrl()}/donations/stripe/verify-session`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ sessionId, donationId }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to verify Stripe payment.');
  }
  return data;
}

/**
 * PayPal: Create Order
 */
export async function createPayPalOrder(payload: {
  donorName: string;
  donorEmail: string;
  amount: number;
  frequency: DonationFrequency;
  currency?: string;
  message?: string;
  isAnonymous?: boolean;
}): Promise<{ orderId: string; donationId: string; isMock?: boolean }> {
  const res = await fetch(`${getApiUrl()}/donations/paypal/create-order`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to initialize PayPal order.');
  }
  return data;
}

/**
 * PayPal: Capture Order
 */
export async function capturePayPalOrder(payload: {
  orderId: string;
  donationId?: string;
}): Promise<{ success: boolean; donation: DonationData }> {
  const res = await fetch(`${getApiUrl()}/donations/paypal/capture-order`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to capture PayPal payment.');
  }
  return data;
}

/**
 * Public Receipt
 */
export async function fetchDonationReceipt(id: string): Promise<DonationData> {
  const res = await fetch(`${getApiUrl()}/donations/receipt/${id}`, {
    headers: { Accept: 'application/json' },
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Receipt not found.');
  }
  return data;
}

/**
 * Admin: List Donations
 */
export async function fetchDonationsAdmin(
  token: string,
  params?: {
    search?: string;
    status?: string;
    paymentMethod?: string;
    frequency?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }
): Promise<DonationsListResponse> {
  const url = new URL(`${getApiUrl()}/admin/donations`);
  if (params?.search) url.searchParams.set('search', params.search);
  if (params?.status) url.searchParams.set('status', params.status);
  if (params?.paymentMethod) url.searchParams.set('paymentMethod', params.paymentMethod);
  if (params?.frequency) url.searchParams.set('frequency', params.frequency);
  if (params?.startDate) url.searchParams.set('startDate', params.startDate);
  if (params?.endDate) url.searchParams.set('endDate', params.endDate);
  if (params?.page) url.searchParams.set('page', String(params.page));
  if (params?.limit) url.searchParams.set('limit', String(params.limit));

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to fetch donations.');
  }

  return res.json();
}

/**
 * Admin: Update Donation Status
 */
export async function updateDonationStatusAdmin(
  token: string,
  id: string,
  status: DonationStatus,
  notes?: string
): Promise<DonationData> {
  const res = await fetch(`${getApiUrl()}/admin/donations/${id}/status`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ status, notes }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to update donation status.');
  }

  return res.json();
}

/**
 * Admin: Delete Donation
 */
export async function deleteDonationAdmin(
  token: string,
  id: string
): Promise<{ success: boolean; message: string }> {
  const res = await fetch(`${getApiUrl()}/admin/donations/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to delete donation.');
  }

  return res.json();
}

/**
 * Admin: Export CSV
 */
export async function downloadDonationsCsv(
  token: string,
  params?: {
    search?: string;
    status?: string;
    paymentMethod?: string;
    frequency?: string;
  }
): Promise<void> {
  const url = new URL(`${getApiUrl()}/admin/donations/export`);
  if (params?.search) url.searchParams.set('search', params.search);
  if (params?.status) url.searchParams.set('status', params.status);
  if (params?.paymentMethod) url.searchParams.set('paymentMethod', params.paymentMethod);
  if (params?.frequency) url.searchParams.set('frequency', params.frequency);

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error('Failed to export donations CSV.');

  const blob = await res.blob();
  const downloadUrl = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = downloadUrl;
  a.download = `iilp-donations-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
}
