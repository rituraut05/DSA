#include "queue.h"
#include <stdio.h>
#include <stdlib.h>
/*typedef struct queue{
	char data;
	struct queue *next;
} queue;
*/
queue *head = NULL;
queue *tail = NULL;
void enqueue(char c){
	queue *temp;
	temp = (queue *)malloc(sizeof(queue));
	temp->data = c;
	temp->next = NULL;
	if(head == NULL){
		head = tail = temp;
	}
	else{
		tail->next = temp;
		tail = temp;
	}
}

char dequeue(){
	queue *temp;
	temp = (queue *)malloc(sizeof(queue));
	temp = head;
	if(head != NULL){
		head = head->next;
	}
	if(empty()){
		printf("ERROR : The queue is empty\n");
		return ' ';
	}
	free(temp);
	return temp->data;

}

int empty(){
	return head == NULL;	
}

void printdata(){
	queue *temp;
	temp = (queue *)malloc(sizeof(queue));
	temp = head;
	while(temp != NULL){
		printf("%c  ", temp->data);
		temp = temp->next;
	}
	printf("\n");
}
