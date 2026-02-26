import { NextRequest, NextResponse } from 'next/server'
import { requireRole } from '@/lib/auth/middleware'
import { getUserById, regenerateAccessCode } from '@/lib/db/queries/users'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const authCheck = await requireRole(['ADMIN'])
  if (!authCheck.authorized) return authCheck.response

  const { userId } = await params

  try {
    const user = await getUserById(userId)
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })
    if (user.role !== 'CLIENT') return NextResponse.json({ error: 'Only CLIENT users can have access codes' }, { status: 400 })

    const plainCode = await regenerateAccessCode(userId)

    // Send new code to client email
    try {
      await resend.emails.send({
        from: 'Meetech <noreply@meetech.com>',
        to: user.email,
        subject: 'Your New Meetech Client Portal Access Code',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 40px 20px;">
            <div style="background: white; border-radius: 12px; padding: 40px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
              <h2 style="color: #111; margin-bottom: 8px;">New Access Code Generated</h2>
              <p style="color: #555;">Hello ${user.name},</p>
              <p style="color: #555;">A new access code has been generated for your Meetech Client Portal account.</p>
              <div style="margin: 32px 0; text-align: center;">
                <div style="display: inline-block; background: #f0f4ff; border: 2px dashed #4f6ef7; border-radius: 12px; padding: 20px 40px;">
                  <p style="margin: 0 0 8px; font-size: 12px; color: #666; letter-spacing: 2px; text-transform: uppercase;">Your Access Code</p>
                  <p style="margin: 0; font-size: 32px; font-weight: 700; letter-spacing: 6px; color: #4f6ef7; font-family: monospace;">${plainCode}</p>
                </div>
              </div>
              <p style="color: #555; font-size: 14px;">Use this code to log in to your client portal. Do not share this code with anyone.</p>
              <a href="${process.env.NEXTAUTH_URL}/client/login" style="display: inline-block; margin-top: 16px; padding: 12px 28px; background: #4f6ef7; color: white; text-decoration: none; border-radius: 8px; font-weight: 600;">Go to Client Portal</a>
              <p style="margin-top: 32px; font-size: 12px; color: #999;">If you didn't request this, please contact your project manager.</p>
            </div>
          </div>
        `,
      })
    } catch (emailError) {
      console.error('Failed to send code email:', emailError)
    }

    return NextResponse.json({ plainCode })
  } catch (error) {
    console.error('Generate code error:', error)
    return NextResponse.json({ error: 'Failed to generate access code' }, { status: 500 })
  }
}
