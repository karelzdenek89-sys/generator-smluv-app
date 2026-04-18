import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { name, email, subject, message } = await req.json();

  if (!name || !email || !message) {
    return NextResponse.json({ error: 'Vyplňte povinná pole.' }, { status: 400 });
  }

  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    return NextResponse.json({ error: 'Interní chyba serveru.' }, { status: 500 });
  }

  const body = `
Nová zpráva z kontaktního formuláře SmlouvaHned.cz

Jméno: ${name}
E-mail: ${email}
Předmět: ${subject || '(nevyplněno)'}

Zpráva:
${message}
  `.trim();

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'SmlouvaHned <noreply@smlouvahned.cz>',
      to: ['info@smlouvahned.cz'],
      reply_to: email,
      subject: `[Kontakt] ${subject || name}`,
      text: body,
    }),
  });

  if (!res.ok) {
    return NextResponse.json({ error: 'Zprávu se nepodařilo odeslat.' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
