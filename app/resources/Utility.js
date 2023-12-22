/**
 * O(log n)
 * @param arr The provide array to search
 * @param funct The function that returns a boolean, if matches
 * @returns The value and index in a tuple, returns [null, -1] if not found
 */
export function BinarySearch(arr, funct) {
    var start = 0;
    var end = arr.length - 1;
    while (start <= end) {
        console.count();
        var mid = Math.floor((start + end) / 2);
        if (funct(arr[mid])) {
            console.countReset();
            return [arr[mid], mid];
        }
        if (funct(arr[start])) {
            console.countReset();
            return [arr[start], start];
        }
        if (funct(arr[end])) {
            console.countReset();
            return [arr[end], end];
        }
        start += 1;
        end -= 1;
    }
    console.countReset();
    return [null, -1];
}
