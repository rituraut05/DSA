#ifndef __QUEUE_H
#define __QUEUE_H
#define MAX 32 
typedef struct queue {
	int arr[MAX];
	int i;
}queue;
void qinit(queue *q);
void enqueue(queue *q, int d);
int dequeue(queue *q);
int qempty(queue *q);
int qfull(queue *q);
#endif
