#include<stdio.h>
#include"add"
#include"subtract"
int main(){
	int a, b;
	scanf("%d%d",&a,&b);
	printf("The sum of %d and %d is %d\n"a, b, add(a, b));
	printf("The subtraction of %d and %d is %d\n"a, b, subtract(a, b));
	return 0;
}
