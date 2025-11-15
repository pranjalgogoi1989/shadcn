export function passwordResetEmailBody({ name, token }: { name: string; token: string }) {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Password Reset Request</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
  </head>
  <body class="bg-gray-50">
    <div class="max-w-lg mx-auto mt-10 bg-white rounded-xl shadow-lg overflow-hidden">
      <div class="p-8 text-center">
        <img src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg" alt="TailAdmin Logo" class="mx-auto h-12 mb-4">
        <h1 class="text-2xl font-bold text-gray-800 mb-2">Password Reset Requested</h1>
        <p class="text-gray-600 mb-6">
          Hi <span class="font-semibold text-indigo-600">${name}</span>,<br>
          We received a request to reset your password. Use the token below to proceed:
        </p>
        <div class="mb-6">
          <span class="inline-block px-6 py-3 bg-indigo-100 text-indigo-700 font-mono text-lg rounded-lg border border-indigo-300">
            ${token}
          </span>
        </div>
        <a href="${process.env.APP_URL}/update-password" class="inline-block px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow hover:bg-indigo-700 transition">
          Reset Your Password
        </a>
        <div class="mt-8 text-sm text-gray-400">
          If you did not request a password reset, please ignore this email.
        </div>
      </div>
    </div>
  </body>
  </html>
  `;
}