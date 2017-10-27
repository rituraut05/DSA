#include <stdio.h>
#include<string.h>
int stringreplace(char *text, char *orig, char *new){
	char *ch;
	char temp[128];
	int count = 0;
	while(ch = strstr(text, orig)){
		count ++;
		strncpy(temp, text, ch - text);
		temp[ch - text] = '\0';
		sprintf(temp + (ch - text), "%s%s", new, ch + strlen(orig));
		text[0] = '\0';
		strcpy(text, temp);	
	}
	return count;
}

int main() {
    char text[128], orig[128], new[128]; 
    int count;
    while(scanf("%s%s%s", text, orig, new) != -1) {
       count = stringreplace(text, orig, new);
       printf("%d %s\n", count, text);
    }
}
