import React, { useEffect, useState } from "react";
import { HashRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { I18nProvider } from "./context/I18nContext";
import "./styles/home-reveal.css";
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { SeoManager } from "./components/SeoManager";
import { Home } from "./pages/Home";
import { AllProducts } from "./pages/AllProductsPage";
import { KonstructzMachine } from "./pages/KonstructzMachine";
import { Attachments } from "./pages/Attachments";
import { BlogPage } from "./pages/BlogPage";
import { SingleBlog } from "./pages/SingleBlogPage";
import { About } from "./pages/About";
import { Contact } from "./pages/Contact";
import { ProductDetail } from "./pages/ProductDetail";
import { QualityEquipment } from "./pages/brand/QualityEquipment";
import { TrustedSupport } from "./pages/brand/TrustedSupport";
import { JobSiteReady } from "./pages/brand/JobSiteReady";
import { LongTermValue } from "./pages/brand/LongTermValue";
import { MiniExcavators } from "./pages/equipment/MiniExcavators";
import { MiniSkidSteers } from "./pages/equipment/MiniSkidSteers";
import { Trenchers } from "./pages/equipment/Trenchers";
import { WheelLoaders } from "./pages/equipment/WheelLoaders";
import { StoneCrushers } from "./pages/equipment/StoneCrushers";
import { BackhoeLoaders } from "./pages/equipment/BackhoeLoaders";
import { Dumpers } from "./pages/equipment/Dumpers";
import { TowableExcavators } from "./pages/equipment/TowableExcavators";
import { MiniExcavatorAttachments } from "./pages/attachments/MiniExcavatorAttachments";
import { MiniSkidSteerAttachments } from "./pages/attachments/MiniSkidSteerAttachments";
import { Support } from "./pages/support/Support";
import { OrderPurchaseSupport } from "./pages/support/OrderPurchaseSupport";
import { ShippingDelivery } from "./pages/support/ShippingDelivery";
import { WarrantyReturns } from "./pages/support/WarrantyReturns";
import { MachineGuidance } from "./pages/support/MachineGuidance";
import { AttachmentsSupport } from "./pages/support/AttachmentsSupport";
import { ContactSupport } from "./pages/support/ContactSupport";

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const AppLayout: React.FC = () => {
  const { pathname } = useLocation();
  const desktopEmbeddedFooterPages = ["/about"];
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== "undefined" ? window.innerWidth >= 1024 : true
  );

  useEffect(() => {
    const onResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Desktop versions of these Anima pages embed their own footer in the
  // scaled design. On mobile those pages render lightweight mobile layouts
  // which do NOT include a footer, so we let the global Footer render instead.
  const hideAppFooter =
    (desktopEmbeddedFooterPages.includes(pathname) && isDesktop) ||
    pathname.startsWith("/media") ||
    pathname.startsWith("/blog");

  return (
    <div className="flex flex-col min-h-screen bg-theme-bg text-theme-text transition-colors duration-200">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/equipment" element={<AllProducts />} />
          <Route path="/equipment/konstructz-machine" element={<KonstructzMachine />} />
          <Route path="/equipment/mini-excavators" element={<MiniExcavators />} />
          <Route path="/equipment/mini-skid-steers" element={<MiniSkidSteers />} />
          <Route path="/equipment/trenchers" element={<Trenchers />} />
          <Route path="/equipment/wheel-loaders" element={<WheelLoaders />} />
          <Route path="/equipment/stone-crushers" element={<StoneCrushers />} />
          <Route path="/equipment/backhoe-loaders" element={<BackhoeLoaders />} />
          <Route path="/equipment/dumpers" element={<Dumpers />} />
          <Route path="/equipment/towable-excavators" element={<TowableExcavators />} />
          <Route path="/equipment/:productId" element={<ProductDetail />} />
          <Route path="/attachments" element={<Attachments />} />
          <Route path="/attachments/mini-excavator" element={<MiniExcavatorAttachments />} />
          <Route path="/attachments/mini-skid-steer" element={<MiniSkidSteerAttachments />} />
          <Route path="/media" element={<BlogPage />} />
          <Route path="/media/:blogSlug" element={<SingleBlog />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:blogSlug" element={<SingleBlog />} />
          <Route path="/quality-equipment" element={<QualityEquipment />} />
          <Route path="/trusted-support" element={<TrustedSupport />} />
          <Route path="/job-site-ready" element={<JobSiteReady />} />
          <Route path="/long-term-value" element={<LongTermValue />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/support" element={<Support />} />
          <Route path="/support/order-purchase-support" element={<OrderPurchaseSupport />} />
          <Route path="/support/shipping-delivery" element={<ShippingDelivery />} />
          <Route path="/support/warranty-returns" element={<WarrantyReturns />} />
          <Route path="/support/machine-guidance" element={<MachineGuidance />} />
          <Route path="/support/attachments-support" element={<AttachmentsSupport />} />
          <Route path="/support/contact-support" element={<ContactSupport />} />
        </Routes>
      </main>
      {!hideAppFooter && <Footer />}
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <I18nProvider>
        <Router>
          <SeoManager />
          <ScrollToTop />
          <AppLayout />
        </Router>
      </I18nProvider>
    </ThemeProvider>
  );
};

export default App;
