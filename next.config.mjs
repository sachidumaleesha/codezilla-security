/** @type {import('next').NextConfig} */

const nextConfig = {
    reactStrictMode: true,
    images: {
      domains: [
        "avatars.githubusercontent.com",
        "lh3.googleusercontent.com",
        "api.dicebear.com",
        "img.clerk.com",
      ],
      dangerouslyAllowSVG: true,
      contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    },
  };

export default nextConfig;
