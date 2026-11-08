# Sort by Property

## Problem

Sort objects by one string or number property, in ascending or descending order, while preserving the original array. Useful for ordering records such as people by age or last name.

## Usage

Place this example in the exercise file, where the function is defined:

```ts
const people = [
    { name: 'Anna', age: 67 },
    { name: 'Jhon', age: 14 },
];

sortByProperty(people, 'age');
// [{ name: 'Jhon', age: 14 }, { name: 'Anna', age: 67 }]

sortByProperty(people, 'age', 'desc');
// [{ name: 'Anna', age: 67 }, { name: 'Jhon', age: 14 }]
```

Ascending order is the default. The function is not currently exported as a module API.

## TypeScript Concepts

- **Generics (`T`)** preserve the item type in the returned `T[]`.
- **`keyof`, mapped types, and conditional types** build `sortableKey<T>`, retaining keys whose declared values extend `string | number`. Indexing the mapped type with `[keyof T]` produces the union of eligible keys. The `-?` modifier removes optionality from the mapped entries; it does not make optional source properties valid under strict null checking.
- **A type predicate (`value is sortableType`)** narrows unknown values after runtime validation. `typeof` checks then distinguish numeric and textual comparisons.
- **A string literal union (`'asc' | 'desc'`)** restricts the direction argument at compile time.
- **`readonly T[]`** allows mutable or readonly input arrays and prevents array mutation through this parameter at compile time.

## Design Decisions

The implementation makes the following choices:

- **Property restrictions:** declared string and number properties are eligible. Boolean, date, and object properties are excluded. A `string | number` property is also eligible, although comparing values of different types throws at runtime.
- **Mutability:** spreading `items` creates a shallow copy before calling `.sort()`. The input order is preserved, but returned items reference the same objects.
- **Comparison:** numbers use relational comparisons; strings use `localeCompare()` without an explicit locale or options. A multiplier reverses the comparison result for descending order.
- **Errors:** comparisons involving unsupported values throw `TypeError('Unsupported sorting value')`. Comparing a string with a number also throws `TypeError`, with a message identifying both types. Neither value is coerced.

Possible extensions, not implemented, include validating all values before sorting and rejecting `NaN`. Converting numeric strings to numbers would require a different comparison policy; the current function keeps text and numbers separate.

## Edge Cases and Limitations

- Empty and single-item inputs return a new array without invoking the comparator. Runtime validation therefore does not guarantee that every input value is checked.
- Comparing `"2"` with `2` throws. Comparing `"2"` with `"10"` uses textual ordering, not numeric ordering.
- `NaN` passes the number type check. Both relational checks return false, so the comparator returns `0` against any number. Inputs containing `NaN` therefore lack a consistent numeric ordering.
- Equal infinities return `0`; negative and positive infinity otherwise follow numeric order.
- Text ordering depends on the runtime's locale behavior. There is no explicit case, accent, or numeric-string configuration.
- Under the configured strict checking, optional properties and properties including `null` or `undefined` are excluded. External data can still violate declared types and fail during comparison.
- Equal comparisons preserve input order with stable JavaScript sorting, provided the comparator defines a consistent ordering.
- The file contains console demonstrations, not automated assertions. The project has no test script configured.

## Complexity

For `n` items, copying the array takes O(n) time and O(n) additional space. Assuming the runtime sort uses O(n log n) comparisons and each comparison has constant cost, total time is O(n log n). JavaScript does not guarantee a particular sorting algorithm or complexity.

String comparison cost also depends on string length and collation. Total additional space is O(n) for the copy plus the sorting implementation's working memory; it is O(n) overall if that working memory is at most linear.

## Run

From the repository root, with dependencies installed:

```sh
npm start
```

The configured script checks this file with TypeScript using `--noEmit --strict --target es2022`, then executes it with `tsx` if checking succeeds. It prints ascending and descending examples for `lastName` and `age`.
