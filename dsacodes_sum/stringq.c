#include <stdio.h>
#include <stdlib.h>
#include "queue.h"
#include <string.h>
void qinit(queue *q){
	q->head = q->tail = NULL;
}
void enqueue(queue *q, char *s){
	node *tmp;
	tmp = (node *)malloc(sizeof(node));
	strcpy(tmp->str, s);
	tmp->next = NULL;
	if(q->tail)
		q->tail->next = tmp;
	else
		q->head = tmp;
	q->tail = tmp;
}
char *dequeue(queue *q){
	char *c;
	c = (char *)malloc(16);
	node *tmp;
	strcpy(c, q->head->str);
	tmp = q->head->next;
	free(q->head);
	q->head = tmp;
	if(q->head == NULL)
		q->tail = NULL;
	return c;
}
int qempty(queue *q){
	return q->head == NULL;
}
int qfull(queue *q){
	return 0;
}
void qprint(queue *q) {
	node *t;
	if (q->head == NULL)
		return;
	t = q->head;
	while(t->next) {
		printf("%s\n", t->str);
		t = t->next;
	}
	printf("%s\n", t->str);
}
