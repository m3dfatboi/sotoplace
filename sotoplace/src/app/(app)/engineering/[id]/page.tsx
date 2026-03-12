"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { FileUpload } from "@/components/ui/file-upload";
import { ConfirmDialog, Modal } from "@/components/ui/modal";
import {
  ArrowLeft,
  FileText,
  Clock,
  ChatCircle,
  CheckCircle,
  XCircle,
  UploadSimple,
  ArrowsCounterClockwise,
  Warning,
  PaperPlaneRight,
  ArrowSquareOut,
  Spinner,
} from "@phosphor-icons/react";

const versions = [
  {
    id: "v3",
    version: 3,
    name: "каркас_v3.pdf",
    date: "10 марта, 14:15",
    size: "2.4 МБ",
    status: "sent",
    statusLabel: "На согласовании",
    uploadedBy: "Алексей Козлов",
    rejectionReason: null,
  },
  {
    id: "v2",
    version: 2,
    name: "каркас_v2.pdf",
    date: "8 марта, 11:30",
    size: "2.1 МБ",
    status: "rejected",
    statusLabel: "Отклонено",
    uploadedBy: "Алексей Козлов",
    rejectionReason: "Толщина стенки 2мм недостаточна, нужно 3мм по ГОСТ",
  },
  {
    id: "v1",
    version: 1,
    name: "каркас_v1.pdf",
    date: "5 марта, 09:00",
    size: "1.8 МБ",
    status: "rejected",
    statusLabel: "Отклонено",
    uploadedBy: "Алексей Козлов",
    rejectionReason: "Не соответствует размерам ТЗ",
  },
];

const comments = [
  {
    id: "1",
    author: "Иван Смирнов",
    role: "Менеджер",
    text: "Клиент просит увеличить высоту на 50мм (с 750 до 800мм). Проверь совместимость с текущей схемой.",
    date: "10 марта, 14:30",
    version: "v3",
  },
  {
    id: "2",
    author: "Алексей Козлов",
    role: "Конструктор",
    text: "Принято. Обновлю в v4. При высоте 800мм вес увеличится примерно на 1.2кг, нужно согласовать с клиентом.",
    date: "10 марта, 15:15",
    version: "v3",
  },
  {
    id: "3",
    author: "Иван Смирнов",
    role: "Менеджер",
    text: "Клиент подтвердил — изменение веса приемлемо. Продолжай.",
    date: "10 марта, 15:40",
    version: "v3",
  },
];

const versionStatusVariant = {
  sent: "warning" as const,
  approved: "success" as const,
  rejected: "danger" as const,
  draft: "default" as const,
  rework: "secondary" as const,
};

