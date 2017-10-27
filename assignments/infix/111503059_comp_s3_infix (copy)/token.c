#include <stdio.h>
#include <stdlib.h>
#include "token.h"


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

