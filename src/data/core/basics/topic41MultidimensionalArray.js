export default {
  id: 'multidimensional-array',
  title: '41. Multidimensional Array',
  explanation: `A **multidimensional array** is an array of arrays. In Java, the most common form is the **2D array** (matrix), but any number of dimensions is technically possible.

**2D array declaration and creation:**
\`\`\`java
int[][] matrix = new int[3][4]; // 3 rows, 4 columns — 12 cells
int[][] grid = {{1,2},{3,4},{5,6}}; // literal form
\`\`\`

**Accessing elements:**
\`\`\`java
matrix[row][col]   // row 0 is the first row, col 0 is the first column
\`\`\`

**How Java stores 2D arrays:**
Java implements 2D arrays as an **array of array references** — not a contiguous 2D block of memory. \`matrix[0]\` is itself an \`int[]\`.

This means:
- \`matrix.length\` = number of rows
- \`matrix[0].length\` = number of columns in row 0

**Iterating:**
\`\`\`java
for (int r = 0; r < matrix.length; r++) {
    for (int c = 0; c < matrix[r].length; c++) {
        // matrix[r][c]
    }
}
\`\`\`

**Memory layout:** each row is a separate heap object. \`matrix\` is a reference to an array of row references. This is why rows can have **different lengths** (jagged arrays).

**3D arrays** follow the same pattern: \`int[][][] cube = new int[3][3][3];\``,
  code: `import java.util.Arrays;

public class MultidimensionalArray {
    public static void main(String[] args) {
        // 2D array: 3 rows × 4 columns
        int[][] matrix = new int[3][4];
        int val = 1;
        for (int r = 0; r < matrix.length; r++) {
            for (int c = 0; c < matrix[r].length; c++) {
                matrix[r][c] = val++;
            }
        }
        // Print as grid
        for (int[] row : matrix) {
            System.out.println(Arrays.toString(row));
        }
        // [1, 2, 3, 4]
        // [5, 6, 7, 8]
        // [9, 10, 11, 12]

        // Literal initialization
        int[][] identity = {
            {1, 0, 0},
            {0, 1, 0},
            {0, 0, 1}
        };
        System.out.println(identity[1][1]); // 1 (middle element)

        // Matrix multiplication (2x2 × 2x2 = 2x2)
        int[][] a = {{1, 2}, {3, 4}};
        int[][] b = {{5, 6}, {7, 8}};
        int[][] c = new int[2][2];
        for (int r = 0; r < 2; r++) {
            for (int col = 0; col < 2; col++) {
                for (int k = 0; k < 2; k++) {
                    c[r][col] += a[r][k] * b[k][col];
                }
            }
        }
        System.out.println(Arrays.deepToString(c)); // [[19, 22], [43, 50]]
    }
}`,
  codeTitle: '2D Array — Grid, Identity Matrix, Matrix Multiply',
  points: [
    'In Java, a 2D array is an array of arrays (array of row references), not a contiguous 2D memory block',
    'matrix.length gives the number of rows; matrix[0].length gives the number of columns in the first row',
    'Use nested for loops to iterate — outer loop over rows, inner loop over columns',
    'Arrays.deepToString() prints multi-dimensional arrays in a human-readable format',
    'Because rows are independent arrays, each can have a different length — this is the basis for jagged arrays',
    '3D and higher arrays follow the same nesting pattern: int[][][] is an array of 2D arrays',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'Arrays.toString(matrix) prints the address of each row (e.g., [[I@...), not the contents. Use Arrays.deepToString(matrix) for full contents of any multidimensional array.',
    },
    {
      type: 'tip',
      content: 'For matrix operations in production code, prefer a library like Apache Commons Math or ND4J. Hand-rolled nested loops are fine for learning but error-prone at scale.',
    },
    {
      type: 'interview',
      content: 'Q: How is a 2D array stored in Java memory?\nA: As an array of references, each pointing to a 1D array (row). matrix[r] is the r-th row (a separate heap object). This is why rows can have different lengths in jagged arrays.',
    },
  ],
}
