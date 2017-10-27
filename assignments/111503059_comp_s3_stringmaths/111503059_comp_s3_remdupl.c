#include<stdio.h>
#include<stdlib.h>
#include<string.h>
void delete_duplicate(double *a){
	int i, j, k, size = 0;
	while(scanf("%lf", (a + size)) != -1){
		size++;
		a = (double *)realloc(a, (size + 1)*sizeof(double));		
	}
	for(i = 0; i < size; i++){
		for(j = i + 1; j < size; j++){
			if(a[i] == a[j]){
				for(k = j; k < (size - 1); k++){
					a[k] = a[k + 1];
				}
			size--;
			j--;
			}
		}
	}
	for(i = 0; i < size; i++){
		printf("%lf\n", a[i]);
	}
}
int main(){
	double *a;
	a = (double *)malloc(sizeof(double));
	delete_duplicate(a);
	return 0;
}


