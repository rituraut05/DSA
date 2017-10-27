#include "structq.h"
#include <string.h>
#include <stdlib.h>
#include <stdio.h>
void qinit(queue *q) {
	q->head = q->tail = 0;
}
void enqueue(queue *q, data a) {
	q->ar[q->tail % MAX] = a;
	q->tail++;
}
int qempty(queue *q) {
	return q->head == q->tail;
}
int qfull(queue *q) {
	return q->tail - q->head == MAX;
}
data dequeue(queue *q) {
	data d = q->ar[q->head % MAX];
	q->head++;
	return d;
}
void qprint(queue *q) {
	int i = q->head;
	for(; i < q->tail; i++) {
		printf("%s %d,", q->ar[i % MAX].name, q->ar[i % MAX].age);
	}
	printf("\b\n");
}
