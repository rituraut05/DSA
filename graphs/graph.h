
typedef struct graph {
	int n;
	int **a;
}graph;
typedef struct result {
	int *distances;
	int *parents;
}result;

int findmin(int *distance, int n, int *visited); 
result *sssp(graph *g, int v); 
int getn(graph *g);
void levelwise(graph *g, int v);
void ginit(graph *g, int n);
graph *readfromfile(char *filename); 
void print(graph *g);


