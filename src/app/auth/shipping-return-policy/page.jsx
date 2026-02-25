import React from 'react'
import ContentPage from '@/components/FooterContent'

export default function ShippingReturnsPolicy () {
  const shippingReturnsContent = [
    `This Shipping & Returns Policy (“Policy”) forms part of the Terms & Conditions of NAKACHI NDUMDI LLC. By purchasing from www.nakachindumdi.com, you agree to be bound by this Policy.`,

    `1.1 Ready-to-wear products shall generally be dispatched within three (3) to seven (7) business days following order confirmation and receipt of payment. Custom-tailored and reserved items are placed into production immediately upon confirmation and may require additional time for completion. Estimated production times shall be communicated at the time of order or via email notification.`,

    `1.2 All deliveries shall be carried out by third-party courier services selected by the Company, at its sole discretion. Delivery times may vary by location. The Company shall not be liable for delays arising from carriers, customs clearance, or circumstances beyond its reasonable control.`,

    `1.3 Unless otherwise stated, product prices listed on the Website include standard delivery charges. Any duties, taxes, or customs charges applicable at the delivery destination shall be borne solely by the Customer.`,

    `1.4 The Customer shall ensure that someone is available at the delivery address to accept the order. Risk of loss or damage shall transfer to the Customer upon delivery to the address specified at checkout.`,

    `2.1 Customers may return eligible products within fourteen (14) calendar days of delivery. Returned products must be in original condition: unworn, unused, unaltered, with all original packaging, tags, and accessories intact. The following products are non-returnable: (i) custom-tailored or made-to-measure items produced to Customer specifications; (ii) personalized or altered products; (iii) underwear, swimwear, or similar items where hygiene seals have been removed or tampered with.`,

    `2.2 Customers must submit a return request through their online account associated with the order. Upon approval, the Customer shall receive return instructions and a prepaid shipping label. Products must be securely packaged, preferably in the original shipping box, and the return label affixed clearly. Products not returned in the required condition may be refused or refunded at a reduced value.`,

    `2.3 Refunds shall be issued to the original payment method within fourteen (14) calendar days of receipt and inspection of the returned product. Refunds shall include the purchase price and outbound shipping costs, subject to deductions for diminished value caused by improper handling. Refunds may take up to seven (7) business days to appear, depending on the Customer’s payment provider.`,

    `3.1 Reservations require payment of fifty percent (50%) of the purchase price as a non-refundable deposit (“Initial Payment”).`,

    `3.2 The balance shall be due within fourteen (14) calendar days of issuance of a Completion Notice confirming that the reserved product has been finalized.`,

    `3.3 The Initial Payment shall be refundable only if the Customer cancels the reservation prior to commencement of tailoring. Once tailoring has commenced, the Initial Payment shall be forfeited, though the Customer shall not be liable for the remaining balance.`,

    `3.4 Failure to complete the balance within fourteen (14) days of the Completion Notice shall result in forfeiture of the reservation. The reserved item shall thereafter be released for sale to other customers, and the Initial Payment shall not be refunded.`,

    `3.5 Reserved products may be returned within fourteen (14) days of delivery, subject to strict compliance with Clause 2. Notwithstanding the foregoing, items tailored in accordance with Customer measurements or specifications shall be deemed final sale and non-returnable.`,

    `4.1 Customers retain all statutory rights in relation to faulty or misdescribed products.`,

    `4.2 Customers must notify the Company promptly of any defect or error and return the affected product in accordance with the return procedure.`,

    `4.3 Following inspection, the Customer shall be entitled to a full refund or replacement. Refunds shall be processed within fourteen (14) calendar days of receipt of the faulty product.`,

    `5.1 All inquiries regarding shipping or returns may be directed to:
    • Email: support@nakachindumdi.com
    • Phone: 000-000-0000`
  ]

  return (
    <div className='content-page-header'>
      <ContentPage
        title='Shipping & Returns Policy'
        content={shippingReturnsContent}
        footer={`©${new Date().getFullYear()} NAKACHI NDUMDI. All rights reserved.`}
      />
    </div>
  )
}
