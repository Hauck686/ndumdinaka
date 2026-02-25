import ContentPage from '@/components/FooterContent'
import React from 'react'

export default function TermsPage () {
  const termsContent = [
    `These Terms and Conditions (“Terms”) govern the sale of products through www.nakachindumdi.com (the “Website”) operated by NAKACHI NDUMDI LLC (“Company,” “we,” “us,” or “our”). By placing an order, you (“you,” “your,” or the “Customer”) agree to be bound by these Terms.`,

    `1. Company Information<br />
  1.1 The Website is operated by NAKACHI NDUMDI LLC, a limited liability company organized under the laws of the State of Tennessee, United States.<br />
  1.2 Head Office: 6900 Lenox Village Drive, Apt. 575, Nashville, Tennessee 37211, USA.<br />
  1.3 Contact Information:<br />
  • Email: support@nakachindumdi.com<br />
  • Phone: 000-000-0000`,

    `2. Ordering<br />
  2.1 Orders may only be placed through the Website.<br />
  2.2 The Customer shall provide full and accurate details when placing an order, including name, address, telephone number, email, and payment details. We may request additional information to validate an order. The Customer bears sole responsibility for ensuring all details are accurate.<br />
  2.3 Orders may not be placed if the Customer:<br />
  (a) is under eighteen (18) years of age;<br />
  (b) does not hold a valid debit or credit card, or otherwise lacks authorization to use an accepted payment method; or<br />
  (c) is unable to accept delivery at the designated address.<br />
  2.4 We reserve the right, in our sole discretion, to reject or cancel any order for any reason, including but not limited to product unavailability, delivery restrictions, or suspected fraudulent activity.<br />
  2.5 An acknowledgment email confirming receipt of an order does not constitute acceptance. Acceptance shall occur only upon issuance of an order confirmation email (“Confirmation”), at which point a binding contract shall arise.<br />
  2.6 If an order includes multiple products and some are unavailable, we may fulfill the order in part. The Customer shall not be entitled to cancel the entire order on this basis.<br />
  2.7 The Customer may request cancellation or correction of an order prior to issuance of the Confirmation. After Confirmation, orders shall be deemed final and binding, as production or dispatch commences immediately.`,

    `3. Products<br />
  3.1 Products are supplied strictly for personal, non-commercial use. Resale, redistribution, or use for commercial purposes, including listing on third-party marketplaces, is strictly prohibited.<br />
  3.2 While we endeavor to display products, materials, and colors accurately, variations may occur due to device settings, natural differences in materials, or artisanal craftsmanship. Such variations shall not constitute defects.<br />
  3.3 Certain products may be available exclusively online and in limited quantities. Returns and exchanges shall be governed strictly by the Company’s Return Policy.`,

    `4. Payments<br />
  4.1 All prices are denominated in United States Dollars (USD).<br />
  4.2 Where payment is made in another currency, the exchange rate and fees of the Customer’s payment provider shall apply. The Company shall not be liable for fluctuations, charges, or commissions.<br />
  4.3 Prices may change from time to time, but such changes shall not affect confirmed orders, save in the event of manifest pricing errors.<br />
  4.4 All prices include applicable delivery charges, unless otherwise stated.<br />
  4.5 In the event of a pricing error, we shall notify the Customer. The Customer may elect either to proceed at the correct price or to cancel. If the Customer cannot be contacted, the affected order shall be cancelled without liability.<br />
  4.6 Title to products shall not pass until full payment has been received by the Company. No product shall be dispatched until cleared funds are received.`,

    `5. Custom Tailoring<br />
  5.1 Custom-tailored products shall be manufactured strictly in accordance with measurements supplied by the Customer.<br />
  5.2 The Customer bears sole responsibility for the accuracy and completeness of all measurements submitted.<br />
  5.3 We may, but are under no obligation to, contact the Customer if inconsistencies are detected. Failure to identify inaccuracies shall not give rise to liability.<br />
  5.4 The Company shall bear no liability for fit issues arising from inaccurate or incomplete measurements.<br />
  5.5 Alterations or remakes necessitated by incorrect measurements shall be at the Customer’s sole cost.<br />
  5.6 Custom-tailored orders are final sale and shall not be eligible for return, refund, or exchange.`,

    `6. Reservations<br />
  6.1 Certain products may only be obtained by reservation. To confirm a reservation, the Customer shall remit fifty percent (50%) of the purchase price as a non-refundable deposit (“Initial Payment”).<br />
  6.2 Upon completion of the reserved product, the Customer shall be notified in writing (“Completion Notice”). The remaining balance shall be due within fourteen (14) calendar days.<br />
  6.3 The Initial Payment shall be refundable only if the Customer cancels prior to commencement of tailoring. Where tailoring has commenced or been completed, cancellation shall result in forfeiture of the Initial Payment, though no further sums shall be due.<br />
  6.4 If the Customer fails to remit the balance within fourteen (14) days of the Completion Notice, the reservation shall be deemed forfeited. The reserved product shall be released for sale, and the Initial Payment shall not be refunded.<br />
  6.5 Reserved products may be returned within fourteen (14) days of delivery, subject to strict compliance with the Company’s Return Policy. Notwithstanding the foregoing, items produced in accordance with the Customer’s own specifications, measurements, or instructions are final sale and non-returnable.<br />
  6.6 Reservation slots are limited and allocated strictly on a first-come, first-served basis. Once forfeited, a slot cannot be reinstated.`,

    `7. Returns<br />
  7.1 Change of Mind<br />
  (a) Customers may cancel prior to Confirmation without charge.<br />
  (b) Following Confirmation, products (excluding custom-made or personalized items, or underwear/swimwear without hygiene seals) may be returned within fourteen (14) days of delivery.<br />
  (c) Refunds shall include the purchase price and outbound delivery costs, subject to deductions for diminished value caused by handling beyond what is necessary to establish the product’s nature and quality.<br />
  7.2 Faulty or Misdescribed Products<br />
  Customers retain all statutory rights in respect of faulty or misdescribed goods. Such products must be reported promptly and returned in accordance with the Return Policy. Refunds shall be processed within fourteen (14) days of inspection.<br />
  7.3 For more information on returns, please refer to our “Shipping and Returns” section.`,

    `8. Return Policy (Procedure)<br />
  8.1 All returns must follow the procedures outlined on the Website. Products must be returned in original condition, unworn, unused, unaltered, with all packaging, tags, and accessories intact.<br />
  8.2 Failure to comply with the return procedure or to return within the stated deadlines may result in refusal of the return and denial of any refund.<br />
  8.3 The Company provides a complimentary returns service. If the Customer elects not to use this service, the Customer assumes all costs and risks, including customs duties and taxes.<br />
  8.4 If a return cannot be accepted, the product shall be returned to the Customer at the Customer’s expense, except as otherwise required by law.`,

    `9. Right to Cancel by the Company<br />
  9.1 We reserve the right to cancel any order, in full or in part, if:<br />
  (a) the Customer is in breach of these Terms or applicable law;<br />
  (b) delivery cannot be completed within a reasonable timeframe;<br />
  (c) payment authorization fails;<br />
  (d) fulfillment is impossible due to events beyond our control; or<br />
  (e) fraudulent or suspicious activity is suspected.<br />
  9.2 Where cancellation occurs, the Customer shall be refunded for undelivered products, subject to deductions for costs incurred due to Customer’s breach.<br />
  9.3 In cases of fraud, commercial reselling, or material breach, we reserve the right to close any Customer account and refuse future orders.`,

    `10. Liability<br />
  10.1 Our liability shall be limited to direct losses arising from our breach of contract or negligence, capped at the total amount paid by the Customer for the order.<br />
  10.2 We shall not be liable for:<br />
  (a) indirect or consequential losses;<br />
  (b) losses that were not reasonably foreseeable at the time of contract;<br />
  (c) losses caused by events beyond our reasonable control; or<br />
  (d) business-related losses, as products are intended for consumers only.`,

    `11. General<br />
  11.1 These Terms are binding upon the Customer and the Company, and upon their respective successors and assigns. The Customer may not assign rights or obligations without our prior written consent.<br />
  11.2 A delay or failure to exercise any right under these Terms shall not constitute a waiver.<br />
  11.3 If any provision is deemed unlawful or unenforceable, the remaining provisions shall remain in full force and effect.<br />
  11.4 We reserve the right to amend these Terms from time to time. The version applicable to your order shall be the one in effect at the time of Confirmation, unless amendment is required by law or notified to you prior to Confirmation.`,

    `12. Governing Law & Jurisdiction<br />
  12.1 These Terms, and any dispute or claim (including non-contractual disputes or claims) arising out of or in connection with them, shall be governed by and construed in accordance with the laws of the State of Tennessee, United States, without regard to its conflict of law provisions.<br />
  12.2 The courts of Davidson County, Tennessee, shall have exclusive jurisdiction to settle any dispute or claim arising out of or in connection with these Terms, the Website, or any products purchased through it.`
  ]

  return (
    <div className='content-page-header'>
      <ContentPage
        title='Terms & Conditions'
        content={termsContent.map((section, index) => (
          <p key={index} dangerouslySetInnerHTML={{ __html: section }} />
        ))}
        footer={`©${new Date().getFullYear()} NAKACHI NDUMDI. All rights reserved.`}
      />
    </div>
  )
}
