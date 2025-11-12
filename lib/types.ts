import { GroupedReactionSchemaType } from "@/app/schemas/message";
import { Message } from "./generated/prisma/client";

export type MessageListItem = Message & {
  repliesCount: number;
  reactions: GroupedReactionSchemaType[];
};
