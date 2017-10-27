
typedef struct queue{
	char *data;
	struct queue *next;
} queue;

void enqueue(queue *q, char *c);
char *dequeue(queue *q);
int qempty(queue *q);
void qprint(queue *q);
void qinit(queue *q);
int qfull(queue *q);
