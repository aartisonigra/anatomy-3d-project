const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Metro ને .glb એક્સ્ટેન્શન સપોર્ટ આપવા માટે
config.resolver.assetExts.push('glb');

module.exports = config;