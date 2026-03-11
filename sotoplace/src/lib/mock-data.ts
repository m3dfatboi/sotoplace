/**
 * Единый источник фейковых данных.
 * Все страницы импортируют отсюда — так данные остаются согласованными.
 */

// ─── Пользователи ─────────────────────────────────────────────────────────

export const USERS = {
  manager:     { name: "Иван Смирнов",     initials: "ИС", role: "manager"     as const, email: "ivan@metalpro.ru",     phone: "+7 (495) 100-11-22", company: "МеталлПро" },
  constructor: { name: "Мария Петрова",    initials: "МП", role: "constructor" as const, email: "maria@metalpro.ru",    phone: "+7 (495) 100-11-33", company: "МеталлПро" },
  admin:       { name: "Сергей Орлов",     initials: "СО", role: "admin"       as const, email: "admin@sotoplace.ru",   phone: "+7 (495) 100-00-01", company: "Sotoplace" },
  client:      { name: "Дмитрий Орлов",   initials: "ДО", role: "client"      as const, email: "buyer@officeplus.ru",  phone: "+7 (495) 200-33-44", company: "ООО «ОфисПлюс»" },
} as const;

export type UserRole = keyof typeof USERS;

export const MANAGERS = [
  { id: "ivan",   name: "Иван Смирнов",  initials: "ИС" },
  { id: "maria",  name: "Мария Петрова", initials: "МП" },
  { id: "alexey", name: "Алексей Козлов", initials: "АК" },
];

// ─── Продукты каталога ─────────────────────────────────────────────────────

export interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  unit: string;
  stock: number;
  inStock: boolean;
  rating: number;
  vendor: string;
  category: string;
  description: string;
  leadTimeDays: number;
  attributes: { key: string; value: string; unit?: string }[];
  variants: { id: string; name: string; price: number }[];
}

