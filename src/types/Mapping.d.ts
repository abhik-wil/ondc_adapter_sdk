export type Mapping<T> = {
  [P in keyof T]: string;
};
