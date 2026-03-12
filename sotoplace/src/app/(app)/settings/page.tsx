"use client";

import { useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Modal, ConfirmDialog } from "@/components/ui/modal";
import {
  Buildings, IdentificationCard, Users, LinkSimple, Storefront, UserCircle,
  Plus, DotsThree, PencilSimple, Upload, Check, Copy, Trash, Link, Key,
} from "@phosphor-icons/react";

const TABS = [
  { id: "profile",   label: "Профиль компании", icon: Buildings },
  { id: "requisites",label: "Реквизиты",         icon: IdentificationCard },
  { id: "employees", label: "Сотрудники",         icon: Users },
  { id: "guests",    label: "Гостевые входы",     icon: LinkSimple },
  { id: "catalog",   label: "Каталог",            icon: Storefront },
  { id: "personal",  label: "Личный профиль",     icon: UserCircle },
];

const ROLES = ["Менеджер", "Конструктор", "Администратор", "Клиент"];

const INITIAL_EMPLOYEES = [
  { id: "1", name: "Иван Смирнов",   email: "ivan@metalpro.ru",   role: "Менеджер",      lastLogin: "Сегодня",       status: "active"  },
  { id: "2", name: "Алексей Козлов", email: "alex@metalpro.ru",   role: "Конструктор",   lastLogin: "Сегодня",       status: "active"  },
  { id: "3", name: "Мария Петрова",  email: "maria@metalpro.ru",  role: "Администратор", lastLogin: "Вчера",          status: "active"  },
  { id: "4", name: "Дмитрий Волков", email: "dmitry@metalpro.ru", role: "Менеджер",      lastLogin: "5 дней назад",  status: "active"  },
  { id: "5", name: "Ольга Новикова", email: "olga@metalpro.ru",   role: "Менеджер",      lastLogin: "Не входил",     status: "invited" },
];

const INITIAL_GUEST_LINKS = [
  { id: "1", name: "Ссылка для ООО «ОфисПлюс»", url: "https://sotoplace.ru/guest/abc123", deal: "#2847", views: 4,  expires: "31 мар" },
  { id: "2", name: "Каталог для МебельОпт",      url: "https://sotoplace.ru/guest/xyz789", deal: "Каталог", views: 12, expires: "15 апр" },
];