export const PRODUCTS: Product[] = [
  {
    id: "1", name: "Стол офисный СТ-120", sku: "CT-120-BK", price: 12500, unit: "шт", stock: 24, inStock: true,
    rating: 4.8, vendor: "МеталлПро", category: "Мебель",
    description: "Офисный стол с металлическим каркасом и столешницей из ЛДСП 25мм. Порошковая покраска RAL 9005. Регулировка высоты ножек.",
    leadTimeDays: 5,
    attributes: [
      { key: "Материал каркаса", value: "Сталь 2мм" },
      { key: "Покрытие", value: "Порошковая покраска RAL 9005" },
      { key: "Столешница", value: "ЛДСП 25мм" },
      { key: "Размер (Д×Ш×В)", value: "1200×600×750", unit: "мм" },
      { key: "Вес", value: "18", unit: "кг" },
      { key: "Макс. нагрузка", value: "80", unit: "кг" },
    ],
    variants: [
      { id: "1a", name: "Стандарт", price: 12500 },
      { id: "1b", name: "+ Ящик", price: 14800 },
      { id: "1c", name: "+ Экран", price: 16200 },
    ],
  },
  {
    id: "2", name: "Кресло оператора КР-45", sku: "KR-45-GR", price: 8900, unit: "шт", stock: 18, inStock: true,
    rating: 4.5, vendor: "МеталлПро", category: "Мебель",
    description: "Эргономичное операторское кресло. Регулировка высоты, подлокотников и наклона спинки. Ткань серая.",
    leadTimeDays: 3,
    attributes: [
      { key: "Механизм", value: "Топ-ган" },
      { key: "Обивка", value: "Сетчатая ткань, серая" },
      { key: "Нагрузка", value: "120", unit: "кг" },
      { key: "Высота сиденья", value: "420–530", unit: "мм" },
    ],
    variants: [
      { id: "2a", name: "Стандарт (серый)", price: 8900 },
      { id: "2b", name: "Кожзам (чёрный)", price: 10500 },
    ],
  },
  {
    id: "3", name: "Стеллаж металлический СТМ-200", sku: "STM-200", price: 24800, unit: "шт", stock: 7, inStock: true,
    rating: 4.9, vendor: "МеталлПро", category: "Хранение",
    description: "Разборный складской стеллаж. 5 полок. Нагрузка до 150 кг/полку. Высота 2000 мм.",
    leadTimeDays: 7,
    attributes: [
      { key: "Размер (Д×Ш×В)", value: "1800×400×2000", unit: "мм" },
      { key: "Количество полок", value: "5" },
      { key: "Нагрузка на полку", value: "150", unit: "кг" },
      { key: "Материал", value: "Сталь 1.5мм, покраска" },
    ],
    variants: [
      { id: "3a", name: "Стандарт (5 полок)", price: 24800 },
      { id: "3b", name: "Усиленный (6 полок)", price: 28500 },
    ],
  },
  {
    id: "4", name: "Верстак слесарный ВС-1500", sku: "VS-1500", price: 45000, unit: "шт", stock: 0, inStock: false,
    rating: 4.7, vendor: "МеталлПро", category: "Оборудование",
    description: "Слесарный верстак с тумбой. Столешница из стали 40мм. Нагрузка до 300 кг.",
    leadTimeDays: 14,
    attributes: [
      { key: "Размер (Д×Ш×В)", value: "1500×700×850", unit: "мм" },
      { key: "Толщина столешницы", value: "40", unit: "мм" },
      { key: "Нагрузка", value: "300", unit: "кг" },
      { key: "Тумба", value: "3 ящика" },
    ],
    variants: [{ id: "4a", name: "Стандарт", price: 45000 }],
  },
  {
    id: "5", name: "Шкаф инструментальный ШИ-04", sku: "SHI-04", price: 18300, unit: "шт", stock: 5, inStock: true,
    rating: 4.6, vendor: "МеталлПро", category: "Хранение",
    description: "Металлический шкаф для хранения инструментов. 4 секции, замок.",
    leadTimeDays: 5,
    attributes: [
      { key: "Размер (Ш×Г×В)", value: "900×450×1800", unit: "мм" },
      { key: "Секции", value: "4" },
      { key: "Замок", value: "Ключ" },
    ],
    variants: [{ id: "5a", name: "Стандарт", price: 18300 }],
  },
  {
    id: "6", name: "Тумба подкатная ТП-3", sku: "TP-3-BK", price: 9200, unit: "шт", stock: 12, inStock: true,
    rating: 4.4, vendor: "МеталлПро", category: "Мебель",
    description: "Тумба подкатная под стол. 3 ящика, центральный замок, 4 колеса (2 с фиксатором).",
    leadTimeDays: 3,
    attributes: [
      { key: "Размер (Ш×Г×В)", value: "420×560×600", unit: "мм" },
      { key: "Ящики", value: "3" },
      { key: "Замок", value: "Центральный" },
    ],
    variants: [{ id: "6a", name: "Чёрный", price: 9200 }, { id: "6b", name: "Серый", price: 9200 }],
  },
  {
    id: "7", name: "Лазерная резка на заказ", sku: "SVC-LASER", price: 500, unit: "дет", stock: 999, inStock: true,
    rating: 5.0, vendor: "РезкаПро", category: "Услуги",
    description: "Лазерная резка металла от 0.5 до 25 мм. Любые контуры. Листы до 1500×3000 мм.",
    leadTimeDays: 2,
    attributes: [
      { key: "Толщина металла", value: "0.5–25", unit: "мм" },
      { key: "Макс. лист", value: "1500×3000", unit: "мм" },
    ],
    variants: [{ id: "7a", name: "до 3мм", price: 500 }, { id: "7b", name: "3–10мм", price: 800 }, { id: "7c", name: "10–25мм", price: 1500 }],
  },
  {
    id: "8", name: "Порошковая покраска", sku: "SVC-PAINT", price: 200, unit: "м²", stock: 999, inStock: true,
    rating: 4.3, vendor: "КраскаПро", category: "Услуги",
    description: "Полный цикл порошковой покраски. RAL-палитра 600+ цветов. Металл, профиль, трубы.",
    leadTimeDays: 3,
    attributes: [
      { key: "Стандарт", value: "RAL 600+ цветов" },
      { key: "Материал", value: "Металл, алюминий, профиль" },
    ],
    variants: [{ id: "8a", name: "Матовый", price: 200 }, { id: "8b", name: "Глянцевый", price: 240 }],
  },
];

export function getProduct(id: string) {
  return PRODUCTS.find((p) => p.id === id) ?? null;
}

// ─── Типы сделок ───────────────────────────────────────────────────────────

export type DealStatus = "draft" | "proposal_sent" | "approved" | "in_production" | "ready" | "shipped" | "closed" | "cancelled";

export type OperationStatus = "pending" | "in_progress" | "done";
export type OperationType = "TR" | "OK" | "UP" | "SK" | "SB";

export interface DealPart {
  id: string;
  name: string;
  contractor: string;
  purchasePricePerUnit: number;
  subDeal: string;
  operations: { code: OperationType; label: string; status: OperationStatus }[];
}

export interface DealPosition {
  id: string;
  productId: string;
  name: string;
  sku: string;
  qty: number;
  costPerUnit: number;      // закупочная цена (= цена каталога)
  costTotal: number;        // qty × costPerUnit
  parts: DealPart[];
}

export interface Deal {
  id: string;
  num: string;
  client: string;
  clientType: "company" | "individual";
  managerId: string;
  managerName: string;
  managerInitials: string;
  status: DealStatus;
  statusLabel: string;
  statusVariant: "primary" | "warning" | "success" | "danger" | "default" | "secondary";
  saleAmount: number;       // сумма для клиента
  slaDeadline: string;      // "20 мар 2026"
  slaRemaining: string;     // "9д", "⚠️ -2д"
  slaOk: boolean;
  stage: string;            // "4/6"
  date: string;             // "8 мар"
  positions: DealPosition[];
}

function costTotal(pos: Omit<DealPosition, "costTotal">): DealPosition {
  return { ...pos, costTotal: pos.qty * pos.costPerUnit };
}

// ─── Сделки ────────────────────────────────────────────────────────────────

export const DEALS: Deal[] = [
  {
    id: "2847", num: "#2847",
    client: "ООО «ОфисПлюс»", clientType: "company",
    managerId: "ivan", managerName: "Иван Смирнов", managerInitials: "ИС",
    status: "in_production", statusLabel: "Производство", statusVariant: "primary",
    saleAmount: 164000,
    slaDeadline: "20 мар 2026", slaRemaining: "9д", slaOk: true, stage: "4/6", date: "8 мар",
    positions: [
      costTotal({ id: "p1", productId: "1", name: "Стол офисный СТ-120",  sku: "CT-120-BK", qty: 5,  costPerUnit: 12500, parts: [
        { id: "d1", name: "Каркас стальной",  contractor: "ООО «РезкаПро»", purchasePricePerUnit: 3200,  subDeal: "#SUB-2847-01",
          operations: [
            { code: "TR", label: "Техн. разработка",    status: "done" },
            { code: "OK", label: "Отдел качества",       status: "done" },
            { code: "UP", label: "Упр. производством",   status: "in_progress" },
            { code: "SK", label: "Складской контроль",   status: "pending" },
            { code: "SB", label: "Сборка",               status: "pending" },
          ],
        },
        { id: "d2", name: "Столешница ЛДСП",  contractor: "ИП Дерево", purchasePricePerUnit: 1800, subDeal: "#SUB-2847-02",
          operations: [
            { code: "TR", label: "Техн. разработка",  status: "done" },
            { code: "OK", label: "Отдел качества",     status: "done" },
            { code: "UP", label: "Упр. производством", status: "done" },
            { code: "SK", label: "Складской контроль", status: "done" },
            { code: "SB", label: "Сборка",             status: "pending" },
          ],
        },
      ], costTotal: 0 }),
      costTotal({ id: "p2", productId: "2", name: "Кресло оператора КР-45", sku: "KR-45-GR",  qty: 10, costPerUnit: 8900, parts: [], costTotal: 0 }),
    ],
  },
  {
    id: "2846", num: "#2846",
    client: "СтройМаг", clientType: "company",
    managerId: "ivan", managerName: "Иван Смирнов", managerInitials: "ИС",
    status: "approved", statusLabel: "Ожидает оплату", statusVariant: "warning",
    saleAmount: 89000,
    slaDeadline: "12 мар 2026", slaRemaining: "1д", slaOk: false, stage: "2/6", date: "7 мар",
    positions: [
      costTotal({ id: "p3", productId: "3", name: "Стеллаж металлический СТМ-200", sku: "STM-200", qty: 3, costPerUnit: 24800, parts: [], costTotal: 0 }),
    ],
  },
  {
    id: "2845", num: "#2845",
    client: "Домострой", clientType: "company",
    managerId: "maria", managerName: "Мария Петрова", managerInitials: "МП",
    status: "ready", statusLabel: "Готово к отгрузке", statusVariant: "success",
    saleAmount: 540000,
    slaDeadline: "15 мар 2026", slaRemaining: "—", slaOk: true, stage: "5/6", date: "5 мар",
    positions: [
      costTotal({ id: "p4", productId: "4", name: "Верстак слесарный ВС-1500",  sku: "VS-1500",  qty: 5,   costPerUnit: 45000, parts: [], costTotal: 0 }),
      costTotal({ id: "p5", productId: "5", name: "Шкаф инструментальный ШИ-04", sku: "SHI-04",  qty: 10,  costPerUnit: 18300, parts: [], costTotal: 0 }),
      costTotal({ id: "p6", productId: "8", name: "Порошковая покраска",         sku: "SVC-PAINT", qty: 480, costPerUnit: 200,   parts: [], costTotal: 0 }),
    ],
  },
  {
    id: "2844", num: "#2844",
    client: "ИП Краснов М.А.", clientType: "individual",
    managerId: "ivan", managerName: "Иван Смирнов", managerInitials: "ИС",
    status: "approved", statusLabel: "Согласование", statusVariant: "secondary",
    saleAmount: 32500,
    slaDeadline: "18 мар 2026", slaRemaining: "7д", slaOk: true, stage: "3/6", date: "4 мар",
    positions: [
      costTotal({ id: "p7", productId: "6", name: "Тумба подкатная ТП-3", sku: "TP-3-BK", qty: 3, costPerUnit: 9200, parts: [], costTotal: 0 }),
    ],
  },
  {
    id: "2843", num: "#2843",
    client: "МебельОпт", clientType: "company",
    managerId: "maria", managerName: "Мария Петрова", managerInitials: "МП",
    status: "in_production", statusLabel: "Просрочено!", statusVariant: "danger",
    saleAmount: 1200000,
    slaDeadline: "9 мар 2026", slaRemaining: "⚠️ -2д", slaOk: false, stage: "4/6", date: "1 мар",
    positions: [
      costTotal({ id: "p8", productId: "3", name: "Стеллаж металлический СТМ-200", sku: "STM-200",   qty: 40,  costPerUnit: 24800, parts: [
        { id: "d3", name: "Каркас секции A", contractor: "ООО «РезкаПро»", purchasePricePerUnit: 5800, subDeal: "#SUB-2843-01",
          operations: [
            { code: "TR", label: "Техн. разработка",    status: "in_progress" },
            { code: "OK", label: "Отдел качества",       status: "pending" },
            { code: "UP", label: "Упр. производством",   status: "pending" },
            { code: "SK", label: "Складской контроль",   status: "pending" },
            { code: "SB", label: "Сборка",               status: "pending" },
          ],
        },
      ], costTotal: 0 }),
      costTotal({ id: "p9", productId: "8", name: "Порошковая покраска", sku: "SVC-PAINT", qty: 800, costPerUnit: 200, parts: [], costTotal: 0 }),
    ],
  },
  {
    id: "2842", num: "#2842",
    client: "ООО «Техно»", clientType: "company",
    managerId: "ivan", managerName: "Иван Смирнов", managerInitials: "ИС",
    status: "draft", statusLabel: "Черновик", statusVariant: "default",
    saleAmount: 75000,
    slaDeadline: "—", slaRemaining: "—", slaOk: true, stage: "1/6", date: "28 фев",
    positions: [
      costTotal({ id: "p10", productId: "4", name: "Верстак слесарный ВС-1500",  sku: "VS-1500",  qty: 1, costPerUnit: 45000, parts: [], costTotal: 0 }),
      costTotal({ id: "p11", productId: "1", name: "Стол офисный СТ-120",        sku: "CT-120-BK", qty: 2, costPerUnit: 12500, parts: [], costTotal: 0 }),
    ],
  },
  {
    id: "2841", num: "#2841",
    client: "Складские решения", clientType: "company",
    managerId: "alexey", managerName: "Алексей Козлов", managerInitials: "АК",
    status: "in_production", statusLabel: "Производство", statusVariant: "primary",
    saleAmount: 320000,
    slaDeadline: "25 мар 2026", slaRemaining: "14д", slaOk: true, stage: "4/6", date: "25 фев",
    positions: [
      costTotal({ id: "p12", productId: "3", name: "Стеллаж металлический СТМ-200", sku: "STM-200",  qty: 8, costPerUnit: 24800, parts: [
        { id: "d4", name: "Стеллаж секция A", contractor: "ООО «РезкаПро»", purchasePricePerUnit: 6200, subDeal: "#SUB-2841-01",
          operations: [
            { code: "TR", label: "Техн. разработка",    status: "done" },
            { code: "OK", label: "Отдел качества",       status: "done" },
            { code: "UP", label: "Упр. производством",   status: "in_progress" },
            { code: "SK", label: "Складской контроль",   status: "pending" },
            { code: "SB", label: "Сборка",               status: "pending" },
          ],
        },
      ], costTotal: 0 }),
      costTotal({ id: "p13", productId: "6", name: "Тумба подкатная ТП-3", sku: "TP-3-BK",  qty: 8, costPerUnit: 9200, parts: [], costTotal: 0 }),
    ],
  },
];

