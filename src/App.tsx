import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, useParams, Navigate } from "react-router-dom";
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
import { BlogStudio } from "./pages/admin/BlogStudio";
import { LeadsDashboard } from "./pages/admin/LeadsDashboard";
import { AdminCategories } from "./pages/admin/Categories";
import { ProductsDashboard } from "./pages/admin/ProductsDashboard";
import { ProductEditor } from "./pages/admin/ProductEditor";
import { ProductPreview } from "./pages/admin/ProductPreview";
import { AdminChatbot } from "./pages/admin/Chatbot";
import { NotFound } from "./pages/NotFound";

// /media was renamed to /blog. The server 301s direct hits (.htaccess);
// this handles in-app navigation to any stale /media link.
const MediaToBlogRedirect: React.FC = () => {
  const { blogSlug } = useParams<{ blogSlug?: string }>();
  return <Navigate to={blogSlug ? `/blog/${blogSlug}` : "/blog"} replace />;
};

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

  // Anti-inspection protection for pages starting with /typhon-machinery
  useEffect(() => {
    const isTyphonRoute = pathname.startsWith("/typhon-machinery");
    if (!isTyphonRoute) return;

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // F12
      if (e.key === "F12") {
        e.preventDefault();
      }
      // Ctrl+Shift+I / Cmd+Opt+I (Inspect)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === "I" || e.key === "i" || e.keyCode === 73)) {
        e.preventDefault();
      }
      // Ctrl+Shift+C / Cmd+Opt+C (Inspect Element)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === "C" || e.key === "c" || e.keyCode === 67)) {
        e.preventDefault();
      }
      // Disable Ctrl+Shift+J / Cmd+Opt+J (Console)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === "J" || e.key === "j" || e.keyCode === 74)) {
        e.preventDefault();
      }
      // Disable Ctrl+U / Cmd+Opt+U (View Source)
      if ((e.ctrlKey || e.metaKey) && (e.key === "U" || e.key === "u" || e.keyCode === 85)) {
        e.preventDefault();
      }
      // Disable Ctrl+S / Cmd+S (Save)
      if ((e.ctrlKey || e.metaKey) && (e.key === "S" || e.key === "s" || e.keyCode === 83)) {
        e.preventDefault();
      }
    };

    const handleDragStart = (e: DragEvent) => {
      if ((e.target as HTMLElement).tagName === "IMG") {
        e.preventDefault();
      }
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("dragstart", handleDragStart);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("dragstart", handleDragStart);
    };
  }, [pathname]);

  // Desktop versions of these Anima pages embed their own footer in the
  // scaled design. On mobile those pages render lightweight mobile layouts
  // which do NOT include a footer, so we let the global Footer render instead.
  // Admin lives in its own self-contained shell: no public Navbar/Footer.
  const isAdminRoute = pathname === "/sour" || pathname.startsWith("/sour/");

  const hideAppFooter =
    isAdminRoute || (desktopEmbeddedFooterPages.includes(pathname) && isDesktop);

  const isTyphonRoute = pathname.startsWith("/typhon-machinery");

  return (
    <div className={`flex flex-col min-h-screen bg-theme-bg text-theme-text transition-colors duration-200 ${
      isTyphonRoute ? "select-none" : ""
    }`}>
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
          <Route path="/media" element={<MediaToBlogRedirect />} />
          <Route path="/media/:blogSlug" element={<MediaToBlogRedirect />} />
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
            <Route path="/sour/dashboard" element={<BlogStudio />} />
            <Route path="/sour/leads" element={<LeadsDashboard />} />
            <Route path="/sour/posts/new" element={<BlogStudio />} />
            <Route path="/sour/posts/:id" element={<BlogStudio />} />
            <Route path="/sour/categories" element={<AdminCategories />} />
            <Route path="/sour/products" element={<ProductsDashboard />} />
            <Route path="/sour/products/new" element={<ProductEditor />} />
            <Route path="/sour/products/:id" element={<ProductEditor />} />
            <Route path="/sour/products/:id/preview" element={<ProductPreview />} />
            <Route path="/sour/chatbot" element={<AdminChatbot />} />
          </Route>

          {/* Catch-all 404 — unknown URLs must not index as homepage clones */}
          <Route path="*" element={<NotFound />} />
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
