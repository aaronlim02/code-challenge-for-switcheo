var sum_to_n_a = function(n) {
    /**
     * Time complexity of O(n): The loop runs n times, each with 1 addition operation.
     * Space Complexity of O(1): Only a few integer variables are used, regardless of n.
     */
    let result = 0;
    for (let i = 1; i <= n; i++) {
        result += i;
    }
    return result;
};

var sum_to_n_b = function(n) {
    /**
     * Time complexity of O(1): The formula executes in constant time with a few arithmetic
     * operations, regardless of n.
     * Space Complexity of O(1): Only a single variable is used.
     */
    return (n * (n + 1)) / 2;
};

var sum_to_n_c = function(n) {
    /**
     * Time complexity of O(n): The function makes n recursive calls, each adding 1 addition operation.
     * Space Complexity of O(n): Each recursive call adds a new frame to the call stack, leading to O(n) space usage.
     */
    if (n === 0) {
        return 0;
    }
    return n + sum_to_n_c(n - 1);
};

console.log(sum_to_n_a(5));
console.log(sum_to_n_b(5));
console.log(sum_to_n_c(5));
