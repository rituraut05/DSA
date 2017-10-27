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
		tmp->next = NULL;
		tmp->prev = NULL;
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
		l->head->prev = tmp;
		tmp->next = l->head;
		tmp->prev = NULL;
		l->head = tmp;
	}
	else if(pos == l->len){
			tmp->next = NULL;
			tmp->prev = p;
			p->next = tmp;
			l->tail = tmp;

		}
	else{
		tmp->next = p->next;
		tmp->prev = p;
		p->next->prev = tmp;
		p->next = tmp;
	}
	/* increase length */
	l->len++;
}
char *remov(list *l, int pos){
		if(l->len == 0)
			exit(1);

	if(pos < 0 || pos >= l->len){
		char *a;
		a = (char *)malloc(sizeof(char)*5);
		strcpy(a, "error");
		return a;
	}
	int i;
	node *tmp, *p;
	tmp = (node *)malloc(sizeof(struct node));

	p = l->head;
	for(i = 0; i < pos; i++){
		p = p->next;
	}
	if(pos == 0){
		tmp = p;
		if(p->next){
			l->head = p->next;
		
			p->next->prev = NULL;
		}
		else
			p = NULL;
		}
	else if(pos == l->len - 1){
		tmp = p;
		l->tail = p->prev;
		if(p->prev)
			p->prev->next = NULL;
		else
			l->tail = NULL;
		
		}
	else{
		tmp = p;
		p->prev->next = p->next;
		p->next->prev = p->prev;
		}
	free(p);
	l->len--;
	return tmp->str;
}
void reverse(list *l){
	node *p, *q, *r;
	if(l->tail == NULL)
		return;
	q = l->head; 
	p = q->next;
	r = p->next;
	while(1) {
		p->next = q;
		q = p;
		p = r;
		if(!r)
			break;
		r = r->next;
	}	

	q = l->tail;
	p = q->prev;
	r = p->prev;
	while(1) {
		p->prev= q;
		q = p;
		p = r;
		if(!r)
			break;
		r = r->prev;
	}
	l->tail->prev = NULL;
	l->head->next = NULL;

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
	while(p) {
		printf("%s ", p->str);
		p = p->next;
	} 
	printf("]\n");

	p = l->tail;
	printf("Backwards %d [ ", l->len);

	while(p){
		printf("%s ", p->str);
		p = p->prev;
	} 

	printf("]\n");

}

void append(list *l, char *str) {
	insert(l, l->len, str);
}



void swap (node *x, node *y){
	char *temp;
	
	temp = (char*)malloc(sizeof(char) * strlen(x->str));
	strcpy(temp, x->str);
	strcpy(x->str, y->str);
	strcpy(y->str, temp);
	}

void sort(list *l){
	node *temp;
	node *temp1;
	for(temp = l->head; temp; temp = temp->next){
		for(temp1 = l->head; temp1->next; temp1 = temp1->next){
			int p = strcmp(temp1->str, temp1->next->str);
			if(p > 0){
				swap(temp1, temp1->next);
			}
		}
	}
}
int length(list *l) {
	return l->len;
}
