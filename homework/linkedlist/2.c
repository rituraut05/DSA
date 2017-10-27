#include <stdio.h>
#include "2.h"
typedef struct data{
	char name[16];
	int age;
}
typedef struct node{
	data d;
	struct node *next;
	struct node *prev;
}node;

typedef struct list{
	node *head;
	node *tail;
	int len;
}list;

void init(list *l){
	l->head = NULL;
	l->tail = NULL;
	l->len = 0;
}
void appendleft(list *l, char *str, int x){
	node *temp;
	temp = (node *)malloc(sizeof(node));
	temp->age = x;
	strcpy(temp->name, str);
	l->head->prev = temp;
	temp->next = l->head;
	temp->prev = NULL;
	l->head = temp;
	l->len++;
}

data* popright(list *l, data *d){
	node *temp;
	temp = l->tail;
	l->tail = l->tail->prev;
	l->len--;
	l->tail->next = NULL;
	return temp->d;

}

