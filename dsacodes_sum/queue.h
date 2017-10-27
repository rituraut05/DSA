typedef struct data {
	char a;
	struct data *next;
}data;
typedef struct queue {
	data *head;
}queue;
void qinit(queue *);
data dequeue(queue *);
void enqueue(queue *, data);
int qempty(queue *);
int qfull(queue *);
