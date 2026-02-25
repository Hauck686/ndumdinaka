import React from 'react'
import ContentPage from '@/components/FooterContent'

export default function CookiePolicy () {
  const cookieContent = [
    `Last Updated: [00000]`,

    `NAKACHI NDUMDI LLC (“NAKACHI NDUMDI,” “we,” “us,” or “our”) is committed to being transparent about the technologies we use to collect and process information when you access or interact with www.nakachindumdi.com (the “Website”).`,

    `This Cookie Policy explains what cookies are, how and why we use them, and the rights you have in relation to their use.<br />
By continuing to browse or use our Website, you agree to the placement and use of cookies as described in this Policy, unless you have disabled them through your browser or device settings.`,

    `1. What Are Cookies?<br />
Cookies are small text files placed on your computer, mobile phone, or other device when you access our Website.<br />
They allow us to recognize your device, remember your preferences, and track your interaction with our Website for security, functionality, and marketing purposes.<br />
Cookies do not harm your device, and most contain only anonymous information such as a unique identifier.`,

    `2. Categories of Cookies Used:<br />
(a) Essential Cookies: Necessary for the operation of the Website, including secure login, order processing, and core functionality. Without these cookies, services you request cannot be provided.<br />
(b) Preference Cookies: Allow the Website to remember user settings (such as region or language) and tailor the Website accordingly.<br />
(c) Analytics and Performance Cookies: Collect aggregated data on Website usage, traffic, and performance in order to improve functionality and navigation.<br />
(d) Advertising and Targeting Cookies: May be set by us or by third-party partners to deliver advertising relevant to your interests and measure the effectiveness of such advertising.<br />
(e) Unclassified Cookies: Cookies that are deployed but have not yet been categorized with their providers.`,

    `3. Third-Party Cookies:<br />
(a) Certain cookies may be placed by third parties, including payment processors, analytics providers, or marketing partners.<br />
(b) These third parties may collect information about your online activities across different websites.<br />
(c) We are not responsible for the operation of third-party cookies, which are governed by the third party’s own privacy and cookie policies.`,

    `4. Management of Cookies:<br />
(a) You may control or disable cookies through your browser or device settings at any time.<br />
(b) Disabling certain cookies may affect the Website’s functionality and limit your ability to use specific features, including purchasing products.<br />
(c) When you first visit the Website, you will be presented with the option to manage your cookie preferences.`,

    `5. Relationship to Privacy Policy:<br />
(a) This Cookie Policy must be read together with our Privacy Policy.<br />
(b) The Privacy Policy explains in greater detail how we collect, use, and protect your personal information.`,

    `6. Amendments:<br />
(a) We reserve the right to update or amend this Cookie Policy at any time.<br />
(b) Changes will be posted on this page with an updated “Effective Date.”`,

    `7. Contact Information:<br />
If you have any questions about this Cookie Policy or our use of cookies, you may contact us at:<br />
support@nakachindumdi.com.`
  ]

  return (
    <ContentPage
      title='Cookie Policy'
      content={cookieContent.map((section, index) => (
        <p key={index} dangerouslySetInnerHTML={{ __html: section }} />
      ))}
      footer={`©${new Date().getFullYear()} NAKACHI NDUMDI. All rights reserved.`}
    />
  )
}
