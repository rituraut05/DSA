#include <stdio.h>
#include <stdlib.h>
#include <limits.h>
//#include "stack.h"




#define MAX 128
struct opndstack{
int i;
int a[MAX];
}opndstack;

struct optrstack{
int i;
char a[MAX];
}optrstack;

void PushOpnd(struct opndstack *s, int num);
int PopOpnd(struct opndstack *s);
void PushOptr(struct optrstack *s, char op);
char PopOptr(struct optrstack *s);
int emptyOptr(struct optrstack *s);
int fullOptr(struct optrstack *s);
int emptyOpnd(struct opndstack *s);
int fullOpnd(struct opndstack *s);
void DeleteOpnd(struct opndstack *s);
void DeleteOptr(struct optrstack *s);



void PushOpnd(struct opndstack *s, int num){
	s->a[s->i]= num;
	(s->i)++;
}

int PopOpnd(struct opndstack *s)
{
	int t = s->a[s->i - 1];
	(s->i)--;
	return t;
}


void PushOptr(struct optrstack *s, char op){
	s->a[s->i]= op;
	(s->i)++;

}

char PopOptr(struct optrstack *s){
	char t = s->a[s->i - 1];
	(s->i)--;
	return t;
}
int emptyOptr(struct optrstack *s) {
	return s->i == 0;
}
int fullOptr(struct optrstack *s) {
	return s->i == MAX;
}
int emptyOpnd(struct opndstack *s) {
	return s->i == 0;
}
int fullOpnd(struct opndstack *s) {
	return s->i == MAX;
}void DeleteOpnd(struct opndstack *s){
	s->i = 0;
}
void DeleteOptr(struct optrstack *s){
	s->i = 0;
}

char Top(struct optrstack *s) {
	char x = PopOptr(s);
	PushOptr(s, x);
	return x;
}


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
	static int countbrack = 0;
	int num;
	token *t = (token *)malloc(sizeof(token));
	while(1) {
printf("i = %d currstate = %d nextstate = %d\n", i, currstate, nextstate);
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
			case '(': case ')':
				nextstate = OPR;
				countbrack++;
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
				currstate = SPC;
				i = 0;
				if(countbrack%2)
					t->type = ERROR;
				countbrack = 0;				
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
int calci(char ch, int a, int b){
	int ans;
	switch(ch){
		case '*':
			ans = a * b;
			return ans;
		case '/':
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

int Precedence(char ch){
	switch(ch){
		case '%': return 3;
		case '+': return 1;
		case '-': return 1;
		case '*': return 2;
		case '/': return 2;
		default : printf("\nInvalid operator.\n");
			  return 0;
	}
}
int infixeval(char *str){	
	token *t;
	int a, b, temp;
	char op;
	struct opndstack value;
	struct optrstack optr;
	while(1) {
		t = getnext(str);
		if(t->type == OPERAND) { 
			PushOpnd(&value, t->number);
		}
		else if (t->type == OPERATOR) {
			
			if (t->op == '(')
				PushOptr(&optr, t->op);
 
        // Closing brace encountered, solve entire brace
			else if (t->op == ')'){
				while (!emptyOptr(&optr) && Top(&optr) != '(' && !emptyOpnd(&value)){
					a = PopOpnd(&value);
                			b = PopOpnd(&value);
					op = PopOptr(&optr);
					if(op == INT_MIN || a == INT_MIN || b == INT_MIN){
						DeleteOpnd(&value);
						DeleteOptr(&optr);
						return INT_MIN;
					}
					temp = calci(op, a, b);
					if(temp == INT_MIN){
						DeleteOpnd(&value);
						DeleteOptr(&optr);
						return INT_MIN;
					}
					PushOpnd(&value, temp);
				}
            // remove '(' from stack
				PopOptr(&optr);
			}
 
			else if (t->op == '+' || t->op == '-' || t->op == '*' || t->op == '/' || t->op == '%'){
            // While top of 'optr' has same or greater precedence to current
            // token, which is an operator. Apply operator on top of 'optr'
            // to top two elements in values stack
				while (!emptyOptr(&optr) && if(Precendence(t->op) <= Precendence(Top(&optr)))){
					a = PopOpnd(&value);
					b = PopOpnd(&value);
					op = PopOptr(&optr);
					if(op == INT_MIN || a == INT_MIN || b == INT_MIN){
						DeleteOpnd(&value);
						DeleteOptr(&optr);
						return INT_MIN;
					}
					temp = calci(op, a, b);
					if(temp == INT_MIN){
						DeleteOpnd(&value);
						DeleteOptr(&optr);
						return INT_MIN;
					}
					Push(&value, temp);
				}
            // Push current token to 'optr'.
				PushOptr(&optr, t->op);
			}
			else{
				DeleteOpnd(&value);
				DeleteOptr(&optr);
				return INT_MIN;
			}
        // for testing
        //PrintStackOperand(optr);
        //PrintStackOperator(values);
		
		}
		else if (t->type == ERROR) 
			return INT_MIN; 
		else // end
			break;		
 
    // Entire expression has been parsed at this point, apply remaining
    // optr to remaining values
		while (!emptyOptr(&optr)){
        		a = PopOpnd(&value);
        		b = PopOpnd(&value);
       			op = PopOptr(&optr);
        		if(op == INT_MIN || a == INT_MIN || b == INT_MIN){
				 DeleteOpnd(&value);
           			 DeleteOptr(&optr);
           			 return INT_MIN;
        		}
        		temp = calci(op, a, b);
        		if(temp == INT_MIN){
        		         DeleteOpnd(&value);
           			 DeleteOptr(&optr);
           			 return INT_MIN;
        		}
        		PushOpnd(&value, temp);
		}
    // Top of 'values' contains result, return it
		int output = PopOpnd(&value);
    		if(!emptyOpnd(&value)){
        		DeleteOpnd(&value);
        		DeleteOptr(&optr);
        		return INT_MIN;
    		}
 
    		DeleteOpnd(&value);
    		DeleteOptr(&optr);
 
    		return output;
	}
 
					
	else if (t->type == ERROR) 
			return INT_MIN; 
	else // end
			break;		
	
}

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


