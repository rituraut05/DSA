#include <stdio.h>
#include "stackandlist.h"
#include <stdlib.h>

void push(stack *s, int num){
	insert(s->l, s->l->len, num);
}
int pop(stack *s){
	return remov(s->l, s->l->len - 1);
}
int empty(stack *s){
	return s->l->head == NULL;
}
int full(stack *s){
	return 0;
}
void sinit(stack *s){
	s->l = (list *)malloc(sizeof(list));
}


void insert(list *l, int pos, int x){
	node *tmp, *p;
	int i;
	/* handle errors on position */	
	if(pos < 0 || pos > l->len)
		return;	
	/* create a new node */
	tmp = (node *)malloc(sizeof(node));
	tmp->a = x;	
	/* handle first node case separately */
	if(l->head == NULL) {
		tmp->next = NULL;
		l->head = tmp;
		l->tail = tmp;
			//l->head = l->tail = tmp0;
		l->len++;
		return;		
	}
	/* link the new node on the list at appropriate position*/
	p = l->head;
	for(i = 0; i < pos - 1; i++)
		p = p->next;
	if(pos == 0){
		tmp->next = l->head;
		l->head = tmp;
	}
	else if(pos == l->len){
			tmp->next = NULL;
			p->next = tmp;
			l->tail = tmp;

		}
	else{
		tmp->next = p->next;
		p->next = tmp;
	}
	/* increase length */
	l->len++;
}
int remov(list *l, int pos){
	if(pos < 0 || pos >= l->len){
		return -1;
	}
	int i;
	node *tmp, *p;
	tmp = (node *)malloc(sizeof(struct node));

	p = l->head;
	for(i = 0; i < pos - 1; i++){
		p = p->next;
	}
	if(pos == 0){
		tmp = p;
		l->head = p->next;
		
		}
	else if(pos == l->len - 1){
		tmp = p;
		l->tail = p;
		l->tail->next = NULL;
		}
	else{
		tmp = p;
		p->next = p->next->next;
		}
	//free(p);
	l->len--;
	return tmp->a;
}
int length(list *l){
	return l->len;
}
void printstack(stack *s){
	node *temp;
	temp = s->l->head;
	while(temp){
		printf("%d ", temp->a);
		temp = temp->next;
	}
	printf("\n");
}

