#!/bin/bash

clear

chmod o+x .
mkdir Game-Folder
chmod 705 Game-Folder
cp -r Game-Repository/* Game-Folder
cd Game-Folder
chmod 704 *
node server.js
