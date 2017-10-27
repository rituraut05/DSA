#include<stdio.h>
#define equal(a, b) ((a == b) : printf("equal\n") ? printf("not equal\n") );
int main()
{
	int a,b;
	printf("Enter two numbers\n");
	scanf("%d%d", &a, &b);
	equal(a, b);
	return 0;
}
