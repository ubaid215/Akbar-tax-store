import * as React from 'react'
import {
  Html, Head, Body, Container, Section, Text, Button, Preview, Hr, Heading,
} from '@react-email/components'

interface BookingRejectedProps {
  clientName: string
  date: string
  startTime: string
  customMessage?: string
}

export function BookingRejected({ clientName, date, startTime, customMessage }: BookingRejectedProps) {
  const bookingUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://akbartaxstore.com'}/booking`

  return (
    <Html lang="en">
      <Head />
      <Preview>Regarding your booking request — Akbar Tax Store</Preview>
      <Body style={{ backgroundColor: '#f7f7f2', margin: '0', padding: '0', fontFamily: 'sans-serif' }}>
        <Container style={{ maxWidth: '600px', margin: '40px auto', backgroundColor: '#ffffff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,64,168,0.08)' }}>

          {/* Header */}
          <Section style={{ backgroundColor: '#0040A8', padding: '40px 48px' }}>
            <Text style={{ margin: '0 0 4px 0', color: '#ffffff', fontSize: '26px', fontWeight: '700', fontFamily: 'Georgia, serif', letterSpacing: '-0.5px', lineHeight: '1' }}>
              Akbar Tax Store
            </Text>
            <Text style={{ margin: '0', color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>
              Professional Tax &amp; Business Services
            </Text>
          </Section>

          {/* Content */}
          <Section style={{ padding: '48px 48px 32px' }}>
            <table cellPadding="0" cellSpacing="0" style={{ marginBottom: '24px' }}>
              <tbody><tr><td>
                <span style={{ display: 'inline-block', backgroundColor: '#f3f4f6', color: '#6b7280', padding: '6px 16px', borderRadius: '100px', fontSize: '13px', fontWeight: '600' }}>
                  📋 Booking Update
                </span>
              </td></tr></tbody>
            </table>

            <Heading style={{ margin: '0 0 8px 0', color: '#1a1a2e', fontSize: '24px', fontWeight: '700', fontFamily: 'Georgia, serif', lineHeight: '1.3' }}>
              Hello, {clientName}
            </Heading>
            <Text style={{ margin: '0 0 24px 0', color: '#555555', fontSize: '15px', lineHeight: '1.7' }}>
              {customMessage
                ? customMessage
                : `Thank you for reaching out to us. Unfortunately, we're unable to accommodate your booking request for ${date} at ${startTime} at this time. We sincerely apologize for any inconvenience this may cause.`
              }
            </Text>

            {/* Soft info card */}
            <table cellPadding="0" cellSpacing="0" style={{ width: '100%', backgroundColor: '#fafafa', borderLeft: '4px solid #d1d5db', borderRadius: '0 8px 8px 0', marginBottom: '32px' }}>
              <tbody><tr><td style={{ padding: '20px 24px' }}>
                <Text style={{ margin: '0 0 6px 0', fontSize: '13px', color: '#6b7280' }}>
                  <strong style={{ color: '#374151' }}>Requested date:</strong> {date} at {startTime}
                </Text>
                <Text style={{ margin: '0', fontSize: '13px', color: '#6b7280' }}>
                  We hope to find a time that works for both of us.
                </Text>
              </td></tr></tbody>
            </table>

            <Text style={{ margin: '0 0 24px 0', color: '#555555', fontSize: '15px', lineHeight: '1.7' }}>
              We would love to serve you — please feel free to book another slot at a time that suits you best.
            </Text>

            <Button href={bookingUrl} style={{ backgroundColor: '#0040A8', color: '#ffffff', padding: '14px 32px', borderRadius: '8px', fontWeight: '600', fontSize: '15px', textDecoration: 'none', display: 'inline-block', marginBottom: '32px' }}>
              Book Another Slot →
            </Button>

            <Text style={{ margin: '0', color: '#9ca3af', fontSize: '13px', lineHeight: '1.6' }}>
              We hope to serve you soon. If you have any questions, reach us at info@akbartaxstore.com or +92-0340-7300408.
            </Text>
          </Section>

          {/* Signature */}
          <Section style={{ padding: '0 48px 32px' }}>
            <Hr style={{ borderColor: '#e8e8e0', margin: '0 0 24px 0' }} />
            <table cellPadding="0" cellSpacing="0">
              <tbody><tr>
                <td style={{ verticalAlign: 'middle' }}>
                  <table cellPadding="0" cellSpacing="0" style={{ backgroundColor: '#0040A8', borderRadius: '50%', width: '44px', height: '44px' }}>
                    <tbody><tr><td style={{ width: '44px', height: '44px', textAlign: 'center', verticalAlign: 'middle' }}>
                      <span style={{ color: '#ffffff', fontSize: '20px', fontWeight: '700', fontFamily: 'Georgia, serif' }}>A</span>
                    </td></tr></tbody>
                  </table>
                </td>
                <td style={{ paddingLeft: '14px', verticalAlign: 'middle' }}>
                  <Text style={{ margin: '0 0 2px 0', fontWeight: '700', fontSize: '14px', color: '#1a1a2e' }}>Akbar Tax Store Team</Text>
                  <Text style={{ margin: '0 0 2px 0', fontSize: '12px', color: '#6b7280' }}>Professional Tax &amp; Business Services</Text>
                  <Text style={{ margin: '0', fontSize: '12px', color: '#6b7280' }}>info@akbartaxstore.com · +92-0340-7300408</Text>
                </td>
              </tr></tbody>
            </table>
          </Section>

          {/* Footer */}
          <Section style={{ backgroundColor: '#f8f9ff', padding: '20px 48px', borderTop: '1px solid #e8e8e0' }}>
            <Text style={{ margin: '0', color: '#9ca3af', fontSize: '12px' }}>
              © 2026 Akbar Tax Store · P 82/3 ALFAYYAZ Colony, Street No 4 Satiana Road, Faisalabad, Pakistan
            </Text>
          </Section>

        </Container>
      </Body>
    </Html>
  )
}

export default BookingRejected