export function getDeal(id: string) {
  return DEALS.find((d) => d.id === id) ?? null;
}

// ─── Вычисленные данные сделки ─────────────────────────────────────────────

export function getDealCostTotal(deal: Deal): number {
  return deal.positions.reduce((s, p) => s + p.costTotal, 0);
}

export function getDealMargin(deal: Deal): number {
  return deal.saleAmount - getDealCostTotal(deal);
}

export function getDealMarginPct(deal: Deal): number {
  const cost = getDealCostTotal(deal);
  if (cost === 0) return 0;
  return Math.round((getDealMargin(deal) / deal.saleAmount) * 100 * 10) / 10;
}

// ─── Агрегаты для дашборда ─────────────────────────────────────────────────

const ACTIVE_STATUSES: DealStatus[] = ["in_production", "ready", "shipped", "approved", "proposal_sent"];

export function getDashboardStats() {
  const active = DEALS.filter((d) => ACTIVE_STATUSES.includes(d.status));
  const totalRevenue = DEALS.reduce((s, d) => s + d.saleAmount, 0);
  const paid = DEALS.filter((d) => d.status === "ready" || d.status === "shipped" || d.status === "closed")
    .reduce((s, d) => s + d.saleAmount, 0);
  const overdueCount = DEALS.filter((d) => !d.slaOk && d.status !== "draft").length;

  return {
    activeCount: active.length,
    totalRevenue,
    paid,
    paidPct: Math.round((paid / totalRevenue) * 100),
    overdueCount,
  };
}

export function getFunnelData() {
  const statusGroups: { label: string; status: DealStatus[] }[] = [
    { label: "Черновик",       status: ["draft"] },
    { label: "КП",             status: ["proposal_sent"] },
    { label: "Согласование",   status: ["approved"] },
    { label: "Производство",   status: ["in_production"] },
    { label: "Готово/Отгрузка", status: ["ready", "shipped"] },
    { label: "Закрыто",        status: ["closed"] },
  ];
  const max = DEALS.length;
  return statusGroups.map(({ label, status }) => {
    const count = DEALS.filter((d) => status.includes(d.status)).length;
    return { label, value: count, pct: Math.round((count / max) * 100) };
  });
}

// ─── Инжиниринг / Задачи ─────────────────────────────────────────────────

export type TaskStatus = "new" | "in_progress" | "review" | "approved";
export type TaskPriority = "high" | "medium" | "low";

