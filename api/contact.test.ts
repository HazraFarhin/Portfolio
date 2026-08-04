import { describe, it, expect, vi, beforeEach } from 'vitest';

const { sendMock } = vi.hoisted(() => ({
  sendMock: vi.fn(),
}));

vi.mock('resend', () => {
  const ResendMock = vi.fn().mockImplementation(() => ({
    emails: { send: sendMock },
  }));
  return { Resend: ResendMock };
});

import contactHandler from './contact';

// ──────────────────────────────────────────────────────────────────────────────
// Shared fixture helpers
// ──────────────────────────────────────────────────────────────────────────────

const validBody = {
  workingOn: 'A new portfolio site',
  email: 'submitter@example.com',
  clarify: 'The rollout timeline',
};

function makeRequest(method: string, body?: unknown) {
  return new Request('http://localhost/api/contact', {
    method,
    body:
      body === undefined
        ? undefined
        : typeof body === 'string'
        ? body
        : JSON.stringify(body),
  });
}

// ──────────────────────────────────────────────────────────────────────────────
// api/contact.ts fetch handler
// ──────────────────────────────────────────────────────────────────────────────

describe('contactHandler.fetch', () => {
  beforeEach(() => {
    sendMock.mockReset();
  });

  it('rejects non-POST requests with 405', async () => {
    const request = makeRequest('GET');
    const response = await contactHandler.fetch(request);
    expect(response.status).toBe(405);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it('returns 400 with { ok: false, ... } for an unparsable JSON body', async () => {
    const request = makeRequest('POST', 'not-valid-json{');
    const response = await contactHandler.fetch(request);
    expect(response.status).toBe(400);
    const json = await response.json();
    expect(json.ok).toBe(false);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it('returns 400 when workingOn is missing/empty', async () => {
    const request = makeRequest('POST', { ...validBody, workingOn: '' });
    const response = await contactHandler.fetch(request);
    expect(response.status).toBe(400);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it('returns 400 when email is missing/empty', async () => {
    const request = makeRequest('POST', { ...validBody, email: '' });
    const response = await contactHandler.fetch(request);
    expect(response.status).toBe(400);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it('returns 400 when clarify is missing/empty', async () => {
    const request = makeRequest('POST', { ...validBody, clarify: '' });
    const response = await contactHandler.fetch(request);
    expect(response.status).toBe(400);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it('returns 400 when email fails the shape regex', async () => {
    const request = makeRequest('POST', { ...validBody, email: 'not-an-email' });
    const response = await contactHandler.fetch(request);
    expect(response.status).toBe(400);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it('returns 400 when email contains an embedded newline (T-04-03 mitigation)', async () => {
    const request = makeRequest('POST', {
      ...validBody,
      email: 'submitter@example.com\nBcc: attacker@example.com',
    });
    const response = await contactHandler.fetch(request);
    expect(response.status).toBe(400);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it('returns 400 when email contains an embedded carriage return', async () => {
    const request = makeRequest('POST', {
      ...validBody,
      email: 'submitter@example.com\rBcc: attacker@example.com',
    });
    const response = await contactHandler.fetch(request);
    expect(response.status).toBe(400);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it('returns 200 with { ok: true } when Resend resolves successfully', async () => {
    sendMock.mockResolvedValue({ data: { id: 'test-id' }, error: null });
    const request = makeRequest('POST', validBody);
    const response = await contactHandler.fetch(request);
    expect(response.status).toBe(200);
    const json = await response.json();
    expect(json).toEqual({ ok: true });
  });

  it('returns 502 with { ok: false, message } when Resend returns an error', async () => {
    sendMock.mockResolvedValue({ data: null, error: { message: 'send failed' } });
    const request = makeRequest('POST', validBody);
    const response = await contactHandler.fetch(request);
    expect(response.status).toBe(502);
    const json = await response.json();
    expect(json).toEqual({ ok: false, message: 'send failed' });
  });

  it('calls resend.emails.send with hardcoded to/from on every successful-validation path (D-02 regression guard)', async () => {
    sendMock.mockResolvedValue({ data: { id: 'test-id' }, error: null });
    const request = makeRequest('POST', validBody);
    await contactHandler.fetch(request);
    expect(sendMock).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'hazrafarhinwork@gmail.com',
        from: 'onboarding@resend.dev',
      })
    );
  });
});
