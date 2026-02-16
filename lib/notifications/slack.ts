interface LeadData {
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

export async function sendSlackLeadAlert(lead: LeadData) {
  try {
    const webhookUrl = process.env.SLACK_WEBHOOK_URL

    if (!webhookUrl) {
      console.warn('SLACK_WEBHOOK_URL not configured, skipping Slack notification')
      return { success: false, error: 'Webhook URL not configured' }
    }

    const sourceInfo = lead.utmSource
      ? `${lead.utmSource} / ${lead.utmMedium || 'direct'} / ${lead.utmCampaign || 'none'}`
      : 'Direct'

    const slackMessage = {
      text: '🎯 New Lead Received',
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: '🎯 New Lead Received',
            emoji: true,
          },
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `*Name:*\n${lead.name}`,
            },
            {
              type: 'mrkdwn',
              text: `*Email:*\n${lead.email}`,
            },
          ],
        },
        ...(lead.phone || lead.company
          ? [
              {
                type: 'section',
                fields: [
                  ...(lead.phone
                    ? [
                        {
                          type: 'mrkdwn',
                          text: `*Phone:*\n${lead.phone}`,
                        },
                      ]
                    : []),
                  ...(lead.company
                    ? [
                        {
                          type: 'mrkdwn',
                          text: `*Company:*\n${lead.company}`,
                        },
                      ]
                    : []),
                ],
              },
            ]
          : []),
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `*Project Type:*\n${lead.projectType}`,
            },
            {
              type: 'mrkdwn',
              text: `*Source:*\n${sourceInfo}`,
            },
          ],
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Message:*\n${lead.message}`,
          },
        },
        {
          type: 'context',
          elements: [
            {
              type: 'mrkdwn',
              text: `Device: ${lead.deviceType} | Submitted: ${lead.createdAt.toLocaleString()}`,
            },
          ],
        },
        {
          type: 'divider',
        },
        {
          type: 'actions',
          elements: [
            {
              type: 'button',
              text: {
                type: 'plain_text',
                text: '📧 Reply via Email',
                emoji: true,
              },
              url: `mailto:${lead.email}`,
              style: 'primary',
            },
          ],
        },
      ],
    }

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(slackMessage),
    })

    if (!response.ok) {
      throw new Error(`Slack API error: ${response.status} ${response.statusText}`)
    }

    console.log('✅ Slack notification sent')
    return { success: true }
  } catch (error) {
    console.error('Error sending Slack notification:', error)
    return { success: false, error }
  }
}
