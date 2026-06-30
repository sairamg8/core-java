export default {
  id: 'jagged-and-3d-arrays',
  title: '42. Jagged and 3D Arrays',
  explanation: `**Jagged arrays** (also called ragged arrays) are 2D arrays where each row has a **different length**. This is possible in Java because a 2D array is an array of row references — each row is an independent array.

**Creating a jagged array:**
\`\`\`java
int[][] jagged = new int[3][];  // 3 rows, column count unspecified
jagged[0] = new int[1];         // row 0: 1 element
jagged[1] = new int[3];         // row 1: 3 elements
jagged[2] = new int[2];         // row 2: 2 elements
\`\`\`

**Use cases for jagged arrays:**
- Pascal's triangle (each row has 1 more element than the previous)
- Adjacency lists for graphs (each vertex has a different number of neighbors)
- Month-day mapping (January=31 days, February=28/29, etc.)
- Any naturally irregular 2D structure

**3D arrays:**
A 3D array is an array of 2D arrays:
\`\`\`java
int[][][] cube = new int[2][3][4]; // 2 layers, each 3×4
\`\`\`
- \`cube.length\` = 2 (layers)
- \`cube[0].length\` = 3 (rows per layer)
- \`cube[0][0].length\` = 4 (columns per row)

3D arrays model: RGB pixels (height × width × 3 channels), game boards, 3D grids.`,
  code: `import java.util.Arrays;

public class JaggedAnd3DArrays {
    public static void main(String[] args) {
        // Jagged array: each row has different length
        int[][] jagged = new int[4][];
        jagged[0] = new int[]{1};
        jagged[1] = new int[]{1, 2};
        jagged[2] = new int[]{1, 2, 3};
        jagged[3] = new int[]{1, 2, 3, 4};

        System.out.println("Jagged array:");
        for (int[] row : jagged) {
            System.out.println(Arrays.toString(row));
        }
        // [1]
        // [1, 2]
        // [1, 2, 3]
        // [1, 2, 3, 4]

        // Pascal's triangle (classic jagged array use case)
        int n = 5;
        int[][] pascal = new int[n][];
        for (int r = 0; r < n; r++) {
            pascal[r] = new int[r + 1];
            pascal[r][0] = 1;
            pascal[r][r] = 1;
            for (int c = 1; c < r; c++) {
                pascal[r][c] = pascal[r-1][c-1] + pascal[r-1][c];
            }
        }
        for (int[] row : pascal) System.out.println(Arrays.toString(row));

        // 3D array: 2 layers of 3×3 matrices
        int[][][] cube = new int[2][3][3];
        cube[0][1][2] = 99;
        System.out.println(cube[0][1][2]); // 99
        System.out.println(Arrays.deepToString(cube));
    }
}`,
  codeTitle: 'Jagged Array (Pascal Triangle) and 3D Array',
  points: [
    'Jagged arrays are created by specifying only the first dimension: int[][] j = new int[3][], then assigning each row independently',
    'Each row of a jagged array is a completely independent int[] object on the heap — that is why lengths can differ',
    'Pascal\'s triangle is the canonical jagged array example: row r has r+1 elements',
    '3D arrays add one more level of nesting: int[][][] cube = new int[layers][rows][cols]',
    'Arrays.deepToString() works for any depth of nesting and is the easiest way to print 3D arrays',
    'Real use cases for 3D arrays: image data (height × width × RGB), animation frames, tensor data',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'When you create a jagged array (int[][] j = new int[3][]), accessing j[0] before assigning it throws NullPointerException — each row is null until explicitly assigned.',
    },
    {
      type: 'tip',
      content: 'Use jagged arrays when the data is naturally irregular. Do not waste memory padding rows to equal length when a jagged structure better matches the domain model.',
    },
    {
      type: 'interview',
      content: 'Q: Can rows of a 2D array have different lengths in Java?\nA: Yes — this is the jagged (ragged) array. Declare with int[][] j = new int[rows][] (no column count), then assign each row: j[i] = new int[size].',
    },
  ],
}
