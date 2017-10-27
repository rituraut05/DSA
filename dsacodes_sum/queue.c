#include <stdlib.h>
#include "queue.h"
#include <stdio.h>
void qinit(queue *q) {
	q->head = NULL;	
}
void enqueue(queue *q, data c) {
	data *temp;
	temp = (data *)malloc(sizeof(data));
	temp->a = c.a;
	if(q->head == NULL) {
		q->head = temp;
		temp->next = NULL;
	}
	else {
		temp->next = q->head;
		q->head = temp;
	}
}
data dequeue(queue *q) {
	data *t;
	t = q->head;
	if(t->next == NULL) {
		data te = *t;
		free(t);
		q->head = NULL;
		return te;
	}
	while(t->next->next != NULL) {
		t = t->next;
	}
	data te = *(t->next);
	free(t->next);
	t->next = NULL;
	return te;
}
int qempty(queue *q) {
	if(q->head == NULL)
		return 1;
	else 
		return 0;
}
int qfull(queue *q) {
	return 0;
}
