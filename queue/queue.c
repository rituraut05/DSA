#include "queue.h"
void qinit(queue *q){
	q->i = 0;
}
void enqueue(queue *q, data d){
	q->arr[q->i] = d;
	(q->i)++;
}
data dequeue(queue *q){
	int j = 0;
	data tmp;
	tmp = q->arr[0];
	while(j < (q->i - 1)) {
		q->arr[j] = q->arr[j + 1];
		j++;
	}
	(q->i)--;
	return tmp;
			
}
int qempty(queue *q){
	return q->i == 0;
}
int qfull(queue *q){
	return q->i == MAX;
}
