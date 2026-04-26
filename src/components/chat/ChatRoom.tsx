import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";
import { Message, Room, DEMO_MESSAGES, generateId, nowTime } from "./types";

interface ChatRoomProps {
  room: Room;
  nick: string;
  onBack: () => void;
}

export default function ChatRoom({ room, nick, onBack }: ChatRoomProps) {
  const isArchive = room.id === "archive";
  const [messages, setMessages] = useState<Message[]>(DEMO_MESSAGES[room.id] || []);
  const [input, setInput] = useState("");
  const [showArchive, setShowArchive] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function send() {
    if (!input.trim() || isArchive) return;
    const msg: Message = {
      id: generateId(),
      author: nick,
      text: input.trim(),
      time: nowTime(),
      own: true,
    };
    setMessages((prev) => [...prev, msg]);
    setInput("");
    inputRef.current?.focus();
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  const archiveMessages = DEMO_MESSAGES["archive"];

  return (
    <div
      className="min-h-screen flex flex-col animate-fade-in"
      style={{ background: "var(--chat-bg)" }}
    >
      <header
        className="sticky top-0 z-20 flex items-center gap-3 px-4 py-3"
        style={{
          background: "rgba(13,15,20,0.9)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid var(--chat-border)",
        }}
      >
        <button
          onClick={onBack}
          className="flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-150 active:scale-90"
          style={{
            background: "var(--chat-surface)",
            color: "var(--chat-text)",
            border: "1px solid var(--chat-border)",
          }}
        >
          <Icon name="ArrowLeft" size={16} />
        </button>

        <div className="flex items-center gap-2 flex-1">
          <span className="text-xl">{room.emoji}</span>
          <div>
            <div className="font-semibold text-sm" style={{ color: "var(--chat-text)" }}>
              {room.name}
            </div>
            <div className="text-xs" style={{ color: "var(--chat-muted)" }}>
              {room.online > 0 ? `${room.online} онлайн` : "архив — только чтение"}
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowArchive((v) => !v)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150"
          style={{
            background: showArchive ? "var(--chat-accent-dim)" : "var(--chat-surface)",
            color: showArchive ? "var(--chat-accent)" : "var(--chat-muted)",
            border: `1px solid ${showArchive ? "rgba(74,222,128,0.25)" : "var(--chat-border)"}`,
          }}
        >
          <Icon name="Archive" size={12} />
          Архив
        </button>
      </header>

      {showArchive && (
        <div
          className="px-4 py-3 animate-slide-up"
          style={{
            background: "var(--chat-surface)",
            borderBottom: "1px solid var(--chat-border)",
          }}
        >
          <p className="text-xs font-medium mb-2" style={{ color: "var(--chat-muted)" }}>
            🗂️ Архив переписки
          </p>
          <div className="space-y-1 max-h-40 overflow-y-auto">
            {archiveMessages.map((m) => (
              <div key={m.id} className="flex gap-2 text-xs">
                <span style={{ color: "var(--chat-accent)", opacity: 0.7 }}>{m.time}</span>
                <span style={{ color: "var(--chat-muted)" }}>{m.author}:</span>
                <span style={{ color: "rgba(226,232,240,0.6)" }}>{m.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-4 py-4 max-w-lg mx-auto w-full">
        <div className="space-y-1">
          {messages.map((msg, i) => {
            const isOwn = msg.author === nick;
            const prevAuthor = i > 0 ? messages[i - 1].author : null;
            const showAuthor = prevAuthor !== msg.author;

            return (
              <div
                key={msg.id}
                className="animate-message-in"
                style={{ animationDelay: `${Math.min(i * 0.03, 0.3)}s` }}
              >
                {showAuthor && (
                  <div
                    className={`text-xs font-medium mb-1 mt-3 ${isOwn ? "text-right" : ""}`}
                    style={{ color: isOwn ? "var(--chat-accent)" : "var(--chat-muted)" }}
                  >
                    {isOwn ? "Ты" : msg.author}
                  </div>
                )}
                <div className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
                  <div
                    className="max-w-xs lg:max-w-md px-4 py-2.5 rounded-2xl text-sm leading-relaxed"
                    style={{
                      background: isOwn ? "var(--chat-bubble-own)" : "var(--chat-bubble-other)",
                      color: "var(--chat-text)",
                      border: isOwn
                        ? "1px solid rgba(74,222,128,0.2)"
                        : "1px solid var(--chat-border)",
                      borderBottomRightRadius: isOwn ? "6px" : undefined,
                      borderBottomLeftRadius: !isOwn ? "6px" : undefined,
                    }}
                  >
                    {msg.text}
                    <span
                      className="ml-2 text-xs"
                      style={{ color: "var(--chat-muted)", opacity: 0.7, fontSize: "0.65rem" }}
                    >
                      {msg.time}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div ref={bottomRef} />
      </div>

      {!isArchive && (
        <div
          className="sticky bottom-0 px-4 py-3"
          style={{
            background: "rgba(13,15,20,0.9)",
            backdropFilter: "blur(12px)",
            borderTop: "1px solid var(--chat-border)",
          }}
        >
          <div
            className="flex items-end gap-2 max-w-lg mx-auto rounded-xl px-3 py-2"
            style={{
              background: "var(--chat-surface)",
              border: "1px solid var(--chat-border)",
            }}
          >
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Написать сообщение..."
              rows={1}
              maxLength={500}
              className="flex-1 bg-transparent resize-none text-sm outline-none py-1"
              style={{
                color: "var(--chat-text)",
                maxHeight: "120px",
                lineHeight: "1.5",
              }}
              onInput={(e) => {
                const el = e.currentTarget;
                el.style.height = "auto";
                el.style.height = Math.min(el.scrollHeight, 120) + "px";
              }}
            />
            <button
              onClick={send}
              disabled={!input.trim()}
              className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-150 active:scale-90"
              style={{
                background: input.trim() ? "var(--chat-accent)" : "var(--chat-surface2)",
                color: input.trim() ? "#0d0f14" : "var(--chat-muted)",
                border: "none",
              }}
            >
              <Icon name="Send" size={15} />
            </button>
          </div>
          <p className="text-center text-xs mt-1" style={{ color: "var(--chat-muted)", opacity: 0.4 }}>
            Enter — отправить · Shift+Enter — новая строка
          </p>
        </div>
      )}

      {isArchive && (
        <div
          className="sticky bottom-0 px-4 py-3 text-center text-xs"
          style={{
            background: "rgba(13,15,20,0.9)",
            borderTop: "1px solid var(--chat-border)",
            color: "var(--chat-muted)",
          }}
        >
          🗂️ Архив — только чтение
        </div>
      )}
    </div>
  );
}
