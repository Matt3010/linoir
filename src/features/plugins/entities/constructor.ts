/**
 * A utility alias type for defining a constructor with a generic type.
 * @template T - The type of the class being constructed.
 */
export type Constructor<T = {}> = new (...args: any[]) => T;
