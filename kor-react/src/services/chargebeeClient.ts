// Frontend client to call backend proxy endpoints for pause/resume
// The backend holds the Chargebee API key. This client does NOT expose secrets.

export interface PauseSubscriptionRequest {
  subscriptionId: string;
  pauseOption: 'SPECIFIC_DATE' | 'IMMEDIATELY';
  pauseDate?: number;   // Unix seconds (required for SPECIFIC_DATE)
  resumeDate: number;   // Unix seconds (always required)
}

export interface ResumeSubscriptionRequest {
  subscriptionId: string;
  resumeDate?: number;   // Unix seconds (optional - if not provided, resumes immediately)
}

function getBaseUrl(): string {
  return process.env.REACT_APP_API_BASE_URL || 'https://jmrcycling.com:3001';
}

function getBackendAuth(): string {
  // Follow existing pattern used by other endpoints
  return process.env.REACT_APP_API_AUTH_TOKEN || '1893784827439273928203838';
}

async function parseOrThrow(resp: Response): Promise<any> {
  const text = await resp.text().catch(() => '');
  let data: any = null;
  try { data = text ? JSON.parse(text) : null; } catch {}

  if (!resp.ok) {
    const msg = data?.error || data?.message || text || `HTTP ${resp.status}`;
    throw new Error(typeof msg === 'string' ? msg : 'Request failed');
  }
  return data ?? {};
}

export async function pauseSubscription(req: PauseSubscriptionRequest): Promise<any> {
  const baseUrl = getBaseUrl();
  const headers: Record<string, string> = {
    'Content-Type': 'application/x-www-form-urlencoded'
  };

  const body = new URLSearchParams({
    auth: getBackendAuth(),
    subscription_id: String(req.subscriptionId),
    pause_option: req.pauseOption,
    resume_date: String(req.resumeDate)
  });
  
  // Only add pause_date for SPECIFIC_DATE option
  if (req.pauseOption === 'SPECIFIC_DATE' && req.pauseDate) {
    body.set('pause_date', String(req.pauseDate));
  }

  const resp = await fetch(`${baseUrl}/pauseChargebeeSubscription`, {
    method: 'POST',
    headers,
    body: body as unknown as BodyInit
  });
  return parseOrThrow(resp);
}

export async function resumeSubscription(req: ResumeSubscriptionRequest): Promise<any> {
  const baseUrl = getBaseUrl();
  const headers: Record<string, string> = {
    'Content-Type': 'application/x-www-form-urlencoded'
  };

  const body = new URLSearchParams({
    auth: getBackendAuth(),
    subscription_id: String(req.subscriptionId)
  });
  
  // Add resume_date if provided, otherwise set to 0 or current timestamp for immediate resume
  if (req.resumeDate !== undefined) {
    body.set('resume_date', String(req.resumeDate));
  } else {
    // For immediate resume, use current timestamp
    const nowSec = Math.floor(Date.now() / 1000);
    body.set('resume_date', String(nowSec));
  }

  const resp = await fetch(`${baseUrl}/resumeChargebeeSubscription`, {
    method: 'POST',
    headers,
    body: body as unknown as BodyInit
  });
  return parseOrThrow(resp);
}
