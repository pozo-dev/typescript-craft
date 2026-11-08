interface Person {
    id: number,
    firstName: string,
    lastName: string,
    age: number
}

const persons: Person[] = [
    { id: 1, firstName: 'Jhon', lastName: 'Max', age: 14 },
    { id: 2, firstName: 'Anna', lastName: 'Martin', age: 67 },
    { id: 3, firstName: 'Jairo', lastName: 'Aniz', age: 86 },
    { id: 4, firstName: 'Quinto', lastName: 'Quiroz', age: 54 },
];

type sortableType = string | number;
type sortableKey<T> =
{
    [K in keyof T]-?:
        T[K] extends sortableType ? K : never;
}[keyof T];

/**
 * Returns a shallow-copied array sorted by a string or number property.
 * Defaults to ascending order and preserves the input array's order.
 * @throws {TypeError} If a comparison encounters unsupported or mixed value types.
 */
function sortByProperty<T>(
    items: readonly T[],
    property: sortableKey<T>,
    direction: 'asc' | 'desc' = 'asc'
): T[]
{
    const multiplier = direction === 'asc' ? 1 : -1;
    return [...items]
        .sort((a, b) =>
            {
                const valueA = a[property];
                const valueB = b[property];

                if (!isSortable(valueA) || !isSortable(valueB))
                    throw new TypeError('Unsupported sorting value');

                return compareValue(valueA, valueB) * multiplier;
            }
        );
}

function isSortable(value: unknown): value is sortableType
{
    return typeof value === 'string' || typeof value === 'number';
}

function compareValue(valueA: sortableType, valueB: sortableType): number
{
    if (typeof valueA === 'number' && typeof valueB === 'number')
    {
        if (valueA < valueB) return -1;
        if (valueA > valueB) return 1;
        return 0;
    }
    if (typeof valueA === 'string' && typeof valueB === 'string') 
    {
        return valueA.localeCompare(valueB);
    }
    const errorMessage: string = `No se pueden comparar tipos distintos: `;
    throw new TypeError(errorMessage + `${typeof valueA} y ${typeof valueB}`);
}

console.log('sort by lastName (asc) ', sortByProperty(persons, 'lastName'));
console.log('sort by lastName (desc) ', sortByProperty(persons, 'lastName', 'desc'));
console.log('sort by age (asc) ', sortByProperty(persons, 'age'));
console.log('sort by age (desc) ', sortByProperty(persons, 'age', 'desc'));