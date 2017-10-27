
#include "queue.h"
#include <stdio.h>
#include <stdlib.h>
/*typedef struct queue{
	char data;
	struct queue *next;
	struct queue *prev;
} queue;
*/
queue *head = NULL;
//head->next = NULL;
//head->prev = NULL;
void enqueue(queue *q, char c){
	queue *temp;
	temp = (queue *)malloc(sizeof(queue));
	temp->data = c;
	temp->next = NULL;
	temp->prev = NULL;
	if(head == NULL){
		head = temp;
//		printf("heyy\n");
	}
	else if(head->prev == NULL){
		head->next = temp;
		head->prev = temp;
		temp->next = head;
		temp->prev = head;
	}
	else{
		head->prev->next = temp;
		temp->prev = head->prev->next;
		temp->next = head;
		head->prev = temp;
	}
}

char dequeue(queue *q){
	queue *temp;
	temp = (queue *)malloc(sizeof(queue));
	temp = head;
        if(qempty(q)){
                printf("ERROR : The queue is empty\n");
                return ' ';
        }

	if(head->next == head)
		head = NULL;
	else if(head != NULL){
		head->next->prev = head->prev;
		head->prev->next = head->next;
		head = head->next;	
	}

//	free(temp);
	return temp->data;

}

int qempty(queue *q){
	return head == NULL;	
}

void qinit(queue *q){
	return;
}

int qfull(queue *q){
	return 0;
}
void qprint(queue *q){
	queue *temp;
	temp = (queue *)malloc(sizeof(queue));
	if(!qempty(q)){
		printf("%c  ", head->data);
		temp = head->next;
		while(temp != head && temp != NULL){
			printf("%c  ", temp->data);
			temp = temp->next;
		}
		printf("\n");
	}
}
