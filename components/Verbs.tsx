import { Reveal } from "./Reveal";

export function Verbs({ items }: { items: { word: string; sub: string }[] }) {
  return (
    <Reveal stagger className="verbs">
      {items.map((item) => (
        <div className="verb" key={item.word}>
          <p className="verb-word">{item.word}</p>
          <p className="verb-sub">{item.sub}</p>
        </div>
      ))}
    </Reveal>
  );
}
