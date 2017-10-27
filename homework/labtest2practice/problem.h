typedef struct node{
	double n;
	struct node *next;
	struct node *prev;	
}node;

typedef struct list{
	node *head;
	node *prev;
}list;
typedef struct stack{
	int a[MAX];
	int i;
}stack;

/*functions for list*/
void init(list *l);
void append(list *l, double x);
double remove(list *l, int pos);
void reverse(list *l);
void store(list *l, char *fname);

/*functions for stack*/
void push(stack *s, double x);
double pop(stack *s);
int sempty(stack *s);
int sfull(stack *s);
void sinit(stack *s);

