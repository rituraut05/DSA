//#include "stacksforqueue.h"
#include "stackqueue.h"
#include <stdio.h>
#include <stdlib.h>
typedef struct queue{
	stack s1;
	stack s2;
} queue;

struct queue q;
                /*functions for integer stack*/
void push(stack *s, int num){
	printf("HEY before the index is %d\n", s->i);
//        (s->i)++;
printf("Hey i'm in push index is  %d and value is %d\n", s->i, s->a[s->i]);
        s->a[s->i] = num;
	(s->i)++;
}

int pop(stack *s){
	s->i--;
        int t = s->a[s->i];
       // s->i--;
        return t;
}

int sempty(stack *s){
        if(s->i == 0)
                return 1;
        return 0;
}

int full(stack *s){
        if(s->i == MAX )
                return 1;
        return 0;
}
void init(stack *s){
        s->i = 0;
printf("hey i'm in init and the index is %d\n", s->i);
}

void print(stack *s){
        for(int j = 0; j <= s->i; j++){
                printf("%d ", s->a[j]);
        }
        printf("\n");
}

//q = (queue *)malloc(sizeof(struct queue));
//q = NULL;
//init(&(q.s1));
//init(&(q.s2));
void enqueue(int x){
	if(empty()){
printf("hey i'm in enqueue empty wala condition\n");
		init(&(q.s1));
		init(&(q.s2));
	}
	push(&(q.s1), x);
printf("hey i'm in enqueue %d \n", q.s1.a[0]);
}

int dequeue(){
	int i;
	if(empty()){
		printf("ERROR :The queue is empty\n");
		exit(1);
	}
	else if(sempty(&(q.s2))){
		while(!sempty(&(q.s1))){
			i = pop(&(q.s1));
			push(&(q.s2), i);
		}
	}
	return pop(&(q.s2));
}

int empty(){
	return (sempty(&(q.s1)) && sempty(&(q.s2)));	
}

void printdata(){
	print(&(q.s1));
printf("	%d	%d	", q.s1.a[0], q.s2.a[0]);
	print(&(q.s2));
	printf("\n");
}




