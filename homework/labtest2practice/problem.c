
/*functions for list*/
void init(list *l){
	l->head = NULL;
	l->tail = NULL;
	l->len = 0;
}
void append(list *l, double x){
	if(l->head == NULL){
		node *p;
		p = (node *)malloc(sizeof(node));
		p->n = x;
		p->next = NULL;
		p->prev = NULL;
		l->head = p;
		l->tail = p
		
	}
	l->tail->next = (node *)malloc(sizeof(node));
	l->tail->next->n = x;
	l->tail->next->prev = l->tail;
	l->tail = l->tail->next;
	l->tail->next = NULL;
	l->len++;
}
double remove(list *l, int pos){
	int i = 0;
	double x;
	node *p;
	p = l->head;
	if(pos < 0 && pos >l->len){
		return;
	}
		
	while(i < pos - 1){
		p = p->next;		
	}
	if(pos == l->len){
		l->tail
	}
}
void reverse(list *l){}
void store(list *l, char *fname){}

/*functions for stack*/
void push(stack *s, double x){}
double pop(stack *s){}
int sempty(stack *s){}
int sfull(stack *s){}
void sinit(stack *s){}
