export type Mapping<T> = {
  [P in keyof T]-?: T[P] extends undefined
    ? never
    : P extends keyof T
      ? string
      : never;
};
