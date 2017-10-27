#include"usestacks.h"


		/*functions for integer stack*/
void push(stack *s, int num){
	(s->i)++;
	s->a[s->i] = num;	
}

int pop(stack *s){
	int t = s->a[s->i];
	s->i--;
	return t;
}

int empty(stack *s){
	if(s->i == -1)
		return 1;
	return 0;
}

int full(stack *s){
	if(s->i == MAX - 1)
		return 1;
	return 0;
}
void init(stack *s){
	s->i = -1;
}


void print(stack *s){
	for(int j = 0; j <= s->i; j++){
		printf("%d ", s->a[j]);
	}
	printf("\n");
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

		/* fuctions for char stack*/


void cpush(cstack *s, char x){
	(s->i)++;
	s->a[s->i] = x;
}

char cpop(cstack *s){
	char t = s->a[s->i];
	s->i--;
	return t;
}
int cempty(cstack *s){
	if(s->i == -1)
		return 1;
	return 0;
}
int cfull(cstack *s){
	if(s->i == MAX - 1)
		return 1;
	return 0;
}
void cinit(cstack *s){
	s->i = -1;
}

void cprint(cstack *s){
	for(int j = 0; j <= s->i; j++){
		printf("%c ", s->a[j]);
	}
	printf("\n");
}

char Top(cstack *s) {
	char x = cpop(s);
	cpush(s, x);
	return x;
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

