import { children as childrenConsumer } from "solid-js";
import type { JSX } from "solid-js";

interface Props {
  children?: JSX.Element;
  rightPath: string;
  url: string;
}

export default function NavItem({ children, rightPath, url }: Props) {
  const c = childrenConsumer(() => children);
  let pathname = "";

  try {
    pathname = new URL(url).pathname;
  } catch (err) {}

  return (
    <li class={rightPath === pathname ? "text-yellow-200" : undefined}>
      <a href={rightPath}>{c()}</a>
    </li>
  );
}
