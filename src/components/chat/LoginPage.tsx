import { useState, useRef } from "react";
import { generateNick } from "./types";

interface LoginPageProps {
  onEnter: (nick: string) => void;
}

export default function LoginPage({ onEnter }: LoginPageProps) {
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
