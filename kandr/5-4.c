#include<stdio.h>
int strend(char *s, char *t){
	char *str1 = s;
	char *str2 = t;
	while(*++s)
		;
	while(*++t)
		;
	while(s > str1 && t > str2 && *s-- == *t--)
		;
	if(t == str2 )
		return 1;	
	return 0;
}
int main(){
	int i = 0;
	char a[10], b[10];
	scanf("%s", a);
	scanf("%s", b);
	printf("%d", strend(a, b));
	return 0;
}
