export interface Message {
  id: string;
  author: string;
  text: string;
  time: string;
  own?: boolean;
}

export interface Room {
  id: string;
  name: string;
  emoji: string;
  description: string;
  online: number;
  lastMessage: string;
}

export const ROOMS: Room[] = [
  { id: "general",  name: "Общий",       emoji: "💬", description: "Разговоры обо всём",          online: 42,  lastMessage: "кто тут есть?" },
  { id: "tech",     name: "Технологии",  emoji: "⚙️", description: "Гаджеты, код, IT-новости",    online: 18,  lastMessage: "слышали про новый GPT?" },
  { id: "music",    name: "Музыка",      emoji: "🎵", description: "Треки, артисты, плейлисты",    online: 11,  lastMessage: "что слушаете сейчас?" },
  { id: "games",    name: "Игры",        emoji: "🎮", description: "Обсуждение игр и стримов",     online: 29,  lastMessage: "кто в CS идёт?" },
  { id: "random",   name: "Рандом",      emoji: "🎲", description: "Мемы, приколы, рандом",        online: 7,   lastMessage: "хаха это огонь" },
  { id: "archive",  name: "Архив",       emoji: "🗂️", description: "История всех переписок",       online: 0,   lastMessage: "только чтение" },
];

export const DEMO_MESSAGES: Record<string, Message[]> = {
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

export function generateId() {
  return Math.random().toString(36).slice(2, 9);
}

export function generateNick() {
  return "анон_" + Math.floor(1000 + Math.random() * 9000);
}

export function nowTime() {
  return new Date().toLocaleTimeString("ru", { hour: "2-digit", minute: "2-digit" });
}
