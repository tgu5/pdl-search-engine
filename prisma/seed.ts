// prisma/seed.ts
const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const path = require('path')

const prisma = new PrismaClient()

async function main() {
  // Read the JSON file
  const dataPath = path.join(__dirname, '../prisma_seed.json')
  const engineers = JSON.parse(fs.readFileSync(dataPath, 'utf-8'))

  // Delete existing records (optional)
  await prisma.engineer.deleteMany()

  // Insert the data
  await prisma.engineer.createMany({
    data: engineers
  })

  console.log(`Seeded ${engineers.length} engineers`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })