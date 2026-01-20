#!/bin/bash
cd server
npm install
cd ../client
npm install
npm run build
cd ../server
node index.js
