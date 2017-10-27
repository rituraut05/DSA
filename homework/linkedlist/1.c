#include "1.h"
typedef struct node{
	int a;
	node *next;
}node;

typedef struct list{
	node *head;
	node *tail;
	l->len;
}list;

void init(list *l){
	l->head = NULL;
	l->tail = NULL;
	l->len = 0;
}

void insert(list *l, int pos, int x){
	if(pos < 0 && pos > l->len)
		return;
	node *p;
	p = l->head;
	int i = 0;
	node *temp;
	temp = (node *)malloc(sizeof(node));
	temp->a = x;
	temp->next = NULL;
	if(pos == 0){
		l->head = temp;
		temp->next = p;
	}
	else if(pos == l->len){
		p->next = temp;
		l->tail = temp;
	}
	else{
		while(i < pos - 1){
			p = p->next;
		}
		temp->next = p->next->next;
		p->next = temp;
		}
	l->len++;
}

void reverse(list *l){
	node *p, *q, *r;
	q = l->head;
	p = q->next;
	r = p->next;
	while(p){
		p->next = q;
		q = p;
		if(r){
			r = r->next;
		}
	}
	l->head->next = NULL;
	node *tmp;
	tmp = l->head;
	l->head = l->tail;
	l->tail = tmp;
}
