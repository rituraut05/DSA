#include "queueandstack.h"
#include <stdio.h>
#include <stdlib.h>
void enqueue(queue *q, int n){
	push(q->s1, n);
}
int dequeue(queue *q){
	if(empty(q->s2)){
//printf("hey s2 is empty so isnerting s1 k elements into s2\n");
		while(!empty(q->s1)){
		
			push(q->s2,pop(q->s1));
		}
	}
	return pop(q->s2);
}

int qempty(queue *q){
	if(empty(q->s1) && empty(q->s2))
		return 1;
	return 0;
}

void qprint(queue *q){
	if(empty(q->s2)){
		int n = q->s1->i;
		int j = 0;
		while(j <= n){
			printf("%d ", q->s1->a[j]);
			j++;
		}
	}
	else { 
		int j = q->s2->i;
		while(j >= 0 ){
			printf("%d ", q->s2->a[j]);
			j--;
		}
		int n = q->s1->i;
		j = 0;
		while(j <= n){
			printf("%d ", q->s1->a[j]);
			j++;
		}
	}
}

void qinit(queue *q){
	q->s1 = (stack *)malloc(sizeof(stack));
	q->s2 = (stack *)malloc(sizeof(stack));
	init(q->s1);
	init(q->s2);
}

int qfull(queue *q){
	if(full(q->s1))
		return 1;
	return 0;
}

	/*functions for integer stack*/
void push(stack *s, int num){
	s->i++;
	s->a[(s->i)] = num;
	
}

int pop(stack *s){
	int x = s->a[(s->i)];
	s->i--;
	return x;
}
int empty(stack *s){
	return s->i == -1;
}
int full(stack *s){
	return s->i == MAX;
}
void init(stack *s){
	s->i = -1;
}

