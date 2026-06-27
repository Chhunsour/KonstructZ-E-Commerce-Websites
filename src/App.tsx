import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { I18nProvider } from "./context/I18nContext";
import "./styles/home-reveal.css";
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { ChatAssistant } from "./components/chat/ChatAssistant";
import { SeoManager } from "./components/SeoManager";
import { Home } from "./pages/Home";
import { AllProducts } from "./pages/AllProductsPage";
import { AllEquipment } from "./pages/AllEquipment";
import { KonstructzMachine } from "./pages/KonstructzMachine";
import { Attachments } from "./pages/Attachments";
import { BlogPage } from "./pages/BlogPage";
import { SingleBlog } from "./pages/SingleBlogPage";
import { About } from "./pages/About";
import { Contact } from "./pages/Contact";
import { LegalPage } from "./pages/LegalPage";
import { ProductDetail } from "./pages/ProductDetail";
import { ProductOverview } from "./pages/ProductOverview";
import { Product } from "./pages/Product";
import { ProductCategoryPage } from "./pages/ProductCategoryPage";
import { TyphonCatalog } from "./pages/TyphonCatalog";
import { TyphonProductDetail } from "./pages/TyphonProductDetail";
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
import { AuthProvider, RequireAuth } from "./context/AuthContext";
import { ProductsProvider } from "./context/ProductsContext";
import { AdminLogin } from "./pages/admin/Login";
import { AdminLayout } from "./pages/admin/AdminLayout";
import { AdminDashboard } from "./pages/admin/Dashboard";
import { PostEditor } from "./pages/admin/PostEditor";
import { AdminCategories } from "./pages/admin/Categories";
import { ProductsDashboard } from "./pages/admin/ProductsDashboard";
import { ProductEditor } from "./pages/admin/ProductEditor";
import { ProductPreview } from "./pages/admin/ProductPreview";
import { Websites } from "./pages/admin/Websites";
import { SyncCenter } from "./pages/admin/SyncCenter";
import { SyncLogs } from "./pages/admin/SyncLogs";
import { SyncSettings } from "./pages/admin/SyncSettings";
import { AdminChatbot } from "./pages/admin/Chatbot";

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
  // Admin lives in its own self-contained shell: no public Navbar/Footer.
  const isAdminRoute = pathname === "/sour" || pathname.startsWith("/sour/");

  const hideAppFooter =
    isAdminRoute || (desktopEmbeddedFooterPages.includes(pathname) && isDesktop);

  return (
    <div className="flex flex-col min-h-screen bg-theme-bg text-theme-text transition-colors duration-200">
      {!isAdminRoute && <Navbar />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/equipment" element={<AllEquipment />} />
          {/* New main equipment overview — premium 8-category landing */}
          <Route path="/categories" element={<ProductOverview />} />
          {/* Ecwid storefront embed (header + footer only) */}
          <Route path="/product" element={<Product />} />
          {/* New WooCommerce-style category landing (preferred URL) */}
          <Route path="/product/:slug" element={<ProductCategoryPage />} />
          {/* Legacy /equipment/<slug> URLs render the same new landing */}
          <Route path="/equipment/konstructz-machine" element={<KonstructzMachine />} />
          <Route path="/equipment/mini-excavators" element={<MiniExcavators />} />
          <Route path="/equipment/mini-skid-steers" element={<MiniSkidSteers />} />
          <Route path="/equipment/trenchers" element={<Trenchers />} />
          <Route path="/equipment/wheel-loaders" element={<WheelLoaders />} />
          <Route path="/equipment/stone-crushers" element={<StoneCrushers />} />
          <Route path="/equipment/backhoe-loaders" element={<BackhoeLoaders />} />
          <Route path="/equipment/dumpers" element={<Dumpers />} />
          <Route path="/equipment/towable-excavators" element={<TowableExcavators />} />
          {/* Product detail pages stay at /equipment/<product-id> */}
          <Route path="/equipment/:productId" element={<ProductDetail />} />
          <Route path="/typhon-machinery" element={<TyphonCatalog />} />
          <Route path="/typhon-machinery/:productId" element={<TyphonProductDetail />} />
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
          <Route path="/privacy" element={<LegalPage kind="privacy" />} />
          <Route path="/policy" element={<LegalPage kind="policy" />} />
          <Route path="/support" element={<Support />} />
          <Route path="/support/order-purchase-support" element={<OrderPurchaseSupport />} />
          <Route path="/support/shipping-delivery" element={<ShippingDelivery />} />
          <Route path="/support/warranty-returns" element={<WarrantyReturns />} />
          <Route path="/support/machine-guidance" element={<MachineGuidance />} />
          <Route path="/support/attachments-support" element={<AttachmentsSupport />} />
          <Route path="/support/contact-support" element={<ContactSupport />} />

          {/* ── Hidden admin (login + dashboard). Real auth via Supabase. ── */}
          <Route path="/sour" element={<AdminLogin />} />
          <Route
            element={
              <RequireAuth>
                <AdminLayout />
              </RequireAuth>
            }
          >
            <Route path="/sour/dashboard" element={<AdminDashboard />} />
            <Route path="/sour/posts/new" element={<PostEditor />} />
            <Route path="/sour/posts/:id" element={<PostEditor />} />
            <Route path="/sour/categories" element={<AdminCategories />} />
            <Route path="/sour/products" element={<ProductsDashboard />} />
            <Route path="/sour/products/new" element={<ProductEditor />} />
            <Route path="/sour/products/:id" element={<ProductEditor />} />
            <Route path="/sour/products/:id/preview" element={<ProductPreview />} />
            <Route path="/sour/websites" element={<Websites />} />
            <Route path="/sour/chatbot" element={<AdminChatbot />} />
            <Route path="/sour/sync" element={<SyncCenter />} />
            <Route path="/sour/sync/logs" element={<SyncLogs />} />
            <Route path="/sour/sync/settings" element={<SyncSettings />} />
          </Route>
        </Routes>
      </main>
      {!hideAppFooter && <Footer />}
      {!isAdminRoute && <ChatAssistant />}
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <I18nProvider>
        <AuthProvider>
          <ProductsProvider>
            <Router>
              <SeoManager />
              <ScrollToTop />
              <AppLayout />
            </Router>
          </ProductsProvider>
        </AuthProvider>
      </I18nProvider>
    </ThemeProvider>
  );
};

export default App;
