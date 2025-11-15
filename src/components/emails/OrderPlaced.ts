import { sub } from "date-fns";


export function OrderPlacedEmail({customerName, orderItems, orderId, orderDate, deliveryCharges, address, paymentMethod, subTotal, total}:{
    customerName: string, 
    orderItems: string[], 
    orderId: string,
    orderDate: string, 
    deliveryCharges: number,
    address: string[],
    paymentMethod: string,
    subTotal: number,
    total: number
}) {

    return `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Order Confirmation</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f7f7f7;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 600px;
        margin: 30px auto;
        background-color: #ffffff;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
      }
      .header {
        background-color: #2563eb;
        color: #ffffff;
        padding: 20px;
        text-align: center;
      }
      .content {
        padding: 20px;
      }
      .order-summary {
        border-collapse: collapse;
        width: 100%;
        margin-top: 15px;
      }
      .order-summary th,
      .order-summary td {
        border: 1px solid #ddd;
        padding: 10px;
        text-align: left;
      }
      .order-summary th {
        background-color: #f3f4f6;
      }
      .footer {
        background-color: #f9fafb;
        padding: 15px;
        text-align: center;
        font-size: 12px;
        color: #6b7280;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h2>Thank you for your order, ${customerName}!</h2>
      </div>
      <div class="content">
        <p>
          Your order <strong>${orderId}</strong> has been placed successfully on
          ${orderDate}.
        </p>

        <h3>Order Summary</h3>
        <table class="order-summary">
          <thead>
            <tr>
              <th>Product</th>
              <th>Qty</th>
              <th>Price/Qt</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${orderItems.map((item) => `
              <tr>  
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>₹${item.price}</td>
                <td>₹${(item.price * item.quantity).toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3" style="text-align:right;"><strong>Sub Total</strong></td>
              <td>₹${subTotal}</td>
            </tr>
            <tr>
              <td colspan="3" style="text-align:right;"><strong>Delivery Charges</strong></td>
              <td>₹${deliveryCharges}</td>
            </tr>
            <tr>
              <td colspan="3" style="text-align:right;"><strong>Total</strong></td>
              <td><strong>₹${total}</strong></td>
            </tr>
          </tfoot>
        </table>

        <h3>Shipping Address</h3>
        <p>${customerName}</p>
        <p>${address.address_line_1}, ${address.address_line_2}, ${address.city}, ${address.state}, ${address.pincode}</p>
        <p>Phone: ${address.phone}</p>
       
        <p>Payment Method: <strong>${paymentMethod}</strong></p>
        <p>We’ll notify you when your order ships.</p>
      </div>

      <div class="footer">
        © 2025 ${process.env.APP_NAME} | This is an automated message — please do not reply.
      </div>
    </div>
  </body>
</html>
  `;
}