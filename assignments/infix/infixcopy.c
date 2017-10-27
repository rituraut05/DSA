#include <stdio.h>
#include <stdlib.h>
#include <limits.h>
#include "stack.h"
#include<stdio.h>
#include<stdlib.h>
#define MAX 128
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
typedef struct stack{
	int a[MAX];
	int i;
}stack;
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
typedef struct cstack{
	char a[MAX];
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




int readline(char *arr, int len) {
	int i = 0;
	int ch;
	while((ch = getchar()) != '\n' && i < len - 1) {
		arr[i] = ch;
		i++;
	}
	arr[i] = '\0';
	return i;
}


#define OPERAND 10 
#define OPERATOR 20
#define	END	30
#define ERROR	40
 
typedef struct token {
	int type; // type takes values OPERAND/OPERATOR/END/
	int number;
	char op;
}token;
enum states { SPC, DIG, OPR, STOP, ERR };



token *getnext(char *arr) {
        static int currstate = SPC;
	int nextstate;
	static int i = 0;
	static int countbrack1 = 0, countbrack2 = 0;
	int num;
	token *t = (token *)malloc(sizeof(token));
	while(1) {
	 	switch(arr[i]) {
			case '0': case '1': case '2': case '3':
			case '4': case '5': case '6': case '7':
			case '8': case '9': 
				nextstate = DIG;
				break;
			case '+': case '-': case '*': case '/':
			case '%': 
				nextstate = OPR;
				break;
			case '(': 
				nextstate = OPR;
				countbrack1++;
				break;
			case ')':
				nextstate = OPR;
				countbrack2++;
				break;

			case '\0':
				nextstate = STOP;
				break;
			case ' ':
				nextstate = SPC;
				break;
			default:
				nextstate = ERR;
				break;
		}
		switch(currstate) {
			case SPC:
				if(nextstate == DIG)
						num = arr[i] - '0';			
				break;
			case DIG:
				if(nextstate == DIG)
					num = num * 10 + arr[i] - '0';
				else  {
					t->type = OPERAND;
					t->number = num;
					currstate = nextstate;
					currstate = SPC;
					return t;
				}
				break;
			case OPR:
				t->type = OPERATOR;
				t->op = arr[i - 1];	
				currstate = nextstate;
				currstate = SPC;
				return t;
				break;
			case STOP:
				if(arr[i - 2] == '+' || arr[i - 2] == '-' || arr[i - 2] == '%' || arr[i - 2] == '*' || arr[i - 2] == '/'){
					t->type = ERROR;
				}
				else if(countbrack1 != countbrack2)
					t->type = ERROR;
				else
					t->type = END;
				currstate = SPC;
				i = 0;
				countbrack1 = 0;
				countbrack2 = 0;			
				return t;
				break;
			case ERR:
				t->type = ERROR;
				currstate = nextstate;
				return t;
				break;
		}
		currstate = nextstate;
		i++;
	}
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


int precedence(char ch){
	switch(ch){
		case '%': return 3;
		case '+': return 1;
		case '-': return 1;
		case '*': return 2;
		case '/': return 2;
		case '(': return 4;
		default : return 0;
	}
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


int calculate(char ch, int a, int b){
	int ans = 0;
	switch(ch){
		case '*':
			ans = a * b;
			return ans;
		case '/':
			if(b == 0)
				return INT_MIN;
			ans = a / b;
			return ans;
		case '%':
			ans = a % b;
			return ans;
		case '+':
			ans = a + b;
			return ans;
		case '-':
			ans = a - b;
			return ans;
		
	}
	return INT_MIN;

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

int infixeval(char *str){
	token *t;
	int a, b, ans;
	char op;

	cstack cs;
	stack s;

	init(&s);
	cinit(&cs);

	while(1){
		t = getnext(str);
		if(t->type == OPERAND){
			push(&s, t->number);
		}
		else if(t->type == OPERATOR){
			if(t->op == ')'){
				while(!empty(&s) && !cempty(&cs) && Top(&cs) != '('){
					if(!empty(&s))
						a = pop(&s);
					else
						return INT_MIN;
					if(!empty(&s))
						b = pop(&s);
					else
						return INT_MIN;

					if(!cempty(&cs))
						op = cpop(&cs);
					else
						return INT_MIN;

					ans = calculate(op, b, a);
					if(!full(&s))
						push(&s, ans);
					else 
						return INT_MIN;
				}
				if(!cempty(&cs))
					cpop(&cs);
			}
			else{
				while(precedence(t->op) <= precedence(Top(&cs)) && Top(&cs) != '('){   		//  Add the error conditions : check if the stack is empty

					a = pop(&s);
					b = pop(&s);
					op = cpop(&cs);
					ans = calculate(op, b, a);
					push(&s, ans);
				}
					cpush(&cs, t->op);
			}
			
		}
		else if(t->type == ERROR){
			return INT_MIN;
		}
		else
			break;
	}
	while(!cempty(&cs)){
		a = pop(&s);
		b = pop(&s);
		op = cpop(&cs);
		ans = calculate(op, b, a);
		push(&s, ans);		
	}
		if(s.i != 0)
			return INT_MIN;
		return pop(&s);
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
int main() {
	char str[128];
	int x, ans;
	while((x = readline(str, 128))) {
		ans = infixeval(str);
		if(ans == INT_MIN) {
			fprintf(stderr, "Erorr in expression\n");
		}  else
			fprintf(stdout, "%d\n", ans);
	}
	return 0;
}