export interface EngineeringTask {
  id: string;
  title: string;
  dealId: string;
  dealNum: string;
  position: string;
  priority: TaskPriority;
  deadline: string;
  deadlineUrgent: boolean;
  version: string;
  status: TaskStatus;
  comments: number;
}

export const ENGINEERING_TASKS: EngineeringTask[] = [
  { id: "T-001", title: "Каркас стола СТ-120",            dealId: "2847", dealNum: "#2847", position: "Стол офисный",     priority: "high",   deadline: "Сегодня 18:00", deadlineUrgent: true,  version: "v0 — нет чертежа",   status: "new",         comments: 0 },
  { id: "T-002", title: "Столешница ЛДСП",                 dealId: "2847", dealNum: "#2847", position: "Стол офисный",     priority: "medium", deadline: "13 марта",       deadlineUrgent: false, version: "v2 — на доработке",  status: "in_progress", comments: 3 },
  { id: "T-003", title: "Стеллаж СТМ-200 — секция A",     dealId: "2841", dealNum: "#2841", position: "Стеллаж",          priority: "medium", deadline: "15 марта",       deadlineUrgent: false, version: "v1",                 status: "in_progress", comments: 1 },
  { id: "T-004", title: "Каркас стеллажа МебельОпт",      dealId: "2843", dealNum: "#2843", position: "Стеллаж × 40",    priority: "high",   deadline: "⚠️ Просрочено",  deadlineUrgent: true,  version: "v1 — на проверке",   status: "review",      comments: 5 },
  { id: "T-005", title: "Верстак ВС-1500 (Домострой)",    dealId: "2845", dealNum: "#2845", position: "Верстак × 5",     priority: "low",    deadline: "—",              deadlineUrgent: false, version: "v3 ✅ Согласован",    status: "approved",    comments: 2 },
  { id: "T-006", title: "Шкаф ШИ-04 — спецификация",     dealId: "2845", dealNum: "#2845", position: "Шкаф × 10",       priority: "low",    deadline: "—",              deadlineUrgent: false, version: "v2 ✅ Согласован",    status: "approved",    comments: 1 },
  { id: "T-007", title: "Стеллаж СТМ-200 — секция B",     dealId: "2841", dealNum: "#2841", position: "Стеллаж",         priority: "medium", deadline: "20 марта",       deadlineUrgent: false, version: "v0 — нет чертежа",   status: "new",         comments: 0 },
];

// ─── Контрагенты ──────────────────────────────────────────────────────────

export const COUNTERPARTIES = [
  { id: "1", name: "ООО «РезкаПро»",       role: "Подрядчик", rating: 4.7, reviews: 23, verified: true,  tags: ["Лазерная резка", "Гибка", "Сварка"],       region: "Москва",      capacity: "до 500 дет/мес", contactsRevealed: false, dealsCount: 5, inn: "7701234567" },
  { id: "2", name: "ИП Дерево",             role: "Подрядчик", rating: 4.5, reviews: 15, verified: true,  tags: ["ЛДСП", "Мебельные щиты", "Фрезеровка"],   region: "Подольск",    capacity: "до 200 изд/мес", contactsRevealed: true,  dealsCount: 3, inn: "7709876543" },
  { id: "3", name: "КраскаПро",             role: "Подрядчик", rating: 4.3, reviews: 8,  verified: false, tags: ["Порошковая покраска", "Анодирование"],      region: "Мытищи",      capacity: "до 2000 м²/мес", contactsRevealed: false, dealsCount: 2, inn: "5001239876" },
  { id: "4", name: "ООО «ОфисПлюс»",       role: "Клиент",    rating: 4.9, reviews: 5,  verified: true,  tags: ["Офисная мебель", "Комплектация"],           region: "Москва",      capacity: null,             contactsRevealed: true,  dealsCount: 4, inn: "7704567890" },
  { id: "5", name: "СтройМаг",              role: "Клиент",    rating: 4.0, reviews: 3,  verified: false, tags: ["Стройматериалы", "Инструмент"],             region: "Красногорск", capacity: null,             contactsRevealed: false, dealsCount: 1, inn: "5001234567" },
  { id: "6", name: "Домострой",             role: "Клиент",    rating: 4.8, reviews: 7,  verified: true,  tags: ["Производство", "Металлообработка"],        region: "Москва",      capacity: null,             contactsRevealed: true,  dealsCount: 2, inn: "7707654321" },
  { id: "7", name: "МебельОпт",             role: "Клиент",    rating: 3.5, reviews: 2,  verified: true,  tags: ["Мебель оптом"],                            region: "Москва",      capacity: null,             contactsRevealed: false, dealsCount: 1, inn: "7708765432" },
  { id: "8", name: "Складские решения",     role: "Клиент",    rating: 4.6, reviews: 4,  verified: true,  tags: ["Складское оборудование"],                  region: "Подольск",    capacity: null,             contactsRevealed: true,  dealsCount: 1, inn: "5009876543" },
];

