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
/* Here we have done following changes:
 * A) Changes to existing push() and pop()
 * 1. Combined the array a and index i into a structure. Why? They are anyways dependent on
 *    each other and have no separate existence. This is why we have structures. e
 * 2. We named the structure as "stack". Why? Because the array with index is the storoage
 *    for our stack type.
 * 3. With this we also achieved the purpose of a "stack type". Because with the typedef 
 *    given below, we can declare variables of the type "stack a, b, c;" etc. 
 * 4. We have to change the way function takes arguments now. Instead of (int *a, int *i), now 
 *    we have a "stack *s" argument. This also changes the code of the function. We need to 
 *    say s->a[s->i]  instead of  a[*i] 
 * B) Introduction of new functions
 * 5. In our code for postfix() we had following lines:
 *    	i = 0; 
 *    	if(i < 2) return INT_MIN; //(inside if t->type == OPERATOR) 
 *    	if(i != 1) return INT_MIN;  // after the while loop
 *    	return a[0]; // at the end, returning result
 *    All these lines break "abstraction". Because the "user" of stack, i.e. "postfix()"
 *    "knows" that the stack used aryray and i and how it works. 
 *  6. This is why we have  three more stack() "interface" functions. init(), empty(),full().
 *  7. We now rewrite the lines of code in "5." with these functions. 
 *  8. Now look at postfix(). It only calls the stack functions without knowing "how" they work.
 *     This means: even if I change the push/pop/init/emtpy/full to have a stack which 
 *     starts from right end of array and pushes with i-- and pops with i++,
 *     The postfix() code will not change! 
 *  9. This is clear separation of "use" of stack in postfix() where we only call the 
 *     interface functions; from the "implementation" of the stack, i.e. the code of 
 *     push(), pop(), init(), empty(), full() which do not know anything about the postfix 
 *     code.  The "use" of stack only uses "interface" of the stack, i.e. the stack functions.
 *     It only knows "what" the stack does, and not "how" it works. 
 *  10. Limitations of this code: The source code is in the same file. Ther user can still 
 *      learn how the stack works. So we separate this code (in the next version) into another
 *      file and give the .o of that file.
 */
#define MAX 128

/* postfix evaluates the poostfix expression in 'str' 
 * and returns the value of the expression
 * returns INT_MIN if there was an error in expression 
 */
int postfix(char *str) {
	token *t;
	int x, y;
	int result;
	stack<int> a;
	while(1) {
		t = getnext(str);
		if(t->type == OPERAND) { 
			a.push(t->number);
		}
		else if (t->type == OPERATOR) { 
			if(!a.isempty())
				x = a.pop();
			else
				return INT_MIN; 
			if(!a.isempty())
				y = a.pop();
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
			a.push(result);
		}
		else if (t->type == ERROR) 
			return INT_MIN; 
		else {// end
			if(!a.isempty())
				result = a.pop();
			else
				return INT_MIN;
			if(a.isempty())
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
	while((x = readline(str, 128))) {
		ans = postfix(str);
		if(ans == INT_MIN) {
			fprintf(stderr, "Erorr in expression\n");
		}  else
			fprintf(stdout, "%d\n", ans);
	}
	return 0;
}
