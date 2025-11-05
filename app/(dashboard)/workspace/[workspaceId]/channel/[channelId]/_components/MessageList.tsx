import { MessageItem } from "./message/MessageItem";

const messages = [
  {
    id: 1,
    message: "Hello how are you",
    date: new Date(),
    avatar: "https://avatars.githubusercontent.com/u/8278900?s=400&v=4",
    userName: "Renato Marques"
  }
];

export function MessageList() {
  return (
    <div className="relative h-full">
      <div className="h-full overflow-y-auto px-4">
        {messages.map((message) => (
          <MessageItem 
            key={message.id} 
            {...message}         
          />
        ))}
      </div>
    </div>
  )
};
