import React from 'react'
import ContentPage from '@/components/FooterContent'

export default function PrivacyPolicy () {
  const privacyContent = [
    `Effective Date: [0000]`,

    `1. Introduction<br />
NAKACHI NDUMDI LLC (“we,” “our,” or “us”) recognizes the importance of protecting the privacy and security of your personal information.<br />
This Privacy Policy explains how we collect, use, disclose, and safeguard your personal data when you access or use www.nakachindumdi.com (the “Website”), communicate with us via email, phone, post, or social media, or purchase products from us.`,

    `2. How and When We Collect Your Personal Data<br />
We may collect personal data from you in several ways, including:<br />
(a) Directly from you: when you create an account, place an order through our Website, communicate with our support team, subscribe to our newsletters, or interact with us through social media.<br />
(b) Automatically: through cookies and similar technologies when you browse or interact with our Website. Please see our Cookie Policy for further details.<br />
(c) From third parties: such as payment providers, delivery partners, or publicly available sources where permitted by law.`,

    `3. What Personal Data We Collect<br />
The categories of data we may collect include:<br />
(a) Identity and Contact Information: name, email address, phone number, billing, and shipping addresses.<br />
(b) Account Information: username, password, order history, preferences, and marketing consents.<br />
(c) Payment Information: payment method and related transaction data (processed via our payment providers; we do not store full card details).<br />
(d) Technical Data: IP address, browser type, device type, operating system, and browsing behavior.<br />
(e) Communications Data: information provided in your interactions with us, including feedback, inquiries, and customer service requests.`,

    `4. How We Use Your Personal Data and Legal Basis<br />
We use your personal data for the following purposes:<br />
(a) To fulfill orders: including processing payments, shipping products, managing returns, and providing order updates.<br />
Legal basis: performance of our contract with you.<br />
(b) To provide customer support: including responding to inquiries and assisting with product or service issues.<br />
Legal basis: our legitimate interest in operating our business efficiently and providing high-quality service.<br />
(c) To improve our Website and services: including analyzing usage data, testing functionality, and developing new features.<br />
Legal basis: our legitimate interest in improving and optimizing our services.<br />
(d) To comply with legal obligations: including fraud prevention, regulatory compliance, and record-keeping.<br />
Legal basis: compliance with applicable laws.<br />
(e) For marketing and communications: where you consent, we may send you promotional emails, newsletters, or updates about our products and services.<br />
Legal basis: your consent, which may be withdrawn at any time.`,

    `5. Sharing Your Personal Data<br />
We may disclose your personal data under the following circumstances:<br />
(a) Service Providers: to third parties that support our business, including payment processors, shipping and logistics providers, IT support, analytics providers, and marketing agencies.<br />
(b) Legal and Regulatory Requirements: where disclosure is necessary to comply with law, regulation, or legal process.<br />
(c) Business Transactions: in connection with a merger, acquisition, or sale of assets, your data may be transferred as part of that transaction.<br />
(d) Group Companies: if applicable, to subsidiaries or affiliates for internal reporting, security, or business optimization.`,

    `6. Data Security and Retention<br />
(a) We implement appropriate technical, physical, and organizational safeguards to protect your personal data from unauthorized access, disclosure, or misuse.<br />
(b) While we take all reasonable precautions, no system can be guaranteed as completely secure.<br />
(c) We retain personal data only as long as necessary to fulfill the purposes outlined in this Policy, comply with legal obligations, and resolve disputes.`,

    `7. International Data Transfers<br />
If you access our website from outside the United States, please note that your personal data may be transferred to and processed in the United States.<br />
We ensure that appropriate safeguards are applied to protect your data in line with applicable legal requirements.`,

    `8. Your Rights<br />
Depending on your location, you may have the following rights in relation to your personal data:<br />
• The right to access, correct, or update your information.<br />
• The right to request deletion of your data.<br />
• The right to restrict or object to certain types of processing.<br />
• The right to withdraw consent for marketing communications.<br />
• The right to receive a portable copy of your data in a structured, machine-readable format.<br />
To exercise your rights, please contact us at support@nakachindumdi.com.<br />
We may require verification of your identity before responding to your request.`,

    `9. Changes to This Policy<br />
We may update this Privacy Policy from time to time to reflect changes in our practices, legal obligations, or other circumstances.<br />
Updates will be posted on this page with a revised “Effective Date.”`,

    `10. Contact Information<br />
If you have any questions about this Privacy Policy or how your personal data is handled, you may contact us at:<br />
NAKACHI NDUMDI LLC<br />
6900 Lenox Village Drive, Apt. 575<br />
Nashville, Tennessee 37211, USA<br />
Email: support@nakachindumdi.com`
  ]

  return (
    <div className='content-page-header'>
      <ContentPage
        title='Privacy Policy'
        content={privacyContent.map((section, index) => (
          <p key={index} dangerouslySetInnerHTML={{ __html: section }} />
        ))}
        footer={`©${new Date().getFullYear()} NAKACHI NDUMDI. All rights reserved.`}
      />
    </div>
  )
}
