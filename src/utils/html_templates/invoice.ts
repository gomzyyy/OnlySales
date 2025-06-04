import {Customer, Owner, SoldProduct} from '../../../types';

export type SoldProductInvoiceHTMLProps = {
  invoiceId: string;
  date: string;
  customer: Customer;
  soldProducts: SoldProduct[];
  owner: Owner;
};

const generateInvoiceHTML = ({
  invoiceId,
  date,
  customer,
  soldProducts,
  owner,
}: SoldProductInvoiceHTMLProps) => {
  let totalAmount = 0;

  const isPaid = soldProducts[0]?.state === 'PAID';
  const title = isPaid ? 'Bill' : 'Invoice';

  const formatter = new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  const productRows = soldProducts
    .map((item, index) => {
      const unitPrice = item.product.discountedPrice ?? item.product.basePrice;
      const quantityLabel = `${item.count} ${
        item.product.measurementTypeDescription || item.product.measurementType
      }`;
      const subtotal = unitPrice * item.count;
      totalAmount += subtotal;

      const formattedDate = formatter.format(new Date(item.createdAt));

      return `
        <tr>
          <td>${index + 1}</td>
          <td>
            <strong>${item.product.name}</strong><br/>
            <span class="details">${quantityLabel} × ₹${unitPrice.toFixed(
        2,
      )}</span><br/>
            <span class="timestamp">Sold on: ${formattedDate}</span>
          </td>
          <td>${quantityLabel}</td>
          <td>₹${unitPrice.toFixed(2)}</td>
          <td>₹${subtotal.toFixed(2)}</td>
        </tr>
      `;
    })
    .join('');

  return `
    <html>
      <head>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            padding: 30px;
            font-size: 14px;
            color: #333;
            background-color: #fff;
            line-height: 1.6;
          }
          h1 {
            text-align: center;
            font-size: 28px;
            margin-bottom: 10px;
            letter-spacing: 1px;
            color: #222;
          }
          .info-section {
            margin-bottom: 25px;
            padding-bottom: 10px;
            border-bottom: 1px solid #ddd;
          }
          .info-section p {
            margin: 5px 0;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
          }
          th, td {
            border: 2px solid #ccc;
            padding: 10px 8px;
            text-align: center;
          }
          th {
            background-color: #f9f9f9;
            font-size: 14px;
          }
          .details {
            font-size: 12px;
            color: #666;
          }
          .timestamp {
            font-size: 11px;
            color: #999;
            font-style: italic;
          }
          .total {
            font-weight: bold;
            font-size: 16px;
            text-align: right;
            margin-top: 25px;
          }
          .owner-section {
            margin-top: 40px;
            font-size: 13px;
            color: #555;
            border-top: 1px solid #eee;
            padding-top: 15px;
          }
          .footer-note {
            margin-top: 30px;
            text-align: center;
            font-style: italic;
            font-size: 13px;
            color: #444;
          }
        </style>
      </head>
      <body>
        <h1>${title}</h1>

        <div class="info-section">
          <p><strong>${title} ID:</strong> ${invoiceId}</p>
          <p><strong>Date Generated:</strong> ${date}</p>
          <p><strong>Customer:</strong> ${customer.name}</p>
          <p><strong>Phone:</strong> ${
            customer.phoneNumber
              ? '+91 ' + customer.phoneNumber.slice(0, 5) + '*****'
              : '--'
          }</p>
          <p><strong>Address:</strong> ${customer.address || '--'}</p>
        </div>

        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Product Description</th>
              <th>Quantity</th>
              <th>Unit Price</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${productRows}
          </tbody>
        </table>

        <p class="total">Total Amount: ₹${totalAmount.toFixed(2)}</p>

        <div class="owner-section">
          <p><strong>Sold By (Owner):</strong> ${owner.name}</p>
          <p><strong>Business Name:</strong> ${owner.businessName}</p>
          <p><strong>Phone:</strong> +91-${
            owner.businessPhoneNumber?.value || '--'
          }</p>
          <p><strong>Address:</strong> ${owner.businessAddress || '--'}</p>
        </div>

        <div class="footer-note">
          Thank you for your purchase! We hope to serve you again soon. 😊<br />
          — Your friendly neighborhood shopkeeper
        </div>
      </body>
    </html>
  `;
};

export {generateInvoiceHTML};
