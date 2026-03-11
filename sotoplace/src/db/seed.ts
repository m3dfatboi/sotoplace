/**
 * Seed script — заполняет БД демо-данными
 * Запуск: bun src/db/seed.ts
 */
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import {
  tenants, tenantMembers, users,
  products,
  deals, dealPositions, dealParts, partOperations,
  drawings,
  counterpartyRelations,
} from "./schema";

const client = postgres(process.env.DATABASE_URL ?? "postgres://postgres:postgres@localhost:5432/sotoplace");
const db = drizzle(client, { schema });

async function main() {
  console.log("🌱 Seeding...");

  // ──────────────── Tenants ────────────────
  const [metalPro] = await db.insert(tenants).values({
    name: "МеталлПро",
    slug: "metalpro",
    inn: "7701234567",
    region: "Москва",
    profileCompletePct: "85",
  }).returning().onConflictDoNothing();

  const [officePlus] = await db.insert(tenants).values({
    name: "ООО «ОфисПлюс»",
    slug: "officeplus",
    inn: "7704567890",
    region: "Москва",
    profileCompletePct: "60",
  }).returning().onConflictDoNothing();

  const [rezkaProTenant] = await db.insert(tenants).values({
    name: "РезкаПро",
    slug: "rezkapro",
    inn: "7709876543",
    region: "Москва",
    profileCompletePct: "70",
  }).returning().onConflictDoNothing();

  if (!metalPro || !officePlus || !rezkaProTenant) {
    console.log("ℹ️  Already seeded. Run against clean DB to re-seed.");
    await client.end();
    return;
  }

  // ──────────────── Users ────────────────
  const [ivan] = await db.insert(users).values({
    email: "ivan@metalpro.ru",
    name: "Иван Смирнов",
    passwordHash: "hashed_password",
  }).returning();

  const [maria] = await db.insert(users).values({
    email: "maria@metalpro.ru",
    name: "Мария Петрова",
    passwordHash: "hashed_password",
  }).returning();

  const [alexey] = await db.insert(users).values({
    email: "alexey@metalpro.ru",
    name: "Алексей Козлов",
    passwordHash: "hashed_password",
  }).returning();

  const [client1] = await db.insert(users).values({
    email: "buyer@officeplus.ru",
    name: "Дмитрий Орлов",
    passwordHash: "hashed_password",
  }).returning();

  const [admin1] = await db.insert(users).values({
    email: "admin@sotoplace.ru",
    name: "Сергей Администратов",
    passwordHash: "hashed_password",
  }).returning();

  // ──────────────── Tenant members ────────────────
  await db.insert(tenantMembers).values([
    { tenantId: metalPro.id, userId: ivan.id,    role: "manager" },
    { tenantId: metalPro.id, userId: maria.id,   role: "constructor" },
    { tenantId: metalPro.id, userId: alexey.id,  role: "manager" },
    { tenantId: metalPro.id, userId: admin1.id,  role: "admin" },
    { tenantId: officePlus.id, userId: client1.id, role: "client" },
  ]);

  // ──────────────── Counterparty relations ────────────────
  await db.insert(counterpartyRelations).values([
    { tenantId: metalPro.id, targetTenantId: officePlus.id,  contactsRevealed: true,  dealsCount: 5 },
    { tenantId: metalPro.id, targetTenantId: rezkaProTenant.id, contactsRevealed: true, dealsCount: 12 },
    { tenantId: officePlus.id, targetTenantId: metalPro.id,  contactsRevealed: false, dealsCount: 5 },
  ]);

  // ──────────────── Products ────────────────
  const insertedProducts = await db.insert(products).values([
    { tenantId: metalPro.id, name: "Стол офисный СТ-120",           sku: "CT-120-BK",  price: "12500", description: "Стол с металлическим каркасом, столешница ЛДСП 25мм", stock: 15 },
    { tenantId: metalPro.id, name: "Кресло оператора КР-45",         sku: "KR-45-GR",   price: "8900",  description: "Эргономичное кресло с подлокотниками", stock: 30 },
    { tenantId: metalPro.id, name: "Стеллаж металлический СТМ-200",  sku: "STM-200",    price: "24800", description: "Разборный стеллаж, 5 полок, нагрузка 150кг/полку", stock: 8 },
    { tenantId: metalPro.id, name: "Верстак слесарный ВС-1500",      sku: "VS-1500",    price: "45000", description: "Верстак с тумбой, столешница 40мм", stock: 0 },
    { tenantId: metalPro.id, name: "Шкаф инструментальный ШИ-04",    sku: "SHI-04",     price: "18300", description: "4-секционный шкаф для инструментов", stock: 5 },
    { tenantId: metalPro.id, name: "Тумба подкатная ТП-3",           sku: "TP-3-BK",    price: "9200",  description: "3 ящика, центральный замок, на колёсиках", stock: 20 },
    { tenantId: metalPro.id, name: "Лазерная резка на заказ",        sku: "SVC-LASER",  price: "500",   description: "Лазерная резка металла от 0.5 до 25мм", type: "service" as const },
    { tenantId: metalPro.id, name: "Порошковая покраска",            sku: "SVC-PAINT",  price: "200",   description: "RAL-палитра, металл, профиль", type: "service" as const },
  ]).returning();

  // ──────────────── Deals ────────────────
  const [deal2847] = await db.insert(deals).values({
    number: "#2847",
    sellerTenantId: metalPro.id,
    buyerTenantId: officePlus.id,
    assignedManagerId: ivan.id,
    status: "in_production",
    totalAmount: "164000",
    purchaseAmount: "151500",
    slaDeadline: new Date("2026-03-20"),
  }).returning();

  const [deal2843] = await db.insert(deals).values({
    number: "#2843",
    sellerTenantId: metalPro.id,
    assignedManagerId: maria.id,
    status: "in_production",
    totalAmount: "1200000",
    slaDeadline: new Date("2026-03-09"),
  }).returning();

  const [deal2846] = await db.insert(deals).values({
    number: "#2846",
    sellerTenantId: metalPro.id,
    assignedManagerId: ivan.id,
    status: "approved",
    totalAmount: "89000",
    slaDeadline: new Date("2026-03-12"),
  }).returning();

  const [deal2845] = await db.insert(deals).values({
    number: "#2845",
    sellerTenantId: metalPro.id,
    assignedManagerId: maria.id,
    status: "ready",
    totalAmount: "540000",
    slaDeadline: new Date("2026-03-15"),
  }).returning();

  // ──────────────── Deal positions ────────────────
  const [pos1] = await db.insert(dealPositions).values({
    dealId: deal2847.id,
    productId: insertedProducts[0].id,
    name: "Стол офисный СТ-120",
    sku: "CT-120-BK",
    qty: 5,
    unitPrice: "12500",
    totalPrice: "62500",
    position: 1,
  }).returning();

  const [pos2] = await db.insert(dealPositions).values({
    dealId: deal2847.id,
    productId: insertedProducts[1].id,
    name: "Кресло оператора КР-45",
    sku: "KR-45-GR",
    qty: 10,
    unitPrice: "8900",
    totalPrice: "89000",
    position: 2,
  }).returning();

  // ──────────────── Deal parts + operations ────────────────
  const [part1] = await db.insert(dealParts).values({
    positionId: pos1.id,
    name: "Каркас стальной",
    qty: 5,
    contractorTenantId: rezkaProTenant.id,
    purchasePricePerUnit: "3200",
  }).returning();

  const [part2] = await db.insert(dealParts).values({
    positionId: pos1.id,
    name: "Столешница ЛДСП",
    qty: 5,
    purchasePricePerUnit: "1800",
  }).returning();

  await db.insert(partOperations).values([
    { partId: part1.id, type: "TR", status: "done",        doneAt: new Date("2026-03-02") },
    { partId: part1.id, type: "OK", status: "done",        doneAt: new Date("2026-03-04") },
    { partId: part1.id, type: "UP", status: "in_progress" },
    { partId: part1.id, type: "SK", status: "pending" },
    { partId: part1.id, type: "SB", status: "pending" },
  ]);

  await db.insert(partOperations).values([
    { partId: part2.id, type: "TR", status: "done", doneAt: new Date("2026-03-02") },
    { partId: part2.id, type: "OK", status: "done", doneAt: new Date("2026-03-04") },
    { partId: part2.id, type: "UP", status: "done", doneAt: new Date("2026-03-07") },
    { partId: part2.id, type: "SK", status: "done", doneAt: new Date("2026-03-08") },
    { partId: part2.id, type: "SB", status: "pending" },
  ]);

  // ──────────────── Drawings ────────────────
  const [drw1] = await db.insert(drawings).values({
    dealId: deal2847.id,
    positionId: pos1.id,
    name: "Каркас стола СТ-120",
    status: "draft",
    assignedTo: maria.id,
    deadline: new Date("2026-03-13"),
  }).returning();

  const [drw2] = await db.insert(drawings).values({
    dealId: deal2847.id,
    positionId: pos1.id,
    name: "Столешница ЛДСП",
    status: "in_review",
    assignedTo: maria.id,
    deadline: new Date("2026-03-14"),
    currentVersion: 2,
  }).returning();

  const [drw3] = await db.insert(drawings).values({
    dealId: deal2843.id,
    name: "Стеллаж СТМ-200 каркас секция A",
    status: "in_review",
    assignedTo: maria.id,
    deadline: new Date("2026-03-15"),
  }).returning();

  console.log("✅ Seed complete!");
  console.log("\n📧 Тестовые аккаунты:");
  console.log("  Менеджер:      ivan@metalpro.ru / any_password");
  console.log("  Конструктор:   maria@metalpro.ru / any_password");
  console.log("  Клиент:        buyer@officeplus.ru / any_password");
  console.log("  Администратор: admin@sotoplace.ru / any_password");

  await client.end();
}

main().catch((e) => { console.error(e); process.exit(1); });
