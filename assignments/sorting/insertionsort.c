#include<stdio.h>
#include <stdlib.h>
#include <sys/time.h>
void insertionsort(int *a, int n){
	int  key, i, j; 
	for(i = 1; i < n; i++){
		key = a[i];
		j = i - 1;
		while(key < a[j] && j >= 0){
			a[j + 1] = a[j];
			j--;
		}
		a[j + 1] = key;
	}
	for(i = 0; i < n; i++){
		printf("%d ", a[i]);
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
	insertionsort(a, count);
	free(a);
	return 0;
}
