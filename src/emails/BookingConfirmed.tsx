import * as React from 'react'
import {
  Html, Head, Body, Container, Section, Text, Button, Preview, Hr, Heading,
} from '@react-email/components'

interface BookingConfirmedProps {
  clientName: string
  date: string
  startTime: string
  endTime: string
  serviceName?: string
  notes?: string
  meetLink?: string
  isVirtual?: boolean
}

export function BookingConfirmed({
  clientName, date, startTime, endTime, serviceName, notes, meetLink, isVirtual,
}: BookingConfirmedProps) {
  return (
    <Html lang="en">
      <Head />
      <Preview>Your appointment with Akbar Tax Store is confirmed ✅</Preview>
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
                <span style={{ display: 'inline-block', backgroundColor: '#e8f5e9', color: '#15803d', padding: '6px 16px', borderRadius: '100px', fontSize: '13px', fontWeight: '600' }}>
                  ✅ Booking Confirmed
                </span>
              </td></tr></tbody>
            </table>

            <Heading style={{ margin: '0 0 8px 0', color: '#1a1a2e', fontSize: '24px', fontWeight: '700', fontFamily: 'Georgia, serif', lineHeight: '1.3' }}>
              Hello, {clientName}!
            </Heading>
            <Text style={{ margin: '0 0 32px 0', color: '#555555', fontSize: '15px', lineHeight: '1.6' }}>
              Your appointment has been confirmed. We look forward to serving you with the best tax and business services.
            </Text>

            {/* Details Card */}
            <table cellPadding="0" cellSpacing="0" style={{ width: '100%', backgroundColor: '#f8f9ff', borderLeft: '4px solid #0040A8', borderRadius: '0 8px 8px 0', marginBottom: '32px' }}>
              <tbody><tr><td style={{ padding: '24px' }}>
                <Text style={{ margin: '0 0 12px 0', fontSize: '11px', fontWeight: '700', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  APPOINTMENT DETAILS
                </Text>
                <table cellPadding="0" cellSpacing="0" style={{ width: '100%' }}>
                  <tbody>
                    {serviceName ? (
                      <tr>
                        <td style={{ padding: '6px 0', color: '#9ca3af', fontSize: '13px', width: '120px' }}>Service</td>
                        <td style={{ padding: '6px 0', color: '#1a1a2e', fontWeight: '600', fontSize: '14px' }}>{serviceName}</td>
                      </tr>
                    ) : null}
                    <tr>
                      <td style={{ padding: '6px 0', color: '#9ca3af', fontSize: '13px', width: '120px' }}>Date</td>
                      <td style={{ padding: '6px 0', color: '#1a1a2e', fontWeight: '600', fontSize: '14px' }}>{date}</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '6px 0', color: '#9ca3af', fontSize: '13px', width: '120px' }}>Time</td>
                      <td style={{ padding: '6px 0', color: '#1a1a2e', fontWeight: '600', fontSize: '14px' }}>{startTime} – {endTime}</td>
                    </tr>
                    {notes ? (
                      <tr>
                        <td style={{ padding: '6px 0', color: '#9ca3af', fontSize: '13px', width: '120px', verticalAlign: 'top' }}>Notes</td>
                        <td style={{ padding: '6px 0', color: '#374151', fontSize: '14px' }}>{notes}</td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </td></tr></tbody>
            </table>

            {isVirtual && meetLink ? (
              <Section>
                <table cellPadding="0" cellSpacing="0" style={{ width: '100%', backgroundColor: '#e8f0fe', borderRadius: '10px', marginBottom: '20px' }}>
                  <tbody><tr><td style={{ padding: '16px 20px' }}>
                    <Text style={{ margin: '0 0 6px 0', fontSize: '13px', fontWeight: '600', color: '#0040A8' }}>🎥 Virtual Meeting</Text>
                    <Text style={{ margin: '0', fontSize: '13px', color: '#374151' }}>
                      Your meeting will be held online via Google Meet. Click the button below to join at the scheduled time.
                    </Text>
                  </td></tr></tbody>
                </table>
                <Button href={meetLink} style={{ backgroundColor: '#0040A8', color: '#ffffff', padding: '14px 32px', borderRadius: '8px', fontWeight: '600', fontSize: '15px', textDecoration: 'none', display: 'inline-block', marginBottom: '24px' }}>
                  Join Google Meet →
                </Button>
              </Section>
            ) : (
              <table cellPadding="0" cellSpacing="0" style={{ width: '100%', backgroundColor: '#f0f9ff', borderRadius: '10px', marginBottom: '24px' }}>
                <tbody><tr><td style={{ padding: '16px 20px' }}>
                  <Text style={{ margin: '0', fontSize: '13px', color: '#374151' }}>
                    📍 <strong>In-Person Meeting</strong> — We look forward to seeing you at our office. Please arrive 5 minutes early.
                  </Text>
                </td></tr></tbody>
              </table>
            )}

            <Text style={{ margin: '0', color: '#9ca3af', fontSize: '12px', lineHeight: '1.5' }}>
              Need to reschedule? Contact us at info@akbartaxstore.com or call +92-0340-7300408.
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

export default BookingConfirmed
