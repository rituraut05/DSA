/*The generic function calls the function with specific data type as a parameter. The caller knows which data type we are comparing. 
  So the caller passes the respective compare function to the generic compare function*/

#include <stdio.h>
#include <string.h>
int min(void *a, int n, int(*cmp)(void *a, int, int)) {
	int i = 0, minpos = 0;	
	while(i < n) {
		if(cmp(a, i, minpos) < 0) {
			minpos = i;
		}
		i++;
	}
	return minpos;
}
/*int min(int *a, int n) {
	int i = 0, min = a[0], minpos = 0;	
	while(i < n) {
		if(a[i] < min) {
			minpos = i;
			min = a[i];
		}
		i++;
	}
	return minpos;
}*/
typedef struct data {
	char name[16];
	int age;
}data;
int intcmp(void *p, int x, int y) {
	int *a = (int *)p;
	if(a[x] < a[y])
		return -1;
	if(a[x] == a[y])
		return 0;
	return 1;	
}
int structcmp(void *p, int x, int y) {
	data *a = (data *)p;	
	return strcmp(a[x].name, a[y].name);	
}
int structicmp(void *p, int x, int y) {
	data *a = (data *)p;	
	if(a[x].age < a[y].age)
		return -1;
	if(a[x].age == a[y].age)
		return 0;
	return 1;	
}
int main() {
	int a[16], n, i = 0, x;
	data d[16];	
/*	while(scanf("%d", &a[i++]) != -1)
		;
	n = i - 1;
	x = min(a, n, intcmp);
	printf("%d\n", x);
	
*/	i = 0;
	while(scanf("%s%d", d[i].name, &d[i].age) != -1)
		i++;
	n = i;
	x = min(d, n, structcmp);
	printf("%d\n", x);
	x = min(d, n, structicmp);
	printf("%d\n", x);

	return 0;
}
