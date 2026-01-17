import Home from "./pages/Home";
import Layout from "./pages/Layout";
import Dashboard from "./pages/DashBoard";
import WriteArticle from "./pages/WriteArticle";
import BlogTitles from "./pages/BlogTitles";
import SocialMediaPosts from "./pages/SocialMediaPosts";
import EmailNewsletter from "./pages/EmailNewsletter";
import ProductDescription from "./pages/ProductDescription";
import GenerateImages from "./pages/GenerateImages";
import RemoveBackground from "./pages/RemoveBackground";
import RemoveObject from "./pages/RemoveObject";
import Community from "./pages/Community";
import { Route, Routes } from "react-router-dom";

import { useAuth } from "@clerk/clerk-react";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";

const App = () => {
  console.log("App component rendering...");

  return (
    <div>
      <Toaster></Toaster>
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
    </div>
  );
};

export default App;
