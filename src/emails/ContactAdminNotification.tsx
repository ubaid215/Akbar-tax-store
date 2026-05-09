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

export interface ContactAdminNotificationProps {
  name: string
  email: string
  phone: string
  subject: string
  message: string
  submittedAt: string
}

export default function ContactAdminNotification({
  name,
  email,
  phone,
  subject,
  message,
  submittedAt,
}: ContactAdminNotificationProps) {
  return (
    <Html lang="en">
      <Head />
      <Preview>New contact form message from {name}</Preview>
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
            boxShadow: '0 4px 24px rgba(0,64,168,0.1)',
          }}
        >
          <Section style={{ backgroundColor: '#0040A8', padding: '28px 40px' }}>
            <Text
              style={{
                margin: '0',
                color: '#ffffff',
                fontSize: '22px',
                fontWeight: '700',
              }}
            >
              New contact form submission
            </Text>
            <Text style={{ margin: '8px 0 0 0', color: 'rgba(255,255,255,0.85)', fontSize: '13px' }}>
              Akbar Tax Store — {submittedAt}
            </Text>
          </Section>

          <Section style={{ padding: '32px 40px' }}>
            <Heading
              as="h2"
              style={{
                margin: '0 0 20px 0',
                color: '#0b1e3d',
                fontSize: '18px',
                fontWeight: '600',
              }}
            >
              {subject}
            </Heading>

            <Text style={{ margin: '0 0 8px 0', color: '#64748b', fontSize: '12px', fontWeight: '600' }}>
              FROM
            </Text>
            <Text style={{ margin: '0 0 16px 0', color: '#0f172a', fontSize: '15px', lineHeight: '1.5' }}>
              <strong>{name}</strong>
              <br />
              <a href={`mailto:${email}`} style={{ color: '#0040A8' }}>
                {email}
              </a>
              {phone ? (
                <>
                  <br />
                  {phone}
                </>
              ) : null}
            </Text>

            <Hr style={{ borderColor: '#e2e8f0', margin: '20px 0' }} />

            <Text style={{ margin: '0 0 8px 0', color: '#64748b', fontSize: '12px', fontWeight: '600' }}>
              MESSAGE
            </Text>
            <Text
              style={{
                margin: '0',
                color: '#334155',
                fontSize: '15px',
                lineHeight: '1.65',
                whiteSpace: 'pre-wrap',
              }}
            >
              {message}
            </Text>
          </Section>

          <Section style={{ backgroundColor: '#f8fafc', padding: '20px 40px', borderTop: '1px solid #e2e8f0' }}>
            <Text style={{ margin: '0', color: '#94a3b8', fontSize: '12px', lineHeight: '1.5' }}>
              Reply directly to this email — Reply-To is set to the visitor&apos;s address when supported by your
              mail client.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}
