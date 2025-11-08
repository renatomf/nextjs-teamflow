import Link from "next/link";
import { Cloud, PlusCircle } from "lucide-react"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "../ui/empty"
import { buttonVariants } from "../ui/button";

interface Props {
  title: string;
  description: string;
  buttonText: string;
  href: string;
};

export function EmptyState({
  title,
  description,
  buttonText,
  href,
}: Props) {
  return (
    <Empty className="border border-dashed">
      <EmptyHeader>
        <EmptyMedia variant="icon" className="bg-primary/10">
          <Cloud />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Link href={href} className={buttonVariants()}>
          <PlusCircle />
          {buttonText}
        </Link>
      </EmptyContent>
    </Empty>
  )
}