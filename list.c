#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "list.h"

void init(list *l){
	l->head = l->tail = NULL;
	l->len = 0;
}
void insert(list *l, int pos, char *str){
	node *tmp, *p;
	int i;
	/* handle errors on position */	
	if(pos < 0 || pos > l->len)
		return;	
	/* create a new node */
	tmp = (node *)malloc(sizeof(node));
	tmp->str = (char *)malloc(strlen(str) + 1);	
	strcpy(tmp->str, str);
	/* handle first node case separately */
	if(l->head == NULL) {
		tmp->next = tmp->prev =
			l->head = l->tail = tmp;
		l->len++;
		return;		
	}
	/* link the new node on the list at appropriate position*/
	p = l->head;
	for(i = 0; i < pos - 1; i++)
		p = p->next;
	if(pos == 0)
		p = l->tail;
	tmp->next = p->next;
	tmp->prev = p;
	p->next->prev = tmp;
	p->next = tmp;
	/* change the head or tail or both if needed */	
	if(pos == 0)
		l->head = tmp;
	if(pos == l->len)
		l->tail = tmp;
	/* increase length */
	l->len++;
}
char *remov(list *l, int pos){
	return NULL;
}
void reverse(list *l){
	node *p, *q, *r;
	if(l->tail == NULL)
		return;
	q = l->head;
	p = q->next;
	r = p->next;
	while(q != r) {
		p->next = q;
		q = p;
		p = r;
		r = r->next;
	}	

	q = l->tail;
	p = q->prev;
	r = p->prev;
	while(q != r) {
		p->prev= q;
		q = p;
		p = r;
		r = r->prev;
	}
	p = l->head;
	l->head = l->tail;
	l->tail = p;
}
void traverse(list *l){
	node *p = l->head;
	if(!p) {
		printf("Forwards: %d[ ]\n", l->len);
		printf("Backwards: %d[ ]\n", l->len);
		return;
	}
	printf("Forwards: %d[ ", l->len);
	do {
		printf("%s ", p->str);
		p = p->next;
	} while(p != l->head) ;
	printf("]\n");

	p = l->tail;
	printf("Backwards %d [ ", l->len);
	do {
		printf("%s ", p->str);
		p = p->prev;
	} while(p != l->tail) ;
	printf("]\n");

}

void append(list *l, char *str) {
}
void sort(list *l) {
}
int length(list *l) {
	return l->len;
}
