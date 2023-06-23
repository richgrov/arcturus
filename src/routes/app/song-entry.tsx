import { JSX } from "solid-js";
import { TaggedSong } from "~/components/player";

export function SongEntry(props: {
  song: TaggedSong;
  class?: string;
  buttons: JSX.Element;
}) {
  return (
    <li
      class={`flex justify-between border-b border-gray-500 p-4 items-center ${props.class}`}
    >
      <div>
        <p>{props.song.name}</p>
        <p class="text-secondary-foreground dark:text-secondary-foreground-dark">
          {props.song.author || "Unknown Author"}
        </p>
      </div>
      {props.buttons}
    </li>
  );
}
