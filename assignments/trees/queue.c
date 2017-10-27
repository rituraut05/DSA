#include "queue.h"
void qinit(queue *q){
	q->i = 0;
}
void enqueue(queue *q, node *d){
	q->arr[q->i] = d;
	(q->i)++;
}
node * dequeue(queue *q){
	node *d = q->arr[0];
	int j = 0;
	while(j < ((q->i) - 1)) {
		q->arr[j] = q->arr[j + 1];
		j++;
	}
	(q->i)--;
	return d;
}
int qempty(queue *q){
	return q->i == 0;
}
int qfull(queue *q){
	return q->i == SIZE;
}