export default function DrawingDetailPage() {
  const router = useRouter();
  const [selectedVersion, setSelectedVersion] = useState(versions[0]);
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [approveChecked, setApproveChecked] = useState(false);
  const [approveLoading, setApproveLoading] = useState(false);
  const [approved, setApproved] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [localComments, setLocalComments] = useState(comments);
  const [showUpload, setShowUpload] = useState(false);
  const [showReworkModal, setShowReworkModal] = useState(false);
  const [reworkReason, setReworkReason] = useState("");

  const handleApprove = async () => {
    setApproveLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setApproveLoading(false);
    setApproved(true);
    setShowApproveDialog(false);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3 flex-wrap">
        <Button variant="ghost" size="sm" onClick={() => router.push("/engineering")}>
          <ArrowLeft size={16} className="mr-1" />
          Инжиниринг
        </Button>
        <span className="text-text-tertiary">/</span>
        <span className="text-sm font-medium">Чертеж #2847-01</span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-[-0.01em]">
              Каркас стола СТ-120
            </h1>
            {approved ? (
              <Badge variant="success" dot>Согласовано</Badge>
            ) : (
              <Badge variant="warning" dot>На согласовании</Badge>
            )}
          </div>
          <p className="text-sm text-text-secondary mt-0.5">
            Сделка{" "}
            <span className="text-primary font-medium">#2847</span>
            {" · "}Позиция: Стол офисный СТ-120
            {" · "}Версия 3 из 3
          </p>
        </div>
        <div className="flex items-center gap-2">
          {!approved && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowUpload((v) => !v)}
            >
              <UploadSimple size={14} className="mr-1.5" />
              Загрузить новую версию
            </Button>
          )}
        </div>
      </div>

      {/* Upload area (conditional) */}
      {showUpload && (
        <Card>
          <h3 className="text-sm font-semibold mb-3">Загрузка новой версии (v4)</h3>
          <FileUpload
            accept=".pdf,.dwg,.step,.dxf"
            hint="PDF, DWG, STEP, DXF · до 50 МБ"
            label="Файл чертежа"
          />
          <div className="flex gap-2 mt-3">
            <Button size="sm">Сохранить и отправить на проверку</Button>
            <Button variant="ghost" size="sm" onClick={() => setShowUpload(false)}>
              Отмена
            </Button>
          </div>
        </Card>
      )}

      {/* Main layout */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
        {/* Preview area */}
        <div className="xl:col-span-3 space-y-4">
          <Card padding="none" className="overflow-hidden">
            {/* PDF Preview placeholder */}
            <div className="aspect-[3/4] bg-[#f0f0f0] flex items-center justify-center relative border-b border-border">
              <div className="text-center space-y-3">
                <FileText size={48} className="text-text-tertiary mx-auto" />
                <div>
                  <p className="text-sm font-medium text-text-primary">{selectedVersion.name}</p>
                  <p className="text-xs text-text-tertiary mt-1">{selectedVersion.size}</p>
                </div>
                <p className="text-xs text-text-tertiary">
                  Предпросмотр: откройте файл в CAD-просмотрщике
                </p>
                <Button variant="outline" size="sm">
                  <ArrowSquareOut size={14} className="mr-1.5" />
                  Открыть файл
                </Button>
              </div>

              {/* Zoom controls */}
              <div className="absolute top-3 right-3 flex flex-col gap-1">
                <button className="h-8 w-8 rounded-[var(--radius-md)] bg-surface border border-border text-text-secondary hover:bg-subtle transition-colors flex items-center justify-center text-lg font-bold">+</button>
                <button className="h-8 w-8 rounded-[var(--radius-md)] bg-surface border border-border text-text-secondary hover:bg-subtle transition-colors flex items-center justify-center text-lg font-bold">−</button>
              </div>
            </div>

            {/* Footer actions */}
            {!approved && selectedVersion.status === "sent" && (
              <div className="p-4 bg-warning-light border-t border-warning/20">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-2 text-sm text-[var(--color-warning-700)]">
                    <Warning size={16} weight="fill" />
                    <span>Ожидает вашего согласования</span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setShowReworkModal(true)}>
                      <XCircle size={14} className="mr-1.5" />
                      Запросить доработку
                    </Button>
                    <Button size="sm" onClick={() => setShowApproveDialog(true)}>
                      <CheckCircle size={14} className="mr-1.5" />
                      Согласовать
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {approved && (
              <div className="p-4 bg-success-light border-t border-success/20">
                <div className="flex items-center gap-2 text-sm text-[var(--color-success-700)]">
                  <CheckCircle size={16} weight="fill" />
                  <span>Чертёж согласован · передан в производство</span>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Sidebar: versions + comments */}
        <div className="xl:col-span-2 space-y-4">
          {/* Versions list */}
          <Card>
            <h3 className="text-sm font-semibold mb-3">Версии чертежа</h3>
            <div className="space-y-2">
              {versions.map((v) => (
                <div
                  key={v.id}
                  onClick={() => setSelectedVersion(v)}
                  className={`rounded-[var(--radius-md)] border p-3 cursor-pointer transition-colors space-y-1.5 ${
                    selectedVersion.id === v.id
                      ? "border-primary bg-primary-light"
                      : "border-border hover:bg-subtle"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <FileText size={14} className="text-text-tertiary" />
                      <span className="text-sm font-medium">v{v.version} · {v.name}</span>
                    </div>
                    <Badge variant={versionStatusVariant[v.status as keyof typeof versionStatusVariant]}>
                      {v.statusLabel}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-text-secondary">
                    <span><Clock size={10} className="inline mr-1" />{v.date}</span>
                    <span>{v.size}</span>
                  </div>
                  {v.rejectionReason && (
                    <p className="text-xs text-danger bg-danger-light rounded px-2 py-1">
                      {v.rejectionReason}
                    </p>
                  )}
                  {v.id !== versions[0].id && (
                    <button className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors">
                      <ArrowsCounterClockwise size={12} />
                      Сравнить с v{versions[0].version}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* Comments */}
          <Card>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold">Комментарии к v{selectedVersion.version}</h3>
              <Badge variant="default">{comments.length}</Badge>
            </div>

            <div className="space-y-3 max-h-72 overflow-y-auto">
              {localComments.map((c) => (
                <div key={c.id} className="flex items-start gap-2.5">
                  <Avatar name={c.author} size="sm" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2">
                      <span className="text-xs font-medium">{c.author}</span>
                      <span className="text-[10px] text-text-tertiary">{c.role}</span>
                      <span className="text-[10px] text-text-tertiary ml-auto">{c.date}</span>
                    </div>
                    <p className="text-xs text-text-secondary mt-0.5 leading-relaxed">{c.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-3 flex items-end gap-2 border-t border-border pt-3">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Написать комментарий..."
                rows={2}
                className="flex-1 rounded-[var(--radius-md)] border border-border bg-subtle px-3 py-2 text-xs placeholder:text-text-tertiary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
              />
              <Button size="icon" disabled={!newComment.trim()} onClick={() => {
                if (!newComment.trim()) return;
                setLocalComments((prev) => [...prev, {
                  id: String(prev.length + 1),
                  author: "Иван Смирнов",
                  role: "Менеджер",
                  text: newComment,
                  date: "только что",
                  version: `v${selectedVersion.version}`,
                }]);
                setNewComment("");
              }}>
                <PaperPlaneRight size={16} weight="fill" />
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Rework Modal */}
      <Modal open={showReworkModal} onClose={() => setShowReworkModal(false)} title="Запрос доработки" size="md"
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowReworkModal(false)}>Отмена</Button>
            <Button variant="danger" disabled={!reworkReason.trim()} onClick={() => {
              setLocalComments((prev) => [...prev, {
                id: String(prev.length + 1),
                author: "Иван Смирнов",
                role: "Менеджер",
                text: `🔴 Запрос доработки: ${reworkReason}`,
                date: "только что",
                version: `v${selectedVersion.version}`,
              }]);
              setReworkReason("");
              setShowReworkModal(false);
            }}>
              Отправить запрос
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <p className="text-sm text-text-secondary">
            Опишите что нужно исправить в чертеже <span className="font-medium">{selectedVersion.name}</span>.
            Конструктор получит уведомление.
          </p>
          <textarea
            value={reworkReason}
            onChange={(e) => setReworkReason(e.target.value)}
            placeholder="Укажите причину: несоответствие размерам ТЗ, неверный материал, ошибка в чертеже..."
            rows={4}
            className="w-full rounded-[var(--radius-md)] border border-border bg-subtle px-3 py-2 text-sm placeholder:text-text-tertiary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
          />
        </div>
      </Modal>

      {/* Approve Confirm Dialog */}
      <ConfirmDialog
        open={showApproveDialog}
        onClose={() => { setShowApproveDialog(false); setApproveChecked(false); }}
        onConfirm={handleApprove}
        title="Согласование чертежа"
        description={`Вы подтверждаете чертёж «Каркас стола СТ-120», версия 3. После согласования чертёж будет передан в производство. Внесение изменений возможно только через создание нового запроса на доработку.`}
        confirmLabel="Согласовать и передать в производство"
        loading={approveLoading}
        requireCheckbox="Я ознакомился с чертежом и подтверждаю его соответствие требованиям"
        checked={approveChecked}
        onCheckedChange={setApproveChecked}
      />
    </div>
  );
}
