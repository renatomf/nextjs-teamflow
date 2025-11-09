import { ThemeToggle } from "@/components/theme-toggle";
import { InviteMember } from "./member/InviteMember";
import { MembersOverview } from "./member/MembersOverview";

interface Props {
  channelName: string | undefined;
}

export function ChannelHeader ({ channelName }: Props) {
  return (
    <div className="flex items-center justify-between h-14 px-4 border-b">
      <h1 className="text-lg font-semibold"># {channelName}</h1>

      <div className="flex items-center space-x-3">
        <MembersOverview />
        <InviteMember />
        <ThemeToggle />
      </div>
    </div>
  )
};
