import { NextResponse } from "next/server";
import puppeteer from "puppeteer";

export async function POST(req) {
  try {
    const {
      orderId,
      itemdetails,
      sellerName,
      customer,
      address,
      city,
      state,
      pincode,
      paymentMethod,
      logoUrl,
    } = await req.json();

    // ✅ Launch headless browser
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    
    // ✅ Create HTML template for the label
    const html = `
      <html>
        <head>
          <style>
            * {
              font-family: "Arial", sans-serif;
              box-sizing: border-box;
            }
            body {
              margin: 0;
              padding: 20px;
              font-size: 10px;
            }
            .label {
              width: 630px;
              border: 1px solid #000;
              padding: 10px;
              border-radius: 8px;
            }
            .header {
              text-align: center;
              font-weight: bold;
              font-size: 10px;
              margin-bottom: 10px;
            }
            .logo {
              display: block;
              margin: 0 auto 8px;
              width: 60px;
              height: 60px;
              object-fit: contain;
            }
            .section {
              margin-bottom: 8px;
              font-size: 13px;
            }
            .section-title {
              font-weight: bold;
              text-decoration: underline;
            }
            .qr {
              display: block;
              margin: 12px auto;
              width: 100px;
              height: 100px;
            }
            .footer {
              text-align: center;
              font-size: 10px;
              margin-top: 10px;
              color: #555;
            }
          </style>
        </head>
        <body>
          <div class="label">
            ${logoUrl ? `<img src="${process.env.NEXT_PUBLIC_APP_URL}${logoUrl}" class="logo" />` : ""}
            <table width="100%" border="0">
              <tr>
                  <td colspan="2">
                    <table width="100%" border="1" style="border-collapse:collapse">
                      <tr>
                        <td>#</td>
                        <td>Particulars</td>
                        <td>Details (Price × Quantity + Delivery)</td>
                        <td>Price</td>
                      </tr>
                      <tr>
                        <td><img src="${process.env.NEXT_PUBLIC_APP_URL}${itemdetails.image}" height="50px" width="50px" /></td>
                        <td>${itemdetails.title}</td>
                        <td>₹${Number(itemdetails.price).toFixed(2)} x ${itemdetails.quantity} + ₹${Number(itemdetails.deliveryCharge).toFixed(2)}</td>
                        <td class="text-right">₹${Number(itemdetails.price * itemdetails.quantity + itemdetails.deliveryCharge).toFixed(2)}</td>
                      </tr>
                    </table>
                  </td>
              </tr>
              <tr>
                  <td>
                    <div class="section">
                      <div class="section-title">Ship To:</div>
                      <div>${customer}</div>
                      <div>${address}</div>
                      <div>${city}, ${state} - ${pincode}</div>
                    </div>
                  </td>
                  <td>
                    <div class="section">
                      <div class="section-title">Seller:</div>
                      <div>${sellerName}</div>
                    </div>
                  </td>
              </tr>
            </table>
            <div class="section">
              <table width="100%">
                <tr>
                  <td>
                    <strong>Order ID:</strong> ${orderId} 
                  </td>
                  <td>
                    <strong>Payment:</strong> ${paymentMethod}
                  </td>
                  <td>
                    <strong>Date:</strong> ${new Date().toLocaleDateString()}
                  </td>
                </tr>
              </table>
            </div>

            <img 
              src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=https://yourdomain.com/track/${orderId}" 
              class="qr" 
            />
            <div class="footer">Thank you for shopping with us!</div>
          </div>
        </body>
      </html>
    `;

    await page.setContent(html, { waitUntil: "networkidle0" });

    // ✅ Generate PDF from HTML
    const pdfBuffer = await page.pdf({
      format: "A6",
      printBackground: true,
      landscape: true,
      margin: { top: "10px", right: "10px", bottom: "10px", left: "5px" },
    });

    await browser.close();

    // ✅ Return PDF as response
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=shipping_label_${orderId}.pdf`,
      },
    });
  } catch (error) {
    console.error("PDF generation error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}