#!/bin/bash 
set -eoux pipefail

node --version
npm --version

npm install
cd client   
npm install
cd ..
npm start
