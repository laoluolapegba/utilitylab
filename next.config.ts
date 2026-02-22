import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    serverExternalPackages: ["tesseract.js", "@google-cloud/vision", "@aws-sdk/client-textract"],

};

export default nextConfig;
