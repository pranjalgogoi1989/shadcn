import { url } from "inspector";
import { useSearchParams } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";

export async function GET(req:NextRequest){
  try {
    //const {id} = await useSearchParams();
    const logoUrl = process.env.NEXT_PUBLIC_LOGO;
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
              width: 750px;
              border: 1px solid #000;
              padding: 10px;
              border-radius: 8px;
            }
            .header {
              text-align: center;
              font-weight: bold;
              font-size: 20px;
              margin-bottom: 10px;
            }
            .logo {
              text-align:left;
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
            <table style="width: 100%; border:1px solid #ccc; border-collapse: collapse">
                <tr>
                    <td width='50%' style="text-align: left; vertical-align: top">
                        ${logoUrl ? `<img src="${process.env.NEXT_PUBLIC_APP_URL}${logoUrl}" class="logo" />` : ""}
                    </td>
                    <td width='50%' style="text-align: right; vertical-align: bottom">
                        <h4>Tax Invoice/Bill of Supply/Cash Memo</h4>
                        <span>(Original for Recipient)</span>
                    </td>
                </tr>
            </table>

            <div class="header">INVOICE</div>
            
            <table style="width: 100%; border:1px solid #ccc; border-collapse: collapse">
                <tr>
                    <td width='50%' style="text-align: left; vertical-align: top">
                       Sold By:
                       CLICKTECH RETAIL PRIVATE LIMITED
                        Nitesh Ventures, Village: Uparhali (Bijoynagar),
                        P.O.: Uparhali, District- Kamrup
                        Guwahati, Assam, 781122
                        IN

                        PAN No: AAJCC9783E
                        GST Registration No: 18AAJCC9783E1Z6
                    </td>
                    <td width='50%' style="text-align: right; vertical-align: bottom">
                        Billing Address :
                        Pranjal Gogoi
                        House No 4, Halua Gaon
                        NAHARKATIYA, ASSAM, 786610
                        IN
                        State/UT Code: 18
                        Shipping Address :
                        Pranjal Gogoi
                        Pranjal Gogoi
                        House No 4, Halua Gaon
                        NAHARKATIYA, ASSAM, 786610
                        IN
                        State/UT Code: 18
                        Place of supply: ASSAM
                        Place of delivery: ASSAM   
                    </td>
                </tr>
                <tr>
                    <td width='50%' style="text-align: left; vertical-align: top">
                        Order Number: 407-9680882-0126758
                        Order Date: 20.12.2024
                    </td>
                    <td>
                        Invoice Number : GAX1-260096
                        Invoice Details : AS-GAX1-297683823-2425
                        Invoice Date : 20.12.2024
                    </td>
                </tr>
            </table>
            <table>
                <tr>
                    <td>Sl.No</td>
                    <td>Description</td>
                    <td>Unit Price</td>
                    <td>Qty</td>
                    <td>Net Amount</td>
                    <td>Tax Rate</td>
                    <td>Tax Type</td>
                    <td>Tax Amount</td>
                    <td>Total Amount</td>
                </tr>
                <tr>
                    <td>1</td>
                    <td>
                        General Purpose White Silicone Sealant Adhesive Caulk with DIY
                        GUN, Paintable, Weatherproof for General Sealing & Adhesion
                        Application. | B0CC2TD5GL ( B0CC2TD5GL )
                        HSN:64059000
                    </td>
                    <td>₹ 0</td>
                    <td>1</td>
                    <td>₹ 0</td>
                    <td>0%</td>
                    <td>CGST</td>
                    <td>₹ 0</td>
                    <td>₹ 0</td>
                </tr>
                <tr>
                    <td colspan='7'>Total</td>
                    <td></td>
                    <td></td>
                </tr>
            </table>

            <div class="footer">Thank you for shopping with us!</div>
          </div>
        </body>
      </html>
    `;

    await page.setContent(html, { waitUntil: "networkidle0" });

    // ✅ Generate PDF from HTML
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      landscape: false,
      margin: { top: "10px", right: "10px", bottom: "10px", left: "5px" },
    });

    await browser.close();

    // ✅ Return PDF as response
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=Invoice.pdf`,
      },
    });
  } catch (error) {
    console.error("PDF generation error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}