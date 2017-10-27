#include <stdio.h>
#include <stdlib.h>
#include <limits.h>
#include "stack.h"
#include "token.h"
/* readline will read input in 'arr' till a '\n' 
 * or till length = len and put a '\0'
 * in the end of the array 'arr' 
 * and return the no. of bytes read
 */
char *intopost(char *);
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

/* postfix will accept the 'str' string as an expression
 * and return the evaluted value of the postfix expression in str
 * it will also handle errors 
 */
/* postfix evaluates the poostfix expression in 'str' 
 * and returns the value of the expression
 * returns INT_MIN if there was an error in expression 
 */

int postfix(char *str) {
	token *t;
	int x, y;
	int result, reset = 1;
	stack a;
	init(&a);
	while(1) {
		t = getnext(str, &reset);
		if(t->type == OPERAND) { 
			push(&a, t->number);
		}
		else if (t->type == OPERATOR) { 
			if(!empty(&a))
				x = pop(&a);
			else
				return INT_MIN; 
			if(!empty(&a))
				y = pop(&a);
			else
				return INT_MIN; 
			switch(t->op) {
				case '+':
					result = y + x;
					break;
				case '-':
					result = y - x;
					break;
				case '*':
					result = y * x;
					break;
				case '/':
					result = y / x;
					break;
				case '%':
					result = y % x;
					break;
				
			}
			push(&a, result);
		}
		else if (t->type == ERROR) 
			return INT_MIN; 
		else {// end
			if(!empty(&a))
				result = pop(&a);
			else
				return INT_MIN;
			if(empty(&a))
				return result;
			else
				return INT_MIN; 
		}
	}
}

/* Problem: solve postfix expression. 
 * input: postfix expression involving integer operands and
 * binary operatiors (+ - * / % )
 * Input may have errors
 * Two operands will be separated by one or more space
 * operands-operators will be separted by zero or more space 
 * Examples:
 * 11  23  +  4 5-* 
 * 10 20 30 + + 
 * 10 20 30 40 +*-
 * OUtput: number (result)
 */ 
int main() {
	char str[128];
	int x, ans;
	char *p;
	while((x = readline(str, 128))) {
		p = intopost(str);
		ans = postfix(p);
		if(ans == INT_MIN) {
			fprintf(stderr, "Erorr in expression\n");
		}  else
			fprintf(stdout, "%d\n", ans);
	}
	return 0;
}
