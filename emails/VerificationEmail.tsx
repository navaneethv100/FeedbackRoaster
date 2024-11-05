import * as React from 'react';
import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';

interface EmailTemplateProps {
  username: string;
  otp: string;
}

export const VerificationEmail: React.FC<Readonly<EmailTemplateProps>> = ({
  username,
  otp,
}) => {
  const previewText = `Your verification code: ${otp}`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section>
            <Text style={heading}>Hello, {username}! 🔐</Text>
            <Text style={paragraph}>
              Please use the verification code below to complete your authentication:
            </Text>
            
            <Section style={otpContainer}>
              <Text style={otpCode}>{otp}</Text>
            </Section>

            <Text style={paragraph}>
              This code will expire in 10 minutes. If you didn't request this code, 
              please ignore this email.
            </Text>

            <Text style={paragraph}>
              For security reasons, never share this code with anyone.
            </Text>

            <Hr style={hr} />
            
            <Text style={footer}>
              © 2024 Your Company Name. All rights reserved. <br />
              This is an automated message, please do not reply.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
};

const heading = {
  fontSize: '24px',
  letterSpacing: '-0.5px',
  lineHeight: '1.3',
  fontWeight: '400',
  color: '#484848',
  padding: '17px 0 0',
};

const paragraph = {
  margin: '0 0 15px',
  fontSize: '16px',
  lineHeight: '1.4',
  color: '#484848',
};

const otpContainer = {
  padding: '24px 0',
  textAlign: 'center' as const,
  backgroundColor: '#f9fafb',
  borderRadius: '8px',
  margin: '16px 0',
};

const otpCode = {
  fontSize: '32px',
  fontWeight: '700',
  color: '#1a1a1a',
  letterSpacing: '8px',
  margin: '0',
};

const hr = {
  borderColor: '#e6ebf1',
  margin: '20px 0',
};

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
};

export default VerificationEmail;