#include<stdio.h>
#include<string.h>
int substr(char *t, char *s) {
	int lt, ls, i, j, k, count = 0;
	lt = strlen(t);
	ls = strlen(s);
	for(i = 0; i < (lt - ls + 1); i++) {
		if(t[i] == s[0]) {
		count ++;
		for(j = (i + 1), k = 1; k < ls; k++, j++) {
			if(t[j] == s[k])
				count++;
			else
				break;
		}
		if(count == ls)
			return i;
		else
			count = 0;
		}
	}
	return -1;
}
int main() {
	char t[50], s[50];
	scanf("%s%s", t, s);
	printf("%d", substr(t, s));
	return 0;
}
