#include <string.h>
#include "stringq.h"
#include <stdio.h>
#include <stdlib.h>
/*typedef struct queue{
	char *data;
	struct queue *next;
} queue;
*/
queue *head = NULL;
queue *tail = NULL;
void enqueue(queue *q, char *c){
	queue *temp;
	temp = (queue *)malloc(sizeof(queue));
	temp->data = (char *)malloc(strlen(c));
	strcpy(temp->data, c);
	temp->next = NULL;
	if(head == NULL){
		head = tail = temp;
	}
	else{
		tail->next = temp;
		tail = temp;
	}
}

char *dequeue(queue *q){
	queue *temp;
	char *s;
	temp = (queue *)malloc(sizeof(queue));
		temp = head;
		s = (char *)malloc(sizeof(strlen(head->data)));

	if(head != NULL){
		head = head->next;
		strcpy(s, temp->data);
		

	}
	/*if(qempty(q)){
		printf("ERROR : The queue is empty\n");
		return " ";*/
	//}
	
	free(temp);
	return s;

}

int qempty(queue *q){
	return head == NULL;
}

int qfull(queue *q){
	return 0;
}
void qinit(queue *q){
	return;
}
void qprint(queue *q){
	queue *temp;
	temp = (queue *)malloc(sizeof(queue));
	temp = head;
	while(temp != NULL){
		printf("%s  ", temp->data);
		temp = temp->next;
	}
	printf("\n");
}
