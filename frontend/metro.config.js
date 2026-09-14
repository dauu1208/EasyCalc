const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Cho phép Metro nhận diện file .wasm (cần cho expo-sqlite chạy trên web)
config.resolver.assetExts.push('wasm');

// Thêm header COOP/COEP cần thiết để wasm SQLite chạy được (SharedArrayBuffer)
config.server = {
  ...config.server,
  enhanceMiddleware: (middleware) => {
    return (req, res, next) => {
      res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
      res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
      return middleware(req, res, next);
    };
  },
};

module.exports = config;