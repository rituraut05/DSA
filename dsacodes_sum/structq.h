#define MAX 32
typedef struct data {
	char name[16];
	int age;
}data;

typedef struct queue {
	int head, tail;
	data ar[MAX];
}queue;
void qinit(queue *);
void enqueue(queue *, data);
data dequeue(queue *);
int qempty(queue *);
int qfull(queue *);
void qprint(queue *);
