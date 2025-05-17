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

  const productRows = soldProducts
    .map((item, index) => {
      const unitPrice = item.product.discountedPrice ?? item.product.basePrice;
      const quantityLabel = `${item.count} ${
        item.product.measurementTypeDescription || item.product.measurementType
      }`;
      const subtotal = unitPrice * item.count;
      totalAmount += subtotal;

      return `
        <tr>
          <td>${index + 1}</td>
          <td>
            <strong>${item.product.name}</strong><br/>
            <small>${quantityLabel} × ₹${unitPrice.toFixed(2)}</small>
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
            font-family: Arial, sans-serif;
            padding: 20px;
            font-size: 14px;
            background-color: #fdfdfd;
            color: #333;
          }
          h1 {
            text-align: center;
            margin-bottom: 10px;
            font-size: 24px;
            color: #222;
          }
          .info-section {
            margin-bottom: 20px;
          }
          .info-section p {
            margin: 2px 0;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          th, td {
            border: 1px solid #000;
            padding: 8px;
            text-align: center;
          }
          th {
            background-color: #f0f0f0;
          }
          .total {
            font-weight: bold;
            font-size: 16px;
            margin-top: 20px;
            text-align: right;
          }
          .owner-section {
            margin-top: 40px;
            font-size: 13px;
            color: #555;
            border-top: 1px solid #ccc;
            padding-top: 15px;
          }
        </style>
      </head>
      <body>
        <h1>Invoice</h1>

        <div class="info-section">
          <p><strong>Invoice ID:</strong> ${invoiceId}</p>
          <p><strong>Date:</strong> ${date}</p>
          <p><strong>Customer:</strong> ${customer.name}</p>
          <p><strong>Phone:</strong> +91 ${customer.phoneNumber?.slice(0,5)+'*****' || 'N/A'}</p>
          <p><strong>Address:</strong> ${customer.address || 'N/A'}</p>
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
            owner.businessPhoneNumber?.value || 'N/A'
          }</p>
          <p><strong>Address:</strong> ${owner.businessAddress || 'N/A'}</p>
        </div>
        <div style="margin-top: 30px; text-align: center; font-style: italic; font-size: 13px; color: #444;">
                Thank you for your purchase! Hope to see you again soon. 😊<br />
               — Your friendly neighborhood shopkeeper
                </div>
      </body>
    </html>
  `;
};

export {generateInvoiceHTML};
