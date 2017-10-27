#include <stdio.h>
char *substr (char *a, char *b) {
	char *p = a, *q = b;
	while(*p != '\0' && *q != '\0') {
		if(*p == *q)  {
			p++;
			q++;
		}
		else { 
			if(q == b)
				p++;
			else  {
				p = p - (q- b) + 1;
				q = b;
			}
		}
	}
	if(*q == '\0')
		return p - (q - b) - a;
	else 
		return -1;
}
int main() {
	char x[32], y[32];
	int ans;
	scanf("%s%s", x, y);
	ans = substr(x, y);
	printf("%d\n", ans);
	return 0;	
}
