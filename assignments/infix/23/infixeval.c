#include <stdio.h>
#include <stdlib.h>
#include <limits.h>
#include "stacks.h"
#include "token.h"
#define MAX 128
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




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
			if(b == 0)
				return INT_MIN;

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
					if(ans == INT_MIN)
						return INT_MIN;
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
					if(ans == INT_MIN)
						return INT_MIN;

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
		if(ans == INT_MIN)
			return INT_MIN;

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


