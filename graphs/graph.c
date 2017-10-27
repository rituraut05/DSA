#include <stdio.h>
#include <limits.h>
#include <stdlib.h>
#include <errno.h>
#include "graph.h"
#include "queue.h"
int getn(graph *g) {
	return g->n;
}
void ginit(graph *g, int n) {
	int i, j;
	g->n = n;
	g->a = (int **)malloc(sizeof(int *) * n);
	for(i = 0; i < n; i++) {
		g->a[i] = (int *)malloc(sizeof(int) * n);
		for(j = 0; j < n; j++)
			g->a[i][j] = 0;
	}
}
void print(graph *g) {
	int i, j;
	printf("Graph: \n");
	for(i = 0; i < g->n; i++) {
		for(j = 0; j < g->n; j++) 
			printf("%3d", g->a[i][j]);
		printf("\n");
	}
	printf("\n");
}
graph *readfromfile(char *filename) {
	graph *g = (graph *)malloc(sizeof(graph));
	FILE *fp = fopen(filename, "r");
	int n = 0, i, j;
	if(fp == NULL) {
		perror("can't open file:");
		return  NULL;
	}
	fscanf(fp, "%d", &n);
	ginit(g, n);
	for(i = 0; i < n; i++)
		for(j = 0; j < n; j++)
			fscanf(fp, "%d", &(g->a[i][j]));
	return g;
}
void levelwise(graph *g, int r) {
	queue q;
	int i, j, v;
	qinit(&q);
	int *visited = (int *)malloc(sizeof(int) * g->n);
	for(i = 0; i < g->n; i++)
		visited[i] = 0;
	printf("levelwise:[ ");	
	enqueue(&q, r);
	visited[r] = 1;
	while(!qempty(&q)) {
		v = dequeue(&q);
		for(j = 0; j < g->n; j++)
			if(g->a[v][j] != 0 && !visited[j])  {
				enqueue(&q, j);
				visited[j] = 1;
			}
		printf("%d ", v);
	}
	printf("]\n");	
}
void dft(graph *g, int v, int *visited) {
	int i;
	printf("%d ", v);
	visited[v] = 1;
	for(i = 0; i < g->n; i++)
		if(g->a[v][i] && !visited[i])
			dft(g, i, visited);	
}
void depthwise(graph *g, int v) {
	int *visited = (int *)malloc(sizeof(int) * g->n), i;
	for(i = 0; i < g->n; i++)
		visited[i] = 0;
	printf("DFT: [");
	dft(g, v, visited);
	printf("]\n");
}
typedef struct edge {
	int from, to;
}edge;
edge *prims(graph *g, int v) {
	int i, j, k, minweight;
	edge minedge;

	int *visited = (int *)malloc(sizeof(int) * g->n);
	for(i = 0; i < g->n; i++)
		visited[i] = 0;

	int *vertices = (int *)malloc(sizeof(int) * g->n);
	//V = {v};
	int vi = 0;//stores the number of vertices selected
	vertices[vi++] = v;//stores the vertices selected
	visited[v] = 1;//marks visited when the vertices are selected
	
	edge *result = (edge *)malloc(sizeof(edge) * (g->n - 1));//stores the edges that are selected
	int ei = 0;//stores the number of edges selected

	for(k = 0; k < g->n - 1; k++) {
		minedge.from = -1;
		minedge.to = -1;
		minweight = INT_MAX;
		for(i = 0; i < vi; i++) {//for each selected vertex check the edge from that vertex
			for(j = 0; j < g->n; j++)
				if(g->a[vertices[i]][j]	!=0 && !visited[j]) {//if there exis a edge from the selected vertex to a vertex that is not visited
					if(g->a[vertices[i]][j] < minweight) {//finding the minimum of the weights amongst all the verticess
						minweight = g->a[vertices[i]][j];
						minedge.from = vertices[i];
						minedge.to = j;	
					}
				}
		}	
		/*select minedge <c, d, > s.t. c Belongs-to-V 
			and d doesnt-belong-to-V
			and <c, d> is min-weight */
		if(minedge.from != -1) {	
			vertices[vi++] =  minedge.to; 
			result[ei++] = minedge; 
			visited[minedge.to] = 1;
		} else
			return result;
	}
	printf("Prims: %d \n[", v);
	for(k = 0; k < g-> n - 1; k++)
		printf("%d -> %d,", result[k].from, result[k].to);
	printf("]\n");
	return result;
}
int findmin(int *distance, int n, int *visited) {
	int i, min, minpos;
	min = distance[0];
	minpos = 0;
	for(i = 1; i < n; i++) {
		if(distance[i] < min && !visited[i]) {
			min = distance[i];
			minpos = i;
		}	
	}
	return minpos;
}
result *sssp(graph *g, int v) {
	int *visited = (int *)malloc(sizeof(int) * g->n);
	int *distance = (int *)malloc(sizeof(int) * g->n);
	int *parents= (int *)malloc(sizeof(int) * g->n);
	result *res = (result *)malloc(sizeof(struct result));
	int i, j, k, u, newdistance;
	/* sum up all edges, to get maximum possible path length */
	/*for(i = 0; i < g->n; i++)
		for(j = 0; j < g->n; j++)
			max += g->a[i][j]; */

	for(i = 0; i < g->n; i++) {
		visited[i] = 0;
		parents[i] = -1;
	}
	visited[v] = 1; /* source vertex is visited */
	
	for(i = 0; i < g->n; i++)
		if(g->a[v][i] == 0) 
		/* non existent edge, set distance to max possible + 1 */
			distance[i] = INT_MAX; // INFINITY
		/* if edge exists then the distance is the weight of the edge */
		else {
			distance[i] = g->a[v][i];
			parents[i] = v;
		}
	for(k = 0; k < g->n - 1; k++) {
		u = findmin(distance, g->n, visited);
		visited[u] = 1;
		//printf("%d: %d\n", u, distance[u]);
		for(j = 0; j < g->n; j++) {
			if(!visited[j]) { // only this line was added after class
				if(g->a[u][j])
					newdistance = distance[u] + g->a[u][j];
				else
					newdistance = INT_MAX;
				if(newdistance < distance[j]) {
					distance[j] = newdistance;
					parents[j] = u;
				}
			}
		}
	}	
	res->distances = distance;
	res->parents = parents;
	return res;
}
