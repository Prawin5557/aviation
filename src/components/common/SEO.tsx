import React, { useEffect } from "react";

interface SEOProps {
  title: string;
  description?: string;
}

export default function SEO({ title, description }: SEOProps) {
  useEffect(() => {
    document.title = `${title} | ARMZ Aviation`;
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", description || "Premium Aviation Job Portal");
    } else {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content = description || "Premium Aviation Job Portal";
      document.head.appendChild(meta);
    }
  }, [title, description]);

  return null;
}
