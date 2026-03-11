"use client";

import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Buildings,
  IdentificationCard,
  Users,
  LinkSimple,
  Storefront,
  UserCircle,
  ShieldCheck,
  Plus,
  DotsThree,
  PencilSimple,
  Upload,
} from "@phosphor-icons/react";

const settingsTabs = [
  { label: "Профиль компании", icon: Buildings, active: true },
  { label: "Реквизиты", icon: IdentificationCard, active: false },
  { label: "Сотрудники", icon: Users, active: false },
  { label: "Гостевые входы", icon: LinkSimple, active: false },
  { label: "Каталог", icon: Storefront, active: false },
  { label: "Личный профиль", icon: UserCircle, active: false },
];

const employees = [
  { name: "Иван Смирнов", email: "ivan@metalpro.ru", role: "Менеджер", lastLogin: "Сегодня", status: "active" },
  { name: "Алексей Козлов", email: "alex@metalpro.ru", role: "Конструктор", lastLogin: "Сегодня", status: "active" },
  { name: "Мария Петрова", email: "maria@metalpro.ru", role: "Админ", lastLogin: "Вчера", status: "active" },
  { name: "Дмитрий Волков", email: "dmitry@metalpro.ru", role: "Менеджер", lastLogin: "5 дней назад", status: "active" },
  { name: "Ольга Новикова", email: "olga@metalpro.ru", role: "Менеджер", lastLogin: "Не входил", status: "invited" },
];

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-[-0.01em]">Настройки</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Settings nav */}
        <nav className="lg:col-span-1">
          <ul className="space-y-0.5">
            {settingsTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <li key={tab.label}>
                  <button
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-[var(--radius-md)] text-sm font-medium transition-colors ${
                      tab.active
                        ? "bg-primary-light text-primary"
                        : "text-text-secondary hover:bg-subtle hover:text-text-primary"
                    }`}
                  >
                    <Icon size={18} />
                    {tab.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Profile completion */}
          <Card>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-text-secondary">Заполненность профиля</h3>
              <span className="text-sm font-semibold text-primary tabular-nums">80%</span>
            </div>
            <Progress value={80} variant="default" />
            <p className="text-xs text-text-tertiary mt-2">
              Заполните описание компании и загрузите логотип для повышения доверия клиентов.
            </p>
          </Card>

          {/* Company profile */}
          <Card>
            <CardHeader>
              <CardTitle>Профиль компании</CardTitle>
              <Button variant="outline" size="sm">
                <PencilSimple size={14} className="mr-1" />
                Редактировать
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-20 w-20 rounded-[var(--radius-lg)] bg-subtle border-2 border-dashed border-border flex items-center justify-center text-text-tertiary hover:border-primary hover:text-primary transition-colors cursor-pointer">
                  <Upload size={24} />
                </div>
                <div>
                  <p className="text-sm font-medium">Логотип компании</p>
                  <p className="text-xs text-text-tertiary">PNG, JPG до 2 МБ. Рекомендуемый размер: 120×120</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Название компании" defaultValue='ООО «МеталлПро»' />
                <Input label="ИНН" defaultValue="7712345678" />
                <Input label="ОГРН" defaultValue="1177746123456" />
                <Input label="Регион" defaultValue="Москва" />
                <div className="sm:col-span-2">
                  <Input label="Юридический адрес" defaultValue="г. Москва, ул. Промышленная, д. 15, стр. 2" />
                </div>
              </div>

              <div>
                <label className="text-[13px] font-medium text-text-primary block mb-1.5">Специализации</label>
                <div className="flex flex-wrap gap-1.5">
                  <Badge variant="primary">Металлообработка</Badge>
                  <Badge variant="primary">Мебель</Badge>
                  <Badge variant="primary">Лазерная резка</Badge>
                  <button className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors font-medium">
                    <Plus size={12} /> Добавить
                  </button>
                </div>
              </div>

              <Button>Сохранить изменения</Button>
            </CardContent>
          </Card>

          {/* Employees */}
          <Card padding="none">
            <div className="flex items-center justify-between px-4 pt-4 pb-2">
              <h3 className="text-base font-semibold">Сотрудники</h3>
              <Button size="sm">
                <Plus size={14} className="mr-1.5" />
                Пригласить
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
                    <tr key={emp.email} className="border-b border-border last:border-0 hover:bg-subtle/30 transition-colors">
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
                        <Badge variant={emp.role === "Админ" ? "secondary" : "default"}>
                          {emp.role}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-text-secondary text-[13px]">{emp.lastLogin}</td>
                      <td className="px-4 py-3">
                        {emp.status === "active" ? (
                          <Badge variant="success" dot>Активен</Badge>
                        ) : (
                          <Badge variant="warning" dot>Приглашён</Badge>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <button className="p-1 rounded text-text-tertiary hover:text-text-primary hover:bg-subtle transition-colors">
                          <DotsThree size={18} weight="bold" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
