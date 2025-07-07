#!/usr/bin/env node

const { exec } = require('child_process')
const path = require('path')

// Change to the project directory
process.chdir(path.join(__dirname, '..'))

console.log('🌱 Starting database seeding...')

// Execute the seed command
exec('cross-env NODE_OPTIONS=--no-deprecation payload seed', (error, stdout, stderr) => {
  if (error) {
    console.error('❌ Seeding failed:', error.message)
    return
  }
  
  if (stderr) {
    console.error('⚠️  Seeding warnings:', stderr)
  }
  
  console.log('✅ Seeding completed!')
  console.log(stdout)
})