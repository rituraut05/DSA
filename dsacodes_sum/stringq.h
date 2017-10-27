#define MAX 16
typedef struct node {
	char str[MAX];
	struct node *next;
}node;
typedef struct queue {   
	node *head, *tail;
}queue;
void qprint(queue *q);
void qinit(queue *q);
void enqueue(queue *q, char* d);
char* dequeue(queue *q);
int qempty(queue *q);
int qfull(queue *q);
void qprint(queue *q);
