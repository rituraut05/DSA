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

	/*functions for integer stack*/
void push(stack *s, int num);
int pop(stack *s);
int empty(stack *s);
int full(stack *s);
void init(stack *s);

		/* fuctions for char stack*/

void cpush(cstack *s, char x);
char cpop(cstack *s);
int cempty(cstack *s);
int cfull(cstack *s);
void cinit(cstack *s);
char Top(cstack *s);
