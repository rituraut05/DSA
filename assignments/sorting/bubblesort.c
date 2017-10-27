#include <stdio.h>
#include<stdlib.h>
int main()
{
  int array[100], n, c, d, swap;
  	int *a, i, count = 0, num, size = 1024; 
	a = (int *)malloc(sizeof(int) * size);
	/* Do "man scanf". Scanf returns -1 when there is "no input" 
	 * To tell scanf that there is no input, you can press "control-d" 
	 * in stdio.h EOF is #defined to be -1 */
	while(scanf("%d", &num) != EOF) {
		a[count] = num;
		count++;
		if(count == size) {
			size *= 2;
			a = (int *)realloc(a, sizeof(int) * size);
			if(a == NULL) {
				printf("Failed for %d\n", size);
				exit(1);
			}
		}
	}
 

 
  for (c = 0 ; c < ( count - 1 ); c++)
  {
    for (d = 0 ; d < count - c - 1; d++)
    {
      if (a[d] > a[d+1]) /* For decreasing order use < */
      {
        swap       = a[d];
        a[d]   = a[d+1];
        a[d+1] = swap;
      }
    }
  }
 
  printf("Sorted list in ascending order:\n");
 
  struct timeval t1, t2;
	gettimeofday(&t1, NULL);
 	bubblesort(a, count);
 	gettimeofday(&t2, NULL);
 	printf("%f\n", (double)(t2.tv_usec   - t1.tv_usec) / 1000000 + (double)(t2.tv_sec - t1.tv_sec));
	free(a);
 
  return 0;
}


