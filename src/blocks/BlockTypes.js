// export function RandomBlockType() {
//     const k = Object.keys(BlockTypes)
//     return k[Math.floor(Math.random()*k.length)]
// }

export function BagOfBlocks() {
    const k = Object.keys(BlockTypes)
    k.sort(function() { return 0.5 - Math.random();})
    return k;
}

export const BlockTypes = {
    I: 'I',
    J: 'J',
    L: 'L',
    O: 'O',
    S: 'S',
    T: 'T',
    Z: 'Z'
}