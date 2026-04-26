import Icon from "@/components/ui/icon";
import { Room, ROOMS } from "./types";

interface RoomListProps {
  nick: string;
  onSelect: (room: Room) => void;
}

export default function RoomList({ nick, onSelect }: RoomListProps) {
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
