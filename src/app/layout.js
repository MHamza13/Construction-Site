import "./globals.css";
import { ReduxProvider } from "@/redux/providers";
import ClientLayout from "@/components/layout/ClientLayout";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-neutral-100">
        <ReduxProvider>
          <ClientLayout>{children}</ClientLayout>
        </ReduxProvider>
      </body>
    </html>
  );
}
