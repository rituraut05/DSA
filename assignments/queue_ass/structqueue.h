typedef struct data{
	char name[16];
	int age;
} data;

typedef struct queue{
	struct data *d;
	struct queue *next;
} queue;

void enqueue(struct data *d);
struct data* dequeue();
int empty();
void printdata();
