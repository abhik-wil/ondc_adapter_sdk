export type Mapping<T> = {
  [P in keyof T]: T[P] extends Array<infer U>
    ? {[K in `${P & string}[]`]: Mapping<U>} & {[K in P]: never}
    : T[P] extends object
      ? Mapping<T[P]>
      : string;
} extends infer O
  ? {[K in keyof O]: O[K]}
  : never;
