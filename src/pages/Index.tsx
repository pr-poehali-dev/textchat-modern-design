import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";

// ─── Types ───────────────────────────────────────────────
interface Message {
  id: string;
  author: string;
  text: string;
  time: string;
  own?: boolean;
}

interface Room {
  id: string;
  name: string;
  emoji: string;
  description: string;
  online: number;
  lastMessage: string;
}

// ─── Demo data ────────────────────────────────────────────
const ROOMS: Room[] = [
  { id: "general",  name: "Общий",       emoji: "💬", description: "Разговоры обо всём",          online: 42,  lastMessage: "кто тут есть?" },
  { id: "tech",     name: "Технологии",  emoji: "⚙️", description: "Гаджеты, код, IT-новости",    online: 18,  lastMessage: "слышали про новый GPT?" },
  { id: "music",    name: "Музыка",      emoji: "🎵", description: "Треки, артисты, плейлисты",    online: 11,  lastMessage: "что слушаете сейчас?" },
  { id: "games",    name: "Игры",        emoji: "🎮", description: "Обсуждение игр и стримов",     online: 29,  lastMessage: "кто в CS идёт?" },
  { id: "random",   name: "Рандом",      emoji: "🎲", description: "Мемы, приколы, рандом",        online: 7,   lastMessage: "хаха это огонь" },
  { id: "archive",  name: "Архив",       emoji: "🗂️", description: "История всех переписок",       online: 0,   lastMessage: "только чтение" },
];

const DEMO_MESSAGES: Record<string, Message[]> = {
  general: [
    { id: "1", author: "анон_8821", text: "всем привет, как дела?", time: "21:04" },
    { id: "2", author: "анон_4477", text: "норм, работаю потихоньку", time: "21:05" },
    { id: "3", author: "анон_1190", text: "кто тут есть?", time: "21:09" },
    { id: "4", author: "анон_5532", text: "я здесь! давно не заходил сюда", time: "21:10" },
    { id: "5", author: "анон_8821", text: "классный чат, наконец-то без регистрации", time: "21:12" },
  ],
  tech: [
    { id: "1", author: "анон_2234", text: "слышали про новый GPT-5?", time: "20:55" },
    { id: "2", author: "анон_7761", text: "да, говорят AGI уже близко хаха", time: "20:57" },
    { id: "3", author: "анон_3309", text: "пока только хайп, реально AGI далеко", time: "21:01" },
  ],
  music: [
    { id: "1", author: "анон_9911", text: "что слушаете сейчас?", time: "20:40" },
    { id: "2", author: "анон_6643", text: "уже неделю на повторе kendrick lamar", time: "20:42" },
  ],
  games: [
    { id: "1", author: "анон_4411", text: "кто в CS идёт сегодня?", time: "21:00" },
    { id: "2", author: "анон_8823", text: "я готов, только кину матч", time: "21:02" },
    { id: "3", author: "анон_2218", text: "возьмите меня, ранг LEM", time: "21:03" },
  ],
  random: [
    { id: "1", author: "анон_5577", text: "хаха это огонь 🔥", time: "21:08" },
  ],
  archive: [
    { id: "1", author: "система", text: "Архив переписок — только чтение. Здесь хранятся старые сообщения.", time: "00:00" },
    { id: "2", author: "анон_1111", text: "первое сообщение в этом чате! 🚀", time: "15:30" },
    { id: "3", author: "анон_3344", text: "поздравляю всех с запуском", time: "15:32" },
    { id: "4", author: "анон_7788", text: "классный проект, удачи создателям", time: "15:45" },
  ],
};

function generateId() {
  return Math.random().toString(36).slice(2, 9);
}

function generateNick() {
  return "анон_" + Math.floor(1000 + Math.random() * 9000);
}

function nowTime() {
  return new Date().toLocaleTimeString("ru", { hour: "2-digit", minute: "2-digit" });
}

