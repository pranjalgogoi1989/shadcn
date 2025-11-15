export function SellerRequestEmailBody({ name , status }: { name: string, status: string }) {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Request for Becoming a Seller</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
  </head>
  <body class="bg-gray-50">
    <div class="max-w-lg mx-auto mt-10 bg-white rounded-xl shadow-lg overflow-hidden">
      <div class="p-8 text-center">
        <img src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg" alt="TailAdmin Logo" class="mx-auto h-12 mb-4">
        <h1 class="text-2xl font-bold text-gray-800 mb-2">Seller Request Processed Successfully</h1>
        <p class="text-gray-600 mb-6">
          Hello <span class="font-semibold text-indigo-600">${name}</span>,<br>
          Your seller account has been ${status}.<br>
          If you did not perform this action, please contact support immediately.
        </p>
        <div class="mt-8 text-sm text-gray-400">
          ${process.env.APP_NAME}
        </div>
      </div>
    </div>
  </body>
  </html>
  `;
}