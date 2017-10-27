#ifndef __LIST_H
#define __LIST_H

typedef struct node {
	char *str;
	struct node *next, *prev;
}node;

typedef struct list {
	node *head, *tail;
	int len;
}list;
void init(list *l);
void insert(list *l, int pos, char *str);
char *remov(list *l, int pos);
void reverse(list *l);
void traverse(list *l);
void append(list *l, char *str);
void sort(list *l);
int length(list *l);
void swap(node *x, node *y);
#endif
