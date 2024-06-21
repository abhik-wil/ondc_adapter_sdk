export type Mapping<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? (Mapping<U> | string)[]
    : T[P] extends object | undefined
      ? Mapping<NonNullable<T[P]>> | string
      : string;
};
