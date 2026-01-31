import { Route, Routes } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import React, { useEffect, Suspense, lazy } from "react";
import { Toaster } from "react-hot-toast";

// Lazy loading components for performance
const Home = lazy(() => import("./pages/Home"));
const Layout = lazy(() => import("./pages/Layout"));
const Dashboard = lazy(() => import("./pages/DashBoard"));
const WriteArticle = lazy(() => import("./pages/WriteArticle"));
const BlogTitles = lazy(() => import("./pages/BlogTitles"));
const SocialMediaPosts = lazy(() => import("./pages/SocialMediaPosts"));
const EmailNewsletter = lazy(() => import("./pages/EmailNewsletter"));
const ProductDescription = lazy(() => import("./pages/ProductDescription"));
const GenerateImages = lazy(() => import("./pages/GenerateImages"));
const RemoveBackground = lazy(() => import("./pages/RemoveBackground"));
const RemoveObject = lazy(() => import("./pages/RemoveObject"));
const Community = lazy(() => import("./pages/Community"));

// Loading Spinner Component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen bg-black">
    <div className="w-8 h-8 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
  </div>
);

const App = () => {
  return (
    <div>
      <Toaster />
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ai" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="write-article" element={<WriteArticle />} />
            <Route path="blog-titles" element={<BlogTitles />} />
            <Route path="social-media" element={<SocialMediaPosts />} />
            <Route path="email-newsletter" element={<EmailNewsletter />} />
            <Route path="product-description" element={<ProductDescription />} />
            <Route path="generate-images" element={<GenerateImages />} />
            <Route path="remove-background" element={<RemoveBackground />} />
            <Route path="remove-object" element={<RemoveObject />} />
            <Route path="community" element={<Community />} />
          </Route>
        </Routes>
      </Suspense>
    </div>
  );
};

export default App;
