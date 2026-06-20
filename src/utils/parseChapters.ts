import type { Chapter } from "../types";

export function mapToChapters(
  items: { title: string; content: string }[],
): Chapter[] {
  return items.map((item, i) => ({
    id: String(i + 1),
    title: item.title,
    content: item.content,
  }));
}
