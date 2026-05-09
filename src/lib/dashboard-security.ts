import type { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'

/** Single settings row key — use with `where: { settingsKey }` for reliable upserts. */
export const SETTINGS_ROW_KEY = 'singleton' as const

export const settingsUniqueWhere = { settingsKey: SETTINGS_ROW_KEY } as const

export async function getSettingsRow() {
  return prisma.settings.findUnique({ where: settingsUniqueWhere })
}

/**
 * Ensures the singleton settings row exists without relying on a fixed primary key id.
 * Safe when legacy rows used a different id than the app’s old hard-coded value.
 */
export async function loadOrCreateSettingsRow() {
  return prisma.settings.upsert({
    where: settingsUniqueWhere,
    update: {},
    create: { settingsKey: SETTINGS_ROW_KEY },
  })
}

type SettingsCreateWithoutKey = Omit<Prisma.SettingsCreateInput, 'settingsKey'>

export async function upsertSettingsRow(args: {
  update: Prisma.SettingsUpdateInput
  create: SettingsCreateWithoutKey
}) {
  return prisma.settings.upsert({
    where: settingsUniqueWhere,
    update: args.update,
    create: {
      ...args.create,
      settingsKey: SETTINGS_ROW_KEY,
    },
  })
}
