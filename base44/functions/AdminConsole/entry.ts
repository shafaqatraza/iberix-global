import { createClientFromRequest } from 'npm:@base44/sdk@0.8.48';
import { secrets } from 'base44:runtime';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const { action } = body;

    // --- LOGIN: verify credentials, generate OTP, email it ---
    if (action === 'login') {
      const { username, password } = body;
      const adminUser = secrets.get("ADMIN_USERNAME");
      const adminPass = secrets.get("ADMIN_PASSWORD");
      const otpEmail = secrets.get("ADMIN_OTP_EMAIL");

      if (!adminUser || !adminPass || !otpEmail) {
        return Response.json(
          { error: "Admin credentials not configured. Set ADMIN_USERNAME, ADMIN_PASSWORD, and ADMIN_OTP_EMAIL secrets." },
          { status: 503 }
        );
      }

      if (username !== adminUser || password !== adminPass) {
        return Response.json({ error: "Invalid credentials" }, { status: 401 });
      }

      const otp = String(Math.floor(100000 + Math.random() * 900000));
      const sessionId = crypto.randomUUID();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

      await base44.asServiceRole.entities.AdminSession.create({
        session_id: sessionId,
        otp_code: otp,
        purpose: "otp",
        expires_at: expiresAt,
        used: false
      });

      await base44.asServiceRole.integrations.Core.SendEmail({
        to: otpEmail,
        subject: "Iberix Ops Console — Access Code",
        body: `Your one-time access code is: ${otp}\n\nIt expires in 10 minutes.\n\nIf you did not request this code, ignore this email.`
      });

      return Response.json({ otpSent: true, sessionId });
    }

    // --- VERIFY: check OTP, issue session token ---
    if (action === 'verify') {
      const { sessionId, otp } = body;

      const sessions = await base44.asServiceRole.entities.AdminSession.filter({
        session_id: sessionId,
        purpose: "otp",
        used: false
      });

      if (!sessions || sessions.length === 0) {
        return Response.json({ error: "Invalid or expired session" }, { status: 401 });
      }

      const session = sessions[0];
      if (new Date() > new Date(session.expires_at)) {
        return Response.json({ error: "OTP expired. Please try again." }, { status: 401 });
      }

      if (session.otp_code !== String(otp)) {
        return Response.json({ error: "Invalid OTP code" }, { status: 401 });
      }

      await base44.asServiceRole.entities.AdminSession.update(session.id, { used: true });

      const sessionToken = crypto.randomUUID();
      const sessionExpires = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

      await base44.asServiceRole.entities.AdminSession.create({
        session_id: sessionToken,
        purpose: "session",
        expires_at: sessionExpires,
        used: false
      });

      return Response.json({ sessionToken });
    }

    // --- LEADS: verify session token, return leads ---
    if (action === 'leads') {
      const { sessionToken } = body;

      const sessions = await base44.asServiceRole.entities.AdminSession.filter({
        session_id: sessionToken,
        purpose: "session",
        used: false
      });

      if (!sessions || sessions.length === 0) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
      }

      if (new Date() > new Date(sessions[0].expires_at)) {
        return Response.json({ error: "Session expired" }, { status: 401 });
      }

      const leads = await base44.asServiceRole.entities.Lead.list('-created_date', 500);
      return Response.json({ leads });
    }

    // --- LOGOUT: invalidate session ---
    if (action === 'logout') {
      const { sessionToken } = body;
      const sessions = await base44.asServiceRole.entities.AdminSession.filter({
        session_id: sessionToken,
        purpose: "session",
        used: false
      });
      if (sessions && sessions.length > 0) {
        await base44.asServiceRole.entities.AdminSession.update(sessions[0].id, { used: true });
      }
      return Response.json({ success: true });
    }

    return Response.json({ error: "Unknown action" }, { status: 400 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}