export const key = Symbol();

export interface State {
  songCache: Record<string, any>;
  queue: string[],
}
