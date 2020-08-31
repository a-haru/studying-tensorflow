export function range(start: number, count: number): number[]
{
    return Array.from(Array(count), (v, k) => k + start)
}

export function chunk(arr: Array<any>, l: number): any[][]
{
    return arr.reduce((acc, value, index) => index % l ? acc : [...acc, arr.slice(index, index + l)], [])
}