// ─── Корзина ──────────────────────────────────────────────────────────────

export const CART_ITEMS = [
  { id: "1", productId: "1", name: "Стол офисный СТ-120",   sku: "CT-120-BK", vendor: "МеталлПро", price: 12500, qty: 5,  available: true  },
  { id: "2", productId: "2", name: "Кресло оператора КР-45", sku: "KR-45-GR",  vendor: "МеталлПро", price: 8900,  qty: 10, available: true  },
  { id: "3", productId: "6", name: "Тумба подкатная ТП-3",   sku: "TP-3-BK",   vendor: "МеталлПро", price: 9200,  qty: 1,  available: false },
];

// ─── Диалоги / сообщения ──────────────────────────────────────────────────

export const DIALOGS = [
  {
    id: "1", name: "ООО «ОфисПлюс»", initials: "ОП", online: true, unread: 2, dealNum: "#2847",
    lastMsg: "Когда будут готовы чертежи по столам?", time: "14:32",
    messages: [
      { id: "m1", author: "Дмитрий Орлов",  authorInitials: "ДО", mine: false, text: "Добрый день! Можете уточнить статус по сделке #2847?",                   time: "14:15" },
      { id: "m2", author: "Иван Смирнов",   authorInitials: "ИС", mine: true,  text: "Добрый день! Каркасы в производстве, столешницы уже на складе.",         time: "14:20" },
      { id: "m3", author: "Дмитрий Орлов",  authorInitials: "ДО", mine: false, text: "Отлично! Когда будут готовы чертежи по столам? Нам нужно для монтажа.",   time: "14:32" },
    ],
  },
  {
    id: "2", name: "МебельОпт", initials: "МО", online: false, unread: 0, dealNum: "#2843",
    lastMsg: "Понял, ждём.", time: "Вчера",
    messages: [
      { id: "m4", author: "МебельОпт",      authorInitials: "МО", mine: false, text: "Когда отгрузка по #2843? SLA уже прошёл.",        time: "Вчера 11:00" },
      { id: "m5", author: "Мария Петрова",  authorInitials: "МП", mine: true,  text: "Чертежи на согласовании. Ожидаем ответ от РезкаПро.", time: "Вчера 11:30" },
      { id: "m6", author: "МебельОпт",      authorInitials: "МО", mine: false, text: "Понял, ждём.",                                    time: "Вчера 11:35" },
    ],
  },
  {
    id: "3", name: "СтройМаг", initials: "СМ", online: true, unread: 0, dealNum: "#2846",
    lastMsg: "Счёт получили, оплатим сегодня.", time: "10:05",
    messages: [
      { id: "m7", author: "СтройМаг",       authorInitials: "СМ", mine: false, text: "Счёт получили, оплатим сегодня.", time: "10:05" },
      { id: "m8", author: "Иван Смирнов",   authorInitials: "ИС", mine: true,  text: "Отлично, после зачисления сразу запустим производство.", time: "10:10" },
    ],
  },
];

// ─── Вспомогательные форматтеры ───────────────────────────────────────────

export function formatMoney(n: number): string {
  return n.toLocaleString("ru-RU") + " ₽";
}

export function formatMoneyShort(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(".", ",") + "M ₽";
  if (n >= 1_000)     return (n / 1_000).toFixed(0) + "k ₽";
  return n + " ₽";
}