const SPECIALIZATIONS = ["Металлообработка", "Мебель", "Лазерная резка"];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");

  // Profile state
  const [profile, setProfile] = useState({
    name: "ООО «МеталлПро»", inn: "7712345678", ogrn: "1177746123456",
    region: "Москва", address: "г. Москва, ул. Промышленная, д. 15, стр. 2",
    description: "Производство металлической мебели и конструкций. Полный цикл от разработки до отгрузки.",
  });
  const [profileSaved, setProfileSaved] = useState(false);
  const [specs, setSpecs] = useState(SPECIALIZATIONS);
  const [newSpec, setNewSpec] = useState("");
  const [addingSpec, setAddingSpec] = useState(false);

  // Requisites state
  const [req, setReq] = useState({
    bankName: "ПАО Сбербанк", bik: "044525225", account: "40702810938000012345",
    corrAccount: "30101810400000000225", kpp: "771201001",
    legalAddress: "г. Москва, ул. Промышленная, д. 15, стр. 2",
    actualAddress: "г. Москва, ул. Промышленная, д. 15, стр. 2",
    director: "Смирнов Иван Петрович", phone: "+7 (495) 100-11-22", email: "info@metalpro.ru",
  });
  const [reqSaved, setReqSaved] = useState(false);

  // Employees
  const [employees, setEmployees] = useState(INITIAL_EMPLOYEES);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [invite, setInvite] = useState({ name: "", email: "", role: "Менеджер" });
  const [empMenuId, setEmpMenuId] = useState<string | null>(null);
  const [deleteEmpId, setDeleteEmpId] = useState<string | null>(null);
  const [changeRoleFor, setChangeRoleFor] = useState<string | null>(null);
  const [newRole, setNewRole] = useState("Менеджер");

  // Guest links
  const [guestLinks, setGuestLinks] = useState(INITIAL_GUEST_LINKS);
  const [createLinkOpen, setCreateLinkOpen] = useState(false);
  const [newLink, setNewLink] = useState({ name: "", deal: "", expires: "" });
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Personal
  const [personal, setPersonal] = useState({
    name: "Иван Смирнов", phone: "+7 (495) 100-11-22", email: "ivan@metalpro.ru",
    currentPassword: "", newPassword: "", confirmPassword: "",
  });
  const [personalSaved, setPersonalSaved] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);

  function saveProfile() {
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2500);
  }

  function saveReq() {
    setReqSaved(true);
    setTimeout(() => setReqSaved(false), 2500);
  }

  function submitInvite() {
    if (!invite.email.trim()) return;
    setEmployees((prev) => [...prev, {
      id: String(prev.length + 1),
      name: invite.name || invite.email,
      email: invite.email,
      role: invite.role,
      lastLogin: "Не входил",
      status: "invited",
    }]);
    setInvite({ name: "", email: "", role: "Менеджер" });
    setInviteOpen(false);
  }

  function deleteEmployee(id: string) {
    setEmployees((prev) => prev.filter((e) => e.id !== id));
    setDeleteEmpId(null);
  }

  function submitChangeRole() {
    if (!changeRoleFor) return;
    setEmployees((prev) => prev.map((e) => e.id === changeRoleFor ? { ...e, role: newRole } : e));
    setChangeRoleFor(null);
  }

  function copyLink(id: string, url: string) {
    navigator.clipboard.writeText(url).catch(() => {});
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  function createGuestLink() {
    if (!newLink.name.trim()) return;
    setGuestLinks((prev) => [...prev, {
      id: String(prev.length + 1),
      name: newLink.name,
      url: `https://sotoplace.ru/guest/${Math.random().toString(36).slice(2, 9)}`,
      deal: newLink.deal || "—",
      views: 0,
      expires: newLink.expires || "—",
    }]);
    setNewLink({ name: "", deal: "", expires: "" });
    setCreateLinkOpen(false);
  }

  function savePersonal() {
    setPersonalSaved(true);
    setTimeout(() => setPersonalSaved(false), 2500);
  }

  function savePassword() {
    if (!personal.newPassword || personal.newPassword !== personal.confirmPassword) return;
    setPasswordSaved(true);
    setPersonal((p) => ({ ...p, currentPassword: "", newPassword: "", confirmPassword: "" }));
    setTimeout(() => setPasswordSaved(false), 2500);
  }

  const profilePct = [profile.name, profile.description, profile.region, profile.address, specs.length > 0].filter(Boolean).length * 20;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-[-0.01em]">Настройки</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Nav */}
        <nav className="lg:col-span-1">
          <ul className="space-y-0.5">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <li key={tab.id}>
                  <button onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-[var(--radius-md)] text-sm font-medium transition-colors ${
                      activeTab === tab.id ? "bg-primary-light text-primary" : "text-text-secondary hover:bg-subtle hover:text-text-primary"
                    }`}
                  >
                    <Icon size={18} />{tab.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Content */}
        <div className="lg:col-span-3 space-y-6">

          {/* ── ПРОФИЛЬ КОМПАНИИ ── */}
          {activeTab === "profile" && (
            <>
              <Card>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-text-secondary">Заполненность профиля</h3>
                  <span className="text-sm font-semibold text-primary tabular-nums">{profilePct}%</span>
                </div>
                <Progress value={profilePct} variant="default" />
                <p className="text-xs text-text-tertiary mt-2">Заполните описание компании и загрузите логотип для повышения доверия.</p>
              </Card>

              <Card>
                <CardHeader><CardTitle>Профиль компании</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <label className="h-20 w-20 rounded-[var(--radius-lg)] bg-subtle border-2 border-dashed border-border flex items-center justify-center text-text-tertiary hover:border-primary hover:text-primary transition-colors cursor-pointer">
                      <Upload size={24} />
                      <input type="file" accept="image/*" className="hidden" />
                    </label>
                    <div>
                      <p className="text-sm font-medium">Логотип компании</p>
                      <p className="text-xs text-text-tertiary">PNG, JPG до 2 МБ · Рекомендуемый размер: 120×120</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { label: "Название компании", key: "name" },
                      { label: "Регион", key: "region" },
                    ].map(({ label, key }) => (
                      <div key={key} className="space-y-1.5">
                        <label className="text-[13px] font-medium text-text-primary">{label}</label>
                        <input value={(profile as any)[key]} onChange={(e) => setProfile((p) => ({ ...p, [key]: e.target.value }))}
                          className="h-10 w-full rounded-[var(--radius-md)] border border-border bg-surface px-3 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                        />
                      </div>
                    ))}
                    <div className="sm:col-span-2 space-y-1.5">
                      <label className="text-[13px] font-medium text-text-primary">Юридический адрес</label>
                      <input value={profile.address} onChange={(e) => setProfile((p) => ({ ...p, address: e.target.value }))}
                        className="h-10 w-full rounded-[var(--radius-md)] border border-border bg-surface px-3 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div className="sm:col-span-2 space-y-1.5">
                      <label className="text-[13px] font-medium text-text-primary">Описание компании</label>
                      <textarea value={profile.description} onChange={(e) => setProfile((p) => ({ ...p, description: e.target.value }))}
                        rows={3} className="w-full rounded-[var(--radius-md)] border border-border bg-surface px-3 py-2 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[13px] font-medium text-text-primary block mb-2">Специализации</label>
                    <div className="flex flex-wrap gap-1.5 items-center">
                      {specs.map((s) => (
                        <button key={s} onClick={() => setSpecs((prev) => prev.filter((x) => x !== s))}
                          className="inline-flex items-center gap-1 rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-medium hover:bg-danger/10 hover:text-danger transition-colors">
                          {s} ×
                        </button>
                      ))}
                      {addingSpec ? (
                        <div className="flex items-center gap-1">
                          <input autoFocus value={newSpec} onChange={(e) => setNewSpec(e.target.value)}
                            onKeyDown={(e) => { if (e.key === "Enter" && newSpec.trim()) { setSpecs((p) => [...p, newSpec.trim()]); setNewSpec(""); setAddingSpec(false); } if (e.key === "Escape") setAddingSpec(false); }}
                            placeholder="Введите специализацию"
                            className="h-7 rounded-full border border-primary px-3 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
                          />
                          <button onClick={() => { if (newSpec.trim()) setSpecs((p) => [...p, newSpec.trim()]); setNewSpec(""); setAddingSpec(false); }}
                            className="text-xs text-primary font-medium hover:text-primary/80">ОК</button>
                        </div>
                      ) : (
                        <button onClick={() => setAddingSpec(true)} className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary/80 font-medium">
                          <Plus size={12} /> Добавить
                        </button>
                      )}
                    </div>
                  </div>

                  <Button onClick={saveProfile}>
                    {profileSaved ? <><Check size={16} className="mr-1.5" />Сохранено</> : "Сохранить изменения"}
                  </Button>
                </CardContent>
              </Card>
            </>
          )}

          {/* ── РЕКВИЗИТЫ ── */}
          {activeTab === "requisites" && (
            <Card>
              <CardHeader><CardTitle>Банковские реквизиты</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { label: "Банк", key: "bankName" },
                    { label: "БИК", key: "bik" },
                    { label: "Расчётный счёт", key: "account" },
                    { label: "Корр. счёт", key: "corrAccount" },
                    { label: "КПП", key: "kpp" },
                    { label: "Телефон", key: "phone" },
                    { label: "Email", key: "email" },
                    { label: "Директор", key: "director" },
                  ].map(({ label, key }) => (
                    <div key={key} className="space-y-1.5">
                      <label className="text-[13px] font-medium text-text-primary">{label}</label>
                      <input value={(req as any)[key]} onChange={(e) => setReq((r) => ({ ...r, [key]: e.target.value }))}
                        className="h-10 w-full rounded-[var(--radius-md)] border border-border bg-surface px-3 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  ))}
                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="text-[13px] font-medium text-text-primary">Юридический адрес</label>
                    <input value={req.legalAddress} onChange={(e) => setReq((r) => ({ ...r, legalAddress: e.target.value }))}
                      className="h-10 w-full rounded-[var(--radius-md)] border border-border bg-surface px-3 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
                <Button onClick={saveReq}>
                  {reqSaved ? <><Check size={16} className="mr-1.5" />Сохранено</> : "Сохранить реквизиты"}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* ── СОТРУДНИКИ ── */}
          {activeTab === "employees" && (
            <Card padding="none">
              <div className="flex items-center justify-between px-4 pt-4 pb-2">
                <h3 className="text-base font-semibold">Сотрудники ({employees.length})</h3>
                <Button size="sm" onClick={() => setInviteOpen(true)}>
                  <Plus size={14} className="mr-1.5" />Пригласить
                </Button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-[13px] text-text-secondary">
                      <th className="px-4 py-2 font-medium">Сотрудник</th>
                      <th className="px-4 py-2 font-medium">Роль</th>
                      <th className="px-4 py-2 font-medium">Последний вход</th>
                      <th className="px-4 py-2 font-medium">Статус</th>
                      <th className="px-4 py-2 font-medium w-10"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {employees.map((emp) => (
                      <tr key={emp.id} className="border-b border-border last:border-0 hover:bg-subtle/30 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <Avatar name={emp.name} size="sm" online={emp.status === "active"} />
                            <div>
                              <p className="text-sm font-medium">{emp.name}</p>
                              <p className="text-xs text-text-tertiary">{emp.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant={emp.role === "Администратор" ? "secondary" : "default"}>{emp.role}</Badge>
                        </td>
                        <td className="px-4 py-3 text-text-secondary text-[13px]">{emp.lastLogin}</td>
                        <td className="px-4 py-3">
                          {emp.status === "active" ? <Badge variant="success" dot>Активен</Badge> : <Badge variant="warning" dot>Приглашён</Badge>}
                        </td>
                        <td className="px-4 py-3 relative">
                          <div className="relative">
                            <button onClick={() => setEmpMenuId(empMenuId === emp.id ? null : emp.id)}
                              className="p-1 rounded text-text-tertiary hover:text-text-primary hover:bg-subtle transition-colors">
                              <DotsThree size={18} weight="bold" />
                            </button>
                            {empMenuId === emp.id && (
                              <div className="absolute right-0 top-full mt-1 z-30 bg-surface border border-border rounded-[var(--radius-lg)] shadow-lg py-1 min-w-[170px]">
                                <button onClick={() => { setChangeRoleFor(emp.id); setNewRole(emp.role); setEmpMenuId(null); }}
                                  className="w-full text-left px-3 py-2 text-sm hover:bg-subtle flex items-center gap-2">
                                  <Key size={14} />Изменить роль
                                </button>
                                <div className="border-t border-border my-1" />
                                <button onClick={() => { setDeleteEmpId(emp.id); setEmpMenuId(null); }}
                                  className="w-full text-left px-3 py-2 text-sm text-danger hover:bg-danger/5 flex items-center gap-2">
                                  <Trash size={14} />Удалить
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {/* ── ГОСТЕВЫЕ ВХОДЫ ── */}
          {activeTab === "guests" && (
            <Card>
              <CardHeader>
                <CardTitle>Гостевые ссылки</CardTitle>
                <Button size="sm" onClick={() => setCreateLinkOpen(true)}>
                  <Plus size={14} className="mr-1.5" />Создать ссылку
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-text-secondary">Гостевые ссылки позволяют клиентам просматривать сделки и каталог без регистрации.</p>
                {guestLinks.map((link) => (
                  <div key={link.id} className="border border-border rounded-[var(--radius-md)] p-4 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-medium">{link.name}</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="default">{link.deal}</Badge>
                        <Badge variant="secondary">{link.views} просм.</Badge>
                        <span className="text-xs text-text-tertiary">до {link.expires}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 text-xs bg-subtle px-2 py-1.5 rounded text-text-secondary truncate">{link.url}</code>
                      <button onClick={() => copyLink(link.id, link.url)}
                        className={`p-1.5 rounded transition-colors ${copiedId === link.id ? "text-success" : "text-text-tertiary hover:text-text-primary hover:bg-subtle"}`}>
                        {copiedId === link.id ? <Check size={14} /> : <Copy size={14} />}
                      </button>
                      <button onClick={() => setGuestLinks((prev) => prev.filter((l) => l.id !== link.id))}
                        className="p-1.5 rounded text-text-tertiary hover:text-danger hover:bg-danger/5 transition-colors">
                        <Trash size={14} />
                      </button>
                    </div>
                  </div>
                ))}
                {guestLinks.length === 0 && (
                  <p className="text-sm text-text-tertiary text-center py-6">Нет созданных ссылок</p>
                )}
              </CardContent>
            </Card>
          )}

          {/* ── КАТАЛОГ ── */}
          {activeTab === "catalog" && (
            <Card>
              <CardHeader><CardTitle>Настройки каталога</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-text-secondary">Управляйте видимостью товаров и настройками отображения вашего каталога.</p>
                {[
                  { label: "Показывать каталог публично", description: "Каталог будет виден без авторизации", defaultChecked: true },
                  { label: "Отображать остатки на складе", description: "Клиенты увидят количество доступных единиц", defaultChecked: true },
                  { label: "Разрешить заказы без согласования", description: "Клиенты могут оформить заказ напрямую", defaultChecked: false },
                  { label: "Показывать цены всем", description: "Цены видны без входа в систему", defaultChecked: false },
                ].map((opt) => (
                  <label key={opt.label} className="flex items-start gap-3 cursor-pointer group">
                    <input type="checkbox" defaultChecked={opt.defaultChecked}
                      className="mt-0.5 h-4 w-4 rounded border-border text-primary focus:ring-primary/30" />
                    <div>
                      <span className="text-sm font-medium text-text-primary group-hover:text-primary transition-colors">{opt.label}</span>
                      <p className="text-xs text-text-tertiary">{opt.description}</p>
                    </div>
                  </label>
                ))}
                <Button>Сохранить настройки</Button>
              </CardContent>
            </Card>
          )}

          {/* ── ЛИЧНЫЙ ПРОФИЛЬ ── */}
          {activeTab === "personal" && (
            <>
              <Card>
                <CardHeader><CardTitle>Личные данные</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Avatar name={personal.name} size="lg" />
                    <div>
                      <p className="text-sm font-medium">{personal.name}</p>
                      <p className="text-xs text-text-tertiary">Менеджер · МеталлПро</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { label: "Имя", key: "name" },
                      { label: "Телефон", key: "phone" },
                      { label: "Email", key: "email" },
                    ].map(({ label, key }) => (
                      <div key={key} className="space-y-1.5">
                        <label className="text-[13px] font-medium text-text-primary">{label}</label>
                        <input value={(personal as any)[key]} onChange={(e) => setPersonal((p) => ({ ...p, [key]: e.target.value }))}
                          className="h-10 w-full rounded-[var(--radius-md)] border border-border bg-surface px-3 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                        />
                      </div>
                    ))}
                  </div>
                  <Button onClick={savePersonal}>
                    {personalSaved ? <><Check size={16} className="mr-1.5" />Сохранено</> : "Сохранить"}
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>Изменить пароль</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { label: "Текущий пароль", key: "currentPassword" },
                    { label: "Новый пароль", key: "newPassword" },
                    { label: "Повторите пароль", key: "confirmPassword" },
                  ].map(({ label, key }) => (
                    <div key={key} className="space-y-1.5">
                      <label className="text-[13px] font-medium text-text-primary">{label}</label>
                      <input type="password" value={(personal as any)[key]} onChange={(e) => setPersonal((p) => ({ ...p, [key]: e.target.value }))}
                        className="h-10 w-full rounded-[var(--radius-md)] border border-border bg-surface px-3 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  ))}
                  {personal.newPassword && personal.confirmPassword && personal.newPassword !== personal.confirmPassword && (
                    <p className="text-xs text-danger">Пароли не совпадают</p>
                  )}
                  <Button onClick={savePassword}
                    disabled={!personal.newPassword || personal.newPassword !== personal.confirmPassword}>
                    {passwordSaved ? <><Check size={16} className="mr-1.5" />Пароль изменён</> : "Изменить пароль"}
                  </Button>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>

      {/* Invite Employee Modal */}
      <Modal open={inviteOpen} onClose={() => setInviteOpen(false)} title="Пригласить сотрудника" size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setInviteOpen(false)}>Отмена</Button>
            <Button onClick={submitInvite} disabled={!invite.email.trim()}>Отправить приглашение</Button>
          </>
        }
      >
        <div className="space-y-3">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-text-primary">Имя</label>
            <input value={invite.name} onChange={(e) => setInvite((d) => ({ ...d, name: e.target.value }))}
              placeholder="Имя сотрудника (необязательно)"
              className="h-10 w-full rounded-[var(--radius-md)] border border-border bg-surface px-3 text-sm placeholder:text-text-tertiary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-text-primary">Email *</label>
            <input type="email" value={invite.email} onChange={(e) => setInvite((d) => ({ ...d, email: e.target.value }))}
              placeholder="email@company.ru"
              className="h-10 w-full rounded-[var(--radius-md)] border border-border bg-surface px-3 text-sm placeholder:text-text-tertiary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-text-primary">Роль</label>
            <select value={invite.role} onChange={(e) => setInvite((d) => ({ ...d, role: e.target.value }))}
              className="h-10 w-full rounded-[var(--radius-md)] border border-border bg-surface px-3 text-sm text-text-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
        </div>
      </Modal>

      {/* Change Role Modal */}
      <Modal open={!!changeRoleFor} onClose={() => setChangeRoleFor(null)} title="Изменить роль" size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setChangeRoleFor(null)}>Отмена</Button>
            <Button onClick={submitChangeRole}>Сохранить</Button>
          </>
        }
      >
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-text-primary">Новая роль</label>
          <select value={newRole} onChange={(e) => setNewRole(e.target.value)}
            className="h-10 w-full rounded-[var(--radius-md)] border border-border bg-surface px-3 text-sm text-text-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          >
            {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
      </Modal>

      {/* Delete Employee Confirm */}
      <ConfirmDialog
        open={!!deleteEmpId}
        onClose={() => setDeleteEmpId(null)}
        onConfirm={() => deleteEmployee(deleteEmpId!)}
        title="Удалить сотрудника?"
        description={`Сотрудник ${employees.find((e) => e.id === deleteEmpId)?.name} потеряет доступ к системе.`}
        confirmLabel="Удалить"
        danger
      />

      {/* Create Guest Link Modal */}
      <Modal open={createLinkOpen} onClose={() => setCreateLinkOpen(false)} title="Создать гостевую ссылку" size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setCreateLinkOpen(false)}>Отмена</Button>
            <Button onClick={createGuestLink} disabled={!newLink.name.trim()}>Создать</Button>
          </>
        }
      >
        <div className="space-y-3">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-text-primary">Название *</label>
            <input value={newLink.name} onChange={(e) => setNewLink((d) => ({ ...d, name: e.target.value }))}
              placeholder="Ссылка для клиента X"
              className="h-10 w-full rounded-[var(--radius-md)] border border-border bg-surface px-3 text-sm placeholder:text-text-tertiary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-text-primary">Сделка / раздел</label>
            <input value={newLink.deal} onChange={(e) => setNewLink((d) => ({ ...d, deal: e.target.value }))}
              placeholder="#2847 или Каталог"
              className="h-10 w-full rounded-[var(--radius-md)] border border-border bg-surface px-3 text-sm placeholder:text-text-tertiary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-text-primary">Действует до</label>
            <input type="date" value={newLink.expires} onChange={(e) => setNewLink((d) => ({ ...d, expires: e.target.value }))}
              className="h-10 w-full rounded-[var(--radius-md)] border border-border bg-surface px-3 text-sm text-text-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
