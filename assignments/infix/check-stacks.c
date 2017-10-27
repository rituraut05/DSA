#include<stdio.h>
#include<stdlib.h>
#define MAX 4
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
typedef struct stack{
	int a[4];
	int i;
}stack;
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
typedef struct cstack{
	char a[4];
	int i;
}cstack;
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
		printf("%d ", s->a[s->i]);
	}
	printf("\n");
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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
		printf("%c ", s->a[s->i]);
	}
	printf("\n");
}

char Top(cstack *s) {
	char x = cpop(s);
	cpush(s, x);
	return x;
}
/////////////////////////////////////////

int main(){
	int ch;
	stack s;
	cstack cs;
	init(&s);
	cinit(&cs);
	
	
while(1){
printf("Enter your choice\n");
scanf("%d", &ch);
	switch(ch){
		case 1:
		if(!full(&s))
			push(&s, 2);
		else
			printf("Error\n");
		print(&s);
		break;
		case 2:
		if(!empty(&s))
			pop(&s);
		else
			printf("Error\n");

		print(&s);
		break;
		default:
		break;
		
	}
	switch(ch){
		case 1:
		if(!cfull(&cs))
			cpush(&cs, '+');
		else
			printf("Error\n");

		
		cprint(&cs);
		break;
		case 2:
		if(!cempty(&cs))
			cpop(&cs);
		else
			printf("Error\n");


		cprint(&cs);
		break;
		case 3:
		if(!cempty(&cs)){
			printf("%c\n", Top(&cs));
			
			cprint(&cs);
		}
		else
			printf("Error\n");
		break;
		
		default:
		break;
		
	}

}	
	return 0;
}
