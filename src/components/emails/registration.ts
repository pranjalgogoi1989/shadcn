export function registrationEmailBody({ name }: { name: string }) {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Welcome to ${process.env.APP_NAME}</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
  </head>
  <body class="bg-gray-50">
    <div class="max-w-lg mx-auto mt-10 bg-white rounded-xl shadow-lg overflow-hidden">
      <div class="p-8 text-center">
        <img src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg" alt="App Logo" class="mx-auto h-12 mb-4">
        <h1 class="text-2xl font-bold text-gray-800 mb-2">Welcome, ${name}!</h1>
        <p class="text-gray-600 mb-6">
          Thank you for registering with <span class="font-semibold text-indigo-600">${process.env.APP_NAME}</span>.<br>
          We're excited to have you on board!
        </p>
        <a href="${process.env.APP_URL}/signin" class="inline-block px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow hover:bg-indigo-700 transition">
          Sign In to Your Dashboard
        </a>
        <div class="mt-8 text-sm text-gray-400">
          If you did not register, please ignore this email.
        </div>
      </div>
    </div>
  </body>
  </html>
  `;
}