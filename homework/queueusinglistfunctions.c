#include <stdio.h>
#include <stdlib.h>
#include "queueandlist.h"
void init(list *l){
	l->head = (node *)malloc(sizeof(node));
	l->tail = (node *)malloc(sizeof(node));
	l->head = NULL;
	l->tail = NULL;
	l->len = 0;
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
	free(p);
	l->len--;
	return tmp->a;
}
int length(list *l){
	return l->len;
}


void qinit(queue *q){
	q->l = (list *)malloc(sizeof(list));
	init(q->l);
}
void enqueue(queue *q, int x){
	insert(q->l, q->l->len, x);
}
int dequeue(queue *q){
	return remov(q->l, 0);
}
int qempty(queue *q){
	return q->l->len == 0;
}
int qfull(queue *q){
	return 0;
}
void qprint(queue *q){
	node *temp;
	temp = q->l->head;
	while(temp){
		printf("%d ", temp->a);
		temp = temp->next;
		
	}
	printf("\n");
}
