#define MAX 4
#include "data.h"

typedef struct queue{
	struct data a[MAX];
}queue;
//int head = 0;
//int tail = 0;

void enqueue(queue *q, data d);
data dequeue(queue *q);
int qfull(queue *q);
int qempty(queue *q);
void qprint(queue *q);
void qinit(queue *q);
