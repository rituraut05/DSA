#include<stdio.h>
int getline(char line[]/*, int lim*/){
	char c;
	while(int i = 0 ; (c = getchar()) != EOF && (c !='\n'); i++){
		line[i]	= c;
	}
	line[i+1] = '\0';
	return i;
}
// strindex: returns the index of t in s, -1 if none
int strindex(char s[], char t[]){
	int i, j, k;
	for(i = 0; s[i] != '\0'; i++){
		for(j = i,  k = 0; t[k] != '\0' && s[j] == t[k]; j++, k++)// checks if the pattern which is copied into t is present in string s and simulataneously increments the 
			;
		if(k > 0 && t[k] == '\0')
	}
}
int main(){
	
