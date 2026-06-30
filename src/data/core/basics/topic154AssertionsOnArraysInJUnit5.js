export default {
  id: 'assertions-on-arrays-in-junit5',
  title: '154. Assertions on Arrays in JUnit 5',
  explanation: `Java arrays do not override equals() — comparing with assertEquals() checks reference equality, not content. JUnit 5 provides assertArrayEquals() specifically for array comparison.

**assertArrayEquals(expected, actual)**
Checks that two arrays have the same length and the same elements at each index. Supports all primitive array types plus Object[].

**Overloads:**
  assertArrayEquals(int[] expected, int[] actual)
  assertArrayEquals(long[] expected, long[] actual)
  assertArrayEquals(double[] expected, double[] actual, double delta)
  assertArrayEquals(Object[] expected, Object[] actual)
  assertArrayEquals(Object[] expected, Object[] actual, String message)

**Failure messages:**
On failure, JUnit 5 reports the index where the mismatch occurred:
  "array differ at element [2]: expected <5> but was <6>"

**Nested arrays (2D):**
For multi-dimensional arrays, use assertArrayEquals with Object[] — JUnit 5 recursively compares them.

**Delta for double arrays:**
  assertArrayEquals(new double[]{1.0, 2.0}, result, 0.001)

**Alternatives for Lists:**
For List comparisons, use assertEquals(list1, list2) directly — List.equals() compares element by element. No special assertion needed.

**assertIterableEquals:**
JUnit 5 also provides assertIterableEquals(expected, actual) for any Iterable (ArrayList, LinkedList, etc.) — compares elements in order.

**Order matters:**
assertArrayEquals checks order. {1,2,3} != {3,2,1}. To test unordered equality, sort both arrays first or use a Set comparison.`,
  code: `import org.junit.jupiter.api.*;
import static org.junit.jupiter.api.Assertions.*;
import java.util.*;

class ArrayAssertionTest {

    @Test
    void intArrayEquals() {
        int[] expected = {1, 2, 3, 4, 5};
        int[] actual = {1, 2, 3, 4, 5};
        assertArrayEquals(expected, actual);
    }

    @Test
    void stringArrayEquals() {
        String[] expected = {"a", "b", "c"};
        String[] actual = {"a", "b", "c"};
        assertArrayEquals(expected, actual, "String arrays must match");
    }

    @Test
    void doubleArrayWithDelta() {
        double[] expected = {1.0, 2.0, 3.0};
        double[] actual = {1.001, 1.999, 3.0005};
        assertArrayEquals(expected, actual, 0.005); // within 0.005 tolerance
    }

    @Test
    void twoDimensionalArray() {
        int[][] expected = {{1, 2}, {3, 4}};
        int[][] actual = {{1, 2}, {3, 4}};
        assertArrayEquals(expected, actual);
    }

    @Test
    void listComparison() {
        // For Lists, assertEquals works — List.equals() compares elements
        List<String> expected = List.of("x", "y", "z");
        List<String> actual = new ArrayList<>(List.of("x", "y", "z"));
        assertEquals(expected, actual);
    }

    @Test
    void iterableEquals() {
        // assertIterableEquals for any Iterable
        List<Integer> expected = List.of(10, 20, 30);
        Deque<Integer> actual = new ArrayDeque<>(List.of(10, 20, 30));
        assertIterableEquals(expected, actual);
    }

    @Test
    void unorderedArrayEquality() {
        int[] expected = {3, 1, 2};
        int[] actual = {1, 2, 3};
        Arrays.sort(expected);
        Arrays.sort(actual);
        assertArrayEquals(expected, actual); // now both are {1,2,3}
    }

    @Test
    void sortedArrayFromMethod() {
        int[] result = sortArray(new int[]{5, 3, 1, 4, 2});
        assertArrayEquals(new int[]{1, 2, 3, 4, 5}, result);
    }

    int[] sortArray(int[] arr) {
        Arrays.sort(arr);
        return arr;
    }
}`,
  codeTitle: 'Array Assertions in JUnit 5',
  points: [
    'Arrays in Java do not override equals() — use assertArrayEquals(), never assertEquals(), for array content comparison',
    'assertArrayEquals reports the exact index of the first mismatch in the failure message',
    'For double arrays, always use the delta overload: assertArrayEquals(expected, actual, delta)',
    'Multi-dimensional arrays are compared recursively by assertArrayEquals with Object[]',
    'For List and Collection comparisons, use assertEquals() — collections override equals() to compare elements',
    'assertIterableEquals compares any two Iterable types element-by-element in order',
    'To test unordered equality, sort both arrays first, then use assertArrayEquals',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'assertEquals(arr1, arr2) on arrays ALWAYS fails unless they are the same object in memory — Java arrays compare references. Use assertArrayEquals() every time you need to compare array contents.',
    },
    {
      type: 'interview',
      content: 'Q: How do you compare two arrays for equality in JUnit 5?\nA: Use assertArrayEquals(expected, actual). For primitive arrays (int[], double[]) it uses primitive equality. For Object arrays it calls .equals() on each element. For doubles, add a delta parameter to handle floating-point precision.',
    },
    {
      type: 'tip',
      content: 'When testing sorting algorithms or array transformations, keep the expected array as a literal in the test — do not reuse the input as the expected value. Keep the expected separate and hardcoded for clarity.',
    },
  ],
}
