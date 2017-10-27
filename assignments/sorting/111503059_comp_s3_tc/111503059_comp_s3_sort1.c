#include <stdio.h>
#include<stdlib.h>
#include<sys/time.h>
void bubblesort(int *a, int count){
	int i, j, temp;
	for (i = 0; i < count - 1; i++){
		for (j = 0; j < count - i - 1; j++)
		{
			if (a[j] > a[j+1]){
        			temp = a[j];
       				 a[j] = a[j+1];
       				 a[j+1] = temp;
			}
		}
	} 
	for(i = 0; i < count; i++)
		printf("%d ", a[i]);
}
int main()
{
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
	/*struct timeval t1, t2;
	gettimeofday(&t1, NULL);
 	bubblesort(a, count);
 	gettimeofday(&t2, NULL);
 	printf("%f\n", (double)(t2.tv_usec   - t1.tv_usec) / 1000000 + (double)(t2.tv_sec - t1.tv_sec));*/
	bubblesort(a, count);
	free(a);
	return 0;
}


