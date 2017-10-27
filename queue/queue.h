#include "data.h"
#define MAX 128
typedef struct queue {
	data arr[MAX];
	int i;
}queue;
void qinit(queue *q);
void enqueue(queue *q, data d);
data dequeue(queue *q);
int qempty(queue *q);
int qfull(queue *q);
