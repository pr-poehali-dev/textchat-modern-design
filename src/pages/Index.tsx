import { useState } from "react";
import { Room } from "@/components/chat/types";
import LoginPage from "@/components/chat/LoginPage";
import RoomList from "@/components/chat/RoomList";
import ChatRoom from "@/components/chat/ChatRoom";

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
