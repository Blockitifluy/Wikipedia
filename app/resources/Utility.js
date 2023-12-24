export function BinarySearch(arr, funct) {
    let start = 0;
    let end = arr.length - 1;
    while (start <= end) {
        let mid = Math.floor((start + end) / 2);
        if (funct(arr[mid]))
            return [arr[mid], mid];
        if (funct(arr[start]))
            return [arr[start], start];
        if (funct(arr[end]))
            return [arr[end], end];
        start += 1;
        end -= 1;
    }
    return [null, -1];
}
export function SplitAndTrim(text, div) {
    let split = text.split(div);
    for (let [i, str] of split.entries()) {
        split[i] = str.trim();
    }
    return split;
}
