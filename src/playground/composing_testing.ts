export {}

type MyBool = true | false;
type MyNumber = 42 | 24;
type MyString = "open" | "closed" | "minimized";


function getLength(obj: string | string[]) {
    return obj.length;
}

function wrapInArray(obj: string | string[]) {
    if (typeof obj === "string") {
        return [obj]
    }
    return obj;
}


