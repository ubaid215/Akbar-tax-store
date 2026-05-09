import * as React from 'react'
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Preview,
  Heading,
  Hr,
} from '@react-email/components'

export interface ClientConfirmationEmailProps {
  name: string
  subject: string
  messagePreview: string
  siteUrl?: string
}

export default function ClientConfirmationEmail({
  name,
  subject,
  messagePreview,
  siteUrl = 'https://www.akbartaxstore.com',
}: ClientConfirmationEmailProps) {
  const firstName = (name || 'there').trim().split(/\s+/)[0] || 'there'

  return (
    <Html lang="en">
      <Head />
      <Preview>We received your message — Akbar Tax Store</Preview>
      <Body
        style={{
          backgroundColor: '#f4f6fb',
          margin: '0',
          padding: '0',
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        }}
      >
        <Container
          style={{
            maxWidth: '600px',
            margin: '32px auto',
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 4px 24px rgba(0,64,168,0.08)',
          }}
        >
          <Section style={{ backgroundColor: '#0040A8', padding: '36px 40px' }}>
            <Text
              style={{
                margin: '0',
                color: '#ffffff',
                fontSize: '24px',
                fontWeight: '700',
                letterSpacing: '-0.5px',
              }}
            >
              Akbar Tax Store
            </Text>
            <Text style={{ margin: '8px 0 0 0', color: 'rgba(255,255,255,0.85)', fontSize: '14px' }}>
              Professional Tax &amp; Business Services — Pakistan
            </Text>
          </Section>

          <Section style={{ padding: '40px 40px 32px' }}>
            <Heading
              as="h1"
              style={{
                margin: '0 0 16px 0',
                color: '#0b1e3d',
                fontSize: '22px',
                fontWeight: '700',
                lineHeight: '1.3',
              }}
            >
              Thank you, {firstName}!
            </Heading>
            <Text style={{ margin: '0 0 20px 0', color: '#475569', fontSize: '16px', lineHeight: '1.6' }}>
              We have received your message and our team will get back to you as soon as possible — usually within one
              business day.
            </Text>

            <Section
              style={{
                backgroundColor: '#f8fafc',
                borderLeft: '4px solid #0040A8',
                borderRadius: '0 8px 8px 0',
                padding: '20px 24px',
                marginBottom: '24px',
              }}
            >
              <Text style={{ margin: '0 0 8px 0', color: '#64748b', fontSize: '11px', fontWeight: '700' }}>
                YOUR SUBJECT
              </Text>
              <Text style={{ margin: '0 0 16px 0', color: '#0f172a', fontSize: '15px', fontWeight: '600' }}>
                {subject}
              </Text>
              <Text style={{ margin: '0 0 8px 0', color: '#64748b', fontSize: '11px', fontWeight: '700' }}>
                MESSAGE SUMMARY
              </Text>
              <Text
                style={{
                  margin: '0',
                  color: '#475569',
                  fontSize: '14px',
                  lineHeight: '1.55',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {messagePreview}
              </Text>
            </Section>

            <Text style={{ margin: '0', color: '#64748b', fontSize: '14px', lineHeight: '1.6' }}>
              Need urgent help? Reply to this email or reach us on WhatsApp from{' '}
              <a href={siteUrl} style={{ color: '#0040A8', fontWeight: '600' }}>
                {siteUrl.replace(/^https?:\/\//, '')}
              </a>
              .
            </Text>
          </Section>

          <Hr style={{ borderColor: '#e2e8f0', margin: '0' }} />

          <Section style={{ padding: '24px 40px 32px' }}>
            <Text style={{ margin: '0', color: '#94a3b8', fontSize: '12px', lineHeight: '1.5', textAlign: 'center' }}>
              © {new Date().getFullYear()} Akbar Tax Store · Faisalabad, Pakistan
              <br />
              This is an automated confirmation — please do not reply if your mailbox does not support replies to
              noreply addresses.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}
