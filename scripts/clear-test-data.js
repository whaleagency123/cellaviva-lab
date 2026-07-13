/**
 * One-off maintenance script: wipes all Customer and Order data (test data
 * cleanup before launch). Always backs up first. Destructive step only runs
 * with --confirm.
 *
 * Usage:
 *   node scripts/clear-test-data.js            (dry run: backup + counts only)
 *   node scripts/clear-test-data.js --confirm  (backup, then delete)
 */
const fs = require('fs')
const path = require('path')
require('dotenv').config()

const { PrismaClient } = require('@prisma/client')
const { PrismaPg } = require('@prisma/adapter-pg')

async function main() {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    throw new Error('DATABASE_URL is not set.')
  }

  const adapter = new PrismaPg({ connectionString })
  const prisma = new PrismaClient({ adapter })

  const confirm = process.argv.includes('--confirm')

  try {
    const [customers, orders] = await Promise.all([
      prisma.customer.findMany({
        include: { subscriptions: true, wishlistItems: true },
      }),
      prisma.order.findMany({ include: { lineItems: true } }),
    ])

    console.log(`Found ${customers.length} customers, ${orders.length} orders.`)

    const backupsDir = path.join(__dirname, '..', 'backups')
    fs.mkdirSync(backupsDir, { recursive: true })
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const backupPath = path.join(backupsDir, `pre-wipe-${timestamp}.json`)
    fs.writeFileSync(
      backupPath,
      JSON.stringify({ exportedAt: new Date().toISOString(), customers, orders }, null, 2)
    )
    console.log(`Backup written to ${backupPath}`)

    if (!confirm) {
      console.log('\nDry run only — no data deleted. Re-run with --confirm to delete.')
      return
    }

    const deletedOrders = await prisma.order.deleteMany()
    console.log(`Deleted ${deletedOrders.count} orders (and their order items).`)

    const deletedCustomers = await prisma.customer.deleteMany()
    console.log(`Deleted ${deletedCustomers.count} customers (and their subscriptions/wishlists).`)

    const [remainingCustomers, remainingOrders] = await Promise.all([
      prisma.customer.count(),
      prisma.order.count(),
    ])
    console.log(`Remaining: ${remainingCustomers} customers, ${remainingOrders} orders.`)
  } finally {
    await prisma.$disconnect()
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
