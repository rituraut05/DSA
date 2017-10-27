#include<stdio.h>
#include <stdlib.h>
#include <sys/time.h>
void selectionsort(int *a, int n){
	int i, min, k, imin, temp, j;
	for(i = 0; i < n; i++){
		min = a[i];
		imin = i;
		for(j = i + 1; j < n; j++){
			if(a[j] < min){
				min = a[j];
				imin = j;
			}
		}
		temp = a[imin];
		a[imin] = a[i];
		a[i] = temp;
	}	
	for(j = 0; j < n; j++){
		printf("%d ", a[j]);
	}			
}
int main(){
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
	/*struct timeval t1, t2;
	gettimeofday(&t1, NULL);
	selectionsort(a, count);
 	gettimeofday(&t2, NULL);
 	printf("%f\n", (double)(t2.tv_usec   - t1.tv_usec) / 1000000 + (double)(t2.tv_sec - t1.tv_sec));*/
	selectionsort(a, count);
	free(a);
	return 0;
}

