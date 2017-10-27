#include<stdio.h>
int main(){
	int c, nl = 0, nb = 0, nt = 0;
	while((c = getchar()) != EOF){
		if(c == ' ')
			++nb;
		else if(c == '	')
			++nt;
		else if(c == '\n')
			++nl;
	}
	printf("The number of spaces are %d\nThe number of tabs used are %d\nThe number of lines used are %d\n", nb, nt, nl);
	return 0;
}
