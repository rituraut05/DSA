#include "structq.h"
#include <stdio.h>
#include <string.h>


#ifndef __DATA_H 
#define __DATA_H 
typedef struct data {
	char name[16];
	int age;
}data;
#endif
int head = -1;
int tail = -1;
void qinit(queue *q){
	head = tail = -1;	
}
void enqueue(queue *q, data d){
	if(qempty(q)){

		head = tail = 0;
		strcpy(q->a[tail].name , d.name);
		q->a[tail].age = d.age;
	}
	else if(!qfull(q)){
	tail = (tail + 1) % MAX;

	strcpy(q->a[tail].name, d.name);
	q->a[tail].age = d.age;
	}
	else{
		printf("full\n");
		return;
	}
printf("name = %s  age = %d\n", q->a[0].name, q->a[0].age);
}

data dequeue(queue *q){

	if(head == tail){
		head = tail = -1;
		return (q->a[0]);
	}
	else{
		int i = head;
		head = (head + 1) % MAX;
		return (q->a[i]);
	}
			
}

int qfull(queue *q){
	if((tail + 1) % MAX == head)
		return 1;
	return 0;
}

int qempty(queue *q){
	if(head == -1){
		return 1;
	}
	return 0;
}

void qprint(queue *q){

    int i;
    if(head==-1)
      printf("\n No elements to display");
    else
    {

        printf("head[%d]->",head);
        for(i=head;i!=tail;i=(i+1)%MAX)
            printf("name = %s  age = %d\n", q->a[i].name, q->a[i].age);
        printf("name = %s  age = %d\n", q->a[i].name, q->a[i].age);
        printf("<-tail[%d]\n",tail);
    }
}
