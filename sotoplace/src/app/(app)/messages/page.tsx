"use client";

import { useState } from "react";
import { useRole } from "@/contexts/role-context";
import { DIALOGS } from "@/lib/mock-data";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { PaperPlaneRight, MagnifyingGlass } from "@phosphor-icons/react";
import { cn } from "@/lib/cn";

export default function MessagesPage() {
  const { user } = useRole();
  const router = useRouter();
  const [activeDialogId, setActiveDialogId] = useState(DIALOGS[0].id);
  const [input, setInput] = useState("");
  const [dialogs, setDialogs] = useState(DIALOGS);

  const activeDialog = dialogs.find((d) => d.id === activeDialogId) ?? dialogs[0];

  const sendMessage = () => {
    if (!input.trim()) return;
    const msg = {
      id: `m-${Date.now()}`,
      author: user.name,
      authorInitials: user.initials,
      mine: true,
      text: input.trim(),
      time: new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" }),
    };
    setDialogs((prev) =>
      prev.map((d) =>
        d.id === activeDialogId
          ? { ...d, messages: [...d.messages, msg], lastMsg: msg.text, time: msg.time, unread: 0 }
          : d
      )
    );
    setInput("");
  };

  return (
    <div className="flex h-[calc(100vh-var(--topbar-height)-3rem)] min-h-[500px] rounded-[var(--radius-xl)] border border-border overflow-hidden bg-surface">
      {/* Dialog list */}
      <div className="w-72 shrink-0 border-r border-border flex flex-col">
        <div className="px-4 py-3 border-b border-border">
          <div className="relative">
            <MagnifyingGlass size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-tertiary" />
            <input
              type="search"
              placeholder="Поиск диалогов..."
              className="h-8 w-full rounded-[var(--radius-md)] border border-border bg-subtle pl-8 pr-3 text-[13px] placeholder:text-text-tertiary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {dialogs.map((dialog) => (
            <button
              key={dialog.id}
              onClick={() => setActiveDialogId(dialog.id)}
              className={cn(
                "flex items-start gap-3 w-full px-4 py-3 text-left transition-colors hover:bg-subtle",
                activeDialogId === dialog.id && "bg-primary-light"
              )}
            >
              <Avatar initials={dialog.initials} size="sm" online={dialog.online} />
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-1">
                  <span className={cn("text-sm font-semibold truncate", activeDialogId === dialog.id ? "text-primary" : "text-text-primary")}>
                    {dialog.name}
                  </span>
                  <span className="text-[10px] text-text-tertiary shrink-0">{dialog.time}</span>
                </div>
                <p className="text-xs text-text-tertiary truncate mt-0.5">{dialog.lastMsg}</p>
                <p className="text-[10px] text-primary mt-0.5">Сделка {dialog.dealNum}</p>
              </div>
              {dialog.unread > 0 && (
                <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-bold text-white shrink-0">
                  {dialog.unread}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
          <Avatar initials={activeDialog.initials} size="sm" online={activeDialog.online} />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-text-primary">{activeDialog.name}</p>
            <p className="text-xs text-text-tertiary">
              {activeDialog.online ? "Онлайн" : "Не в сети"} · Сделка{" "}
              <button
                onClick={() => router.push(`/deals/${activeDialog.dealNum.replace("#", "")}`)}
                className="text-primary hover:underline"
              >
                {activeDialog.dealNum}
              </button>
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {activeDialog.messages.map((msg) => (
            <div key={msg.id} className={cn("flex gap-3 items-end", msg.mine && "flex-row-reverse")}>
              {!msg.mine && <Avatar initials={msg.authorInitials} size="sm" />}
              <div className={cn("max-w-[70%]", msg.mine && "items-end flex flex-col")}>
                {!msg.mine && (
                  <p className="text-[11px] font-medium text-text-secondary mb-1 px-1">{msg.author}</p>
                )}
                <div className={cn(
                  "rounded-[var(--radius-lg)] px-3 py-2 text-sm",
                  msg.mine ? "bg-primary text-white rounded-br-sm" : "bg-subtle text-text-primary rounded-bl-sm"
                )}>
                  {msg.text}
                </div>
                <p className="text-[10px] text-text-tertiary mt-1 px-1">{msg.time}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-border px-4 py-3 flex items-end gap-3">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
            placeholder="Написать сообщение... (Enter — отправить)"
            rows={1}
            className="flex-1 resize-none rounded-[var(--radius-md)] border border-border bg-surface px-3 py-2 text-sm placeholder:text-text-tertiary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 max-h-32"
          />
          <Button size="icon" onClick={sendMessage} disabled={!input.trim()}>
            <PaperPlaneRight size={18} weight="fill" />
          </Button>
        </div>
      </div>
    </div>
  );
}
