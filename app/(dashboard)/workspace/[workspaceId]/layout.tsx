import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { CreateNewChannel } from "./_components/CreateNewChannel";
import { WorkspaceHeader } from "./_components/WorkspaceHeader";
import { ChevronDown, ChevronUp } from "lucide-react";
import { ChannelList } from "./_components/ChannelList";
import { WorkspaceMembersList } from "./_components/WorkspaceMembersList";

const ChannelListLayot = ({}: { children: React.ReactNode }) => {
  return ( 
    <>
    <div className="flex h-full w-80 flex-col bg-secondary border-r border-border">
      {/* Header */}
      <div className="flex items-center px-4  h-14 border-b border-border">
        <WorkspaceHeader />
      </div>

      <div className="px-4 py-2">
        <CreateNewChannel />
      </div>

      {/* Channel list */}
      <div className="flex-1 overflow-y-auto px-4">
        <Collapsible defaultOpen>
          <CollapsibleTrigger className="flex w-full items-center justify-between px-2 py-1 text-sm font-medium text-muted-foreground">
            Main
            <ChevronDown className="zie-4 transition-transform duration-200" />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <ChannelList />
          </CollapsibleContent>
        </Collapsible>
      </div>

      {/* Members List */}
      <div className="px-4 py-2 border-t border-border">
        <Collapsible defaultOpen>
          <CollapsibleTrigger className="flex w-full items-center justify-between px-2 py-1 text-sm font-medium text-muted-foreground hover:text-accent-foreground [&[data-state=open]>svg]:rotate-180">
            Members
            <ChevronUp className="size-4 transition-transform duration-200" />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <WorkspaceMembersList />
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
    </>
   );
}
 
export default ChannelListLayot;
