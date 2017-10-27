#include <stdio.h>
#include <stdlib.h>
#include <limits.h>
/* readline will read input in 'arr' till a '\n' 
 * or till length = len and put a '\0'
 * in the end of the array 'arr' 
 * and return the no. of bytes read
 */
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
#define OPERAND 10 
#define OPERATOR 20
#define	END	30
#define ERROR	40
/* getnext() will return the type of next "token" (OPERAND or OPERATOR)
 * from "arr" and store the token in "number" or "op" depending on 
 * whether it was operand or operator.
 * getnext() returns pointers to malloced() memory. The caller should free it.
 */  
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
					return t;
				}
				break;
			case OPR:
				t->type = OPERATOR;
				t->op = arr[i - 1];	
				currstate = nextstate;
				return t;
				break;
			case STOP:
				t->type = END;
				currstate = nextstate;
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

/* postfix evaluates the poostfix expression in 'str' 
 * and returns the value of the expression
 * returns INT_MIN if there was an error in expression 
 */
int postfix(char *str) {
	token *t;
	int i = 0, x, y;
	int a[128], result;
	while(1) {
		t = getnext(str);
		if(t->type == OPERAND) { 
			a[i] = t->number; 
			i++;
		}
		else if (t->type == OPERATOR) { 
			if(i < 2)
				return INT_MIN; 
			x = a[i - 1];
			y = a[i - 2];
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
			a[i - 2] = result;
			i--;
		}
		else if (t->type == ERROR) 
			return INT_MIN; 
		else {// end
			if(i != 1)
				 return INT_MIN; 
			return a[0];	 
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
	while((x = readline(str, 128))) {
		ans = postfix(str);
		if(ans == INT_MIN) {
			fprintf(stderr, "Erorr in expression\n");
		}  else
			fprintf(stdout, "%d\n", ans);
	}
	return 0;
}
