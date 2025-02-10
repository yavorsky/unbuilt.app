import { transform, snakeCase, camelCase, isPlainObject } from 'lodash-es';

type CamelToSnake<T extends string> = T extends `${infer F}${infer R}`
  ? F extends Uppercase<F>
    ? `${F extends Lowercase<F> ? '' : '_'}${Lowercase<F>}${CamelToSnake<R>}`
    : `${F}${CamelToSnake<R>}`
  : T;

type SnakeToCamel<S extends string> = S extends `${infer T}_${infer U}`
  ? `${T}${Capitalize<SnakeToCamel<U>>}`
  : S;

type DeepCamelToSnake<T> = T extends object
  ? {
      [K in keyof T as CamelToSnake<K & string>]: DeepCamelToSnake<T[K]>;
    }
  : T;

type DeepSnakeToCamel<T> = T extends object
  ? {
      [K in keyof T as SnakeToCamel<K & string>]: DeepSnakeToCamel<T[K]>;
    }
  : T;

/**
 * Converts object keys from camelCase to snake_case recursively
 * @param obj - The input object with camelCase keys
 * @returns A new object with snake_case keys, maintaining the exact type structure
 */
export function toSnakeCase<T extends Record<string, unknown>>(
  obj: T
): DeepCamelToSnake<T> {
  return transform<T, DeepCamelToSnake<T>>(
    obj,
    (result, value, key) => {
      const newKey = snakeCase(key as string);

      if (isPlainObject(value)) {
        result[newKey as keyof DeepCamelToSnake<T>] = toSnakeCase(
          value as Record<string, unknown>
        ) as DeepCamelToSnake<T>[keyof DeepCamelToSnake<T>];
      } else {
        result[newKey as keyof DeepCamelToSnake<T>] =
          value as DeepCamelToSnake<T>[keyof DeepCamelToSnake<T>];
      }
    },
    {} as DeepCamelToSnake<T>
  );
}

/**
 * Converts object keys from snake_case to camelCase recursively
 * @param obj - The input object with snake_case keys
 * @returns A new object with camelCase keys, maintaining the exact type structure
 */
export function toCamelCase<T extends Record<string, unknown>>(
  obj: T
): DeepSnakeToCamel<T> {
  return transform<T, DeepSnakeToCamel<T>>(
    obj,
    (result, value, key) => {
      const newKey = camelCase(key as string);

      if (isPlainObject(value)) {
        result[newKey as keyof DeepSnakeToCamel<T>] = toCamelCase(
          value as Record<string, unknown>
        ) as DeepSnakeToCamel<T>[keyof DeepSnakeToCamel<T>];
      } else {
        result[newKey as keyof DeepSnakeToCamel<T>] =
          value as DeepSnakeToCamel<T>[keyof DeepSnakeToCamel<T>];
      }
    },
    {} as DeepSnakeToCamel<T>
  );
}
