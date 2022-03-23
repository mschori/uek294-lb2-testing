export {}

interface Point {
    x: number;
    y: number;
}

function logPoint(p: Point) {
    console.log(`${p.x}, ${p.y}`);
}

// logs 12, 26
const point = {x: 12, y: 26, z: 2};
logPoint(point);

// --------> In a structural system, if two objects have the same shape, they are considered to be of the same type.


class VirtualPoint {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

logPoint(new VirtualPoint(13, 42))
