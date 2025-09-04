"use client";
import { useState, useEffect } from "react";
import "../css/euclid-circular-a-font.css";
import "../css/style.css";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer";

import { ModalProvider } from "../context/QuickViewModalContext";
import { CartModalProvider } from "../context/CartSidebarModalContext";
import { ReduxProvider } from "@/redux/provider";
import QuickViewModal from "@/components/Common/QuickViewModal";
import CartSidebarModal from "@/components/Common/CartSidebarModal";
import { PreviewSliderProvider } from "../context/PreviewSliderContext";
import PreviewSliderModal from "@/components/Common/PreviewSlider";

import ScrollToTop from "@/components/Common/ScrollToTop";
import PreLoader from "@/components/Common/PreLoader";
import { SessionProvider } from "next-auth/react";
import GlobalErrorHandler from "../../components/ErrorHandlers/GlobalErrorHandler";
import PWAInstaller from "@/components/PWA/PWAInstaller";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head></head>
      <body className="font-brand antialiased">
        {loading ? (
          <PreLoader />
        ) : (
          <>
            <GlobalErrorHandler />
            <SessionProvider>
              <ReduxProvider>
                <CartModalProvider>
                  <ModalProvider>
                    <PreviewSliderProvider>
                      <Header />
                      {children}

                      <QuickViewModal />
                      <CartSidebarModal />
                      <PreviewSliderModal />
                    </PreviewSliderProvider>
                  </ModalProvider>
                </CartModalProvider>
              </ReduxProvider>
            </SessionProvider>
            <ScrollToTop />
            <Footer />
            <PWAInstaller />
          </>
        )}
      </body>
    </html>
  );
}