// ─── Login Page ───────────────────────────────────────────
function LoginPage({ onEnter }: { onEnter: (nick: string) => void }) {
  const [nick, setNick] = useState("");
  const [focused, setFocused] = useState(false);
  const suggested = useRef(generateNick());

  function handleEnter() {
    const name = nick.trim() || suggested.current;
    onEnter(name);
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 animate-fade-in"
      style={{ background: "var(--chat-bg)" }}
    >
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(74,222,128,0.06) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 w-full max-w-sm animate-slide-up">
        <div className="text-center mb-10">
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-5"
            style={{
              background: "var(--chat-accent-dim)",
              border: "1px solid rgba(74,222,128,0.25)",
            }}
          >
            <span className="text-3xl">💬</span>
          </div>
          <h1
            className="text-3xl font-bold tracking-tight mb-2"
            style={{ color: "var(--chat-text)", fontFamily: "'Golos Text', sans-serif" }}
          >
            Анонимный чат
          </h1>
          <p style={{ color: "var(--chat-muted)", fontSize: "0.9rem" }}>
            Без регистрации. Без слежки.
          </p>
        </div>

        <div
          className="rounded-2xl p-6"
          style={{
            background: "var(--chat-surface)",
            border: "1px solid var(--chat-border)",
          }}
        >
          <label
            className="block text-sm font-medium mb-2"
            style={{ color: "var(--chat-muted)" }}
          >
            Твой никнейм
          </label>
          <div className="relative mb-1">
            <input
              type="text"
              value={nick}
              onChange={(e) => setNick(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              onKeyDown={(e) => e.key === "Enter" && handleEnter()}
              placeholder={suggested.current}
              maxLength={24}
              className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all duration-200"
              style={{
                background: "var(--chat-surface2)",
                color: "var(--chat-text)",
                border: `1px solid ${focused ? "var(--chat-accent)" : "var(--chat-border)"}`,
                boxShadow: focused ? "0 0 0 3px rgba(74,222,128,0.1)" : "none",
              }}
            />
          </div>
          <p className="text-xs mb-5" style={{ color: "var(--chat-muted)" }}>
            Оставь пустым — получишь случайный ник
          </p>

          <button
            onClick={handleEnter}
            className="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-200 active:scale-95"
            style={{
              background: "var(--chat-accent)",
              color: "#0d0f14",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.opacity = "0.88";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.opacity = "1";
            }}
          >
            Войти в чат
          </button>
        </div>

        <p className="text-center text-xs mt-6" style={{ color: "var(--chat-muted)", opacity: 0.6 }}>
          Сообщения хранятся только в рамках сессии
        </p>
      </div>
    </div>
  );
}

// ─── Room List ────────────────────────────────────────────
function RoomList({
  nick,
  onSelect,
}: {
  nick: string;
  onSelect: (room: Room) => void;
}) {
  return (
    <div
      className="min-h-screen animate-fade-in"
      style={{ background: "var(--chat-bg)" }}
    >
      <header
        className="sticky top-0 z-20 px-4 py-3 flex items-center justify-between"
        style={{
          background: "rgba(13,15,20,0.85)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid var(--chat-border)",
        }}
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">💬</span>
          <span
            className="font-bold text-base"
            style={{ color: "var(--chat-text)", fontFamily: "'Golos Text', sans-serif" }}
          >
            Комнаты
          </span>
        </div>
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"
          style={{
            background: "var(--chat-accent-dim)",
            color: "var(--chat-accent)",
            border: "1px solid rgba(74,222,128,0.2)",
          }}
        >
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: "var(--chat-accent)" }}
          />
          {nick}
        </div>
      </header>

      <div className="px-4 py-4 max-w-lg mx-auto space-y-2">
        <p className="text-xs font-medium uppercase tracking-widest mb-4" style={{ color: "var(--chat-muted)" }}>
          Выбери комнату
        </p>
        {ROOMS.map((room, i) => (
          <button
            key={room.id}
            onClick={() => onSelect(room)}
            className="w-full text-left rounded-xl px-4 py-4 transition-all duration-200 group animate-slide-up"
            style={{
              background: "var(--chat-surface)",
              border: "1px solid var(--chat-border)",
              animationDelay: `${i * 0.05}s`,
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLButtonElement;
              el.style.borderColor = "rgba(74,222,128,0.25)";
              el.style.background = "var(--chat-surface2)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLButtonElement;
              el.style.borderColor = "var(--chat-border)";
              el.style.background = "var(--chat-surface)";
            }}
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl mt-0.5 flex-shrink-0">{room.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <span
                    className="font-semibold text-sm"
                    style={{ color: "var(--chat-text)" }}
                  >
                    {room.name}
                  </span>
                  {room.online > 0 ? (
                    <span className="text-xs" style={{ color: "var(--chat-accent)" }}>
                      {room.online} онлайн
                    </span>
                  ) : (
                    <span className="text-xs" style={{ color: "var(--chat-muted)" }}>
                      архив
                    </span>
                  )}
                </div>
                <p className="text-xs truncate" style={{ color: "var(--chat-muted)" }}>
                  {room.description}
                </p>
                <p
                  className="text-xs truncate mt-1"
                  style={{ color: "rgba(226,232,240,0.4)" }}
                >
                  {room.lastMessage}
                </p>
              </div>
              <Icon
                name="ChevronRight"
                size={16}
                className="flex-shrink-0 mt-1 transition-transform duration-200"
                style={{ color: "var(--chat-muted)" }}
              />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Chat Room ────────────────────────────────────────────
function ChatRoom({
  room,
  nick,
  onBack,
}: {
  room: Room;
  nick: string;
  onBack: () => void;
}) {
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

// ─── App Root ─────────────────────────────────────────────
type Screen = "login" | "rooms" | "chat";

export default function Index() {
  const [screen, setScreen] = useState<Screen>("login");
  const [nick, setNick] = useState("");
  const [activeRoom, setActiveRoom] = useState<Room | null>(null);

  function handleEnter(name: string) {
    setNick(name);
    setScreen("rooms");
  }

  function handleSelectRoom(room: Room) {
    setActiveRoom(room);
    setScreen("chat");
  }

  function handleBack() {
    setScreen("rooms");
    setActiveRoom(null);
  }

  if (screen === "login") return <LoginPage onEnter={handleEnter} />;
  if (screen === "rooms") return <RoomList nick={nick} onSelect={handleSelectRoom} />;
  if (screen === "chat" && activeRoom)
    return <ChatRoom room={activeRoom} nick={nick} onBack={handleBack} />;
  return null;
}
