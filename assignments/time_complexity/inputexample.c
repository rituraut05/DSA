#include <stdio.h>
#include <stdlib.h>
#include <sys/time.h>
int main() {
	int *a, i, n, count = 0, num, size = 1024; 
	struct timeval tv1, tv2;
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
	free(a);
	return 0;
}
