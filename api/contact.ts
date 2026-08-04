import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface ContactBody {
  workingOn?: string;
  email?: string;
  clarify?: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidContactBody(
  body: ContactBody
): body is { workingOn: string; email: string; clarify: string } {
  const { workingOn, email, clarify } = body;

  if (!workingOn?.trim() || !email?.trim() || !clarify?.trim()) {
    return false;
  }

  // T-04-03 mitigation: `email` is interpolated into the subject line below,
  // so reject embedded newlines defensively even though Resend's JSON API
  // fields structurally prevent classic SMTP header injection.
  if (/[\r\n]/.test(email)) {
    return false;
  }

  return EMAIL_PATTERN.test(email);
}

export default {
  async fetch(request: Request): Promise<Response> {
    if (request.method !== 'POST') {
      return new Response('Method Not Allowed', { status: 405 });
    }

    let body: ContactBody;
    try {
      body = await request.json();
    } catch {
      return Response.json(
        { ok: false, message: 'Invalid request body' },
        { status: 400 }
      );
    }

    if (!isValidContactBody(body)) {
      return Response.json(
        { ok: false, message: 'Missing or invalid fields' },
        { status: 400 }
      );
    }

    const { workingOn, email, clarify } = body;

    const { error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'hazrafarhinwork@gmail.com',
      subject: `New brief from ${email}`,
      text: `What are you working on?\n${workingOn}\n\nReach me at: ${email}\n\nWhat needs to become clearer?\n${clarify}`,
    });

    if (error) {
      return Response.json(
        { ok: false, message: error.message },
        { status: 502 }
      );
    }

    return Response.json({ ok: true }, { status: 200 });
  },
};
