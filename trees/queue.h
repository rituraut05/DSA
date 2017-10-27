#ifndef __QUEUE_H
#define __QUEUE_H
#include "tree.h"
#define SIZE 32 
typedef struct queue {
	node *arr[SIZE];
	int i;
}queue;
void qinit(queue *q);
void enqueue(queue *q, node *d);
node *dequeue(queue *q);
int qempty(queue *q);
int qfull(queue *q);
#endif
