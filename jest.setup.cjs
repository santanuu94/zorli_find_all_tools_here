require('@testing-library/jest-dom');

// Polyfill TextEncoder and TextDecoder in jsdom test environment
if (typeof global.TextEncoder === 'undefined') {
  const { TextEncoder, TextDecoder } = require('util');
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
}