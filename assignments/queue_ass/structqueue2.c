
#include <string.h>
#include "structqueue2.h"
#include <stdio.h>
#include <stdlib.h>
/*typedef struct queue{
	char data;
	struct queue *next;
} queue;
*/
queue *head = NULL;
queue *tail = NULL;
void enqueue(struct data *c){
	queue *temp;
	temp = (queue *)malloc(sizeof(queue));
	temp->d = (struct data *)malloc(sizeof(struct data));
	strcpy(temp->d->name, c->name);
	temp->d->age = c->age;
	temp->next = NULL;
	if(head == NULL){
		head = tail = temp;
	}
	else{
		tail->next = temp;
		tail = temp;
	}
}

struct data* dequeue(){
	queue *temp;
	temp = (queue *)malloc(sizeof(queue));
	temp = head;
        if(empty()){
                printf("ERROR : The queue is empty\n");
                exit(1);
        }

	else if(head != NULL){
		head = head->next;
	}
//	free(temp);
	return temp->d;

}

int empty(){
	return head == NULL;	
}

void printdata(){
	queue *temp;
	temp = (queue *)malloc(sizeof(queue));
	temp = head;
	while(temp != NULL){
		printf("%s  %d\n", temp->d->name, temp->d->age);
		temp = temp->next;
	}
	printf("\n");
}

