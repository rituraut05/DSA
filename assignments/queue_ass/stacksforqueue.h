#define MAX 128		

typedef struct stack{
	int a[MAX];
	int i;
}stack;


void push(stack *s, int num);
int pop(stack *s);
int sempty(stack *s);
int full(stack *s);
void init(stack *s);
void print(stack *s);
