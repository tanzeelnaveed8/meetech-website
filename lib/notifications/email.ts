import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

interface LeadNotificationData {
  name: string
  email: string
  phone?: string
  company?: string
  projectType: string
  message: string
  source?: string
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  deviceType: string
  createdAt: Date
}

export async function sendLeadNotification(lead: LeadNotificationData) {
  try {
    const sourceInfo = lead.utmSource
      ? `${lead.utmSource} / ${lead.utmMedium || 'direct'} / ${lead.utmCampaign || 'none'}`
      : 'Direct'

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #2563eb; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: #4b5563; }
            .value { color: #1f2937; }
            .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2 style="margin: 0;">🎯 New Lead Received</h2>
            </div>
            <div class="content">
              <div class="field">
                <span class="label">Name:</span>
                <span class="value">${lead.name}</span>
              </div>
              <div class="field">
                <span class="label">Email:</span>
                <span class="value"><a href="mailto:${lead.email}">${lead.email}</a></span>
              </div>
              ${lead.phone ? `
              <div class="field">
                <span class="label">Phone:</span>
                <span class="value">${lead.phone}</span>
              </div>
              ` : ''}
              ${lead.company ? `
              <div class="field">
                <span class="label">Company:</span>
                <span class="value">${lead.company}</span>
              </div>
              ` : ''}
              <div class="field">
                <span class="label">Project Type:</span>
                <span class="value">${lead.projectType}</span>
              </div>
              <div class="field">
                <span class="label">Message:</span>
                <div class="value" style="white-space: pre-wrap; background: white; padding: 10px; border-radius: 4px; margin-top: 5px;">${lead.message}</div>
              </div>
              <div class="field">
                <span class="label">Source:</span>
                <span class="value">${sourceInfo}</span>
              </div>
              <div class="field">
                <span class="label">Device:</span>
                <span class="value">${lead.deviceType}</span>
              </div>
              <div class="field">
                <span class="label">Submitted:</span>
                <span class="value">${lead.createdAt.toLocaleString()}</span>
              </div>
            </div>
            <div class="footer">
              <p>This is an automated notification from MEETECH website contact form.</p>
            </div>
          </div>
        </body>
      </html>
    `

    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'noreply@meetech.com',
      to: ['sales@meetech.com'], // Configure recipient email
      subject: `New Lead: ${lead.name} - ${lead.projectType}`,
      html: emailHtml,
    })

    if (error) {
      console.error('Failed to send email notification:', error)
      throw error
    }

    console.log('✅ Email notification sent:', data?.id)
    return { success: true, id: data?.id }
  } catch (error) {
    console.error('Error sending email notification:', error)
    return { success: false, error }
  }
}
