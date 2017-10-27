#include <stdio.h>
#include <errno.h>
#include "graph.h"
int main(int argc, char *argv[]) {
	graph *g;
	int i, j, k;
	result *results;
	if(argc < 2)  {
		errno = EINVAL;
		perror("usage: ./program filename");
		return errno;
	}
	g = readfromfile(argv[1]);
	if(g)
		print(g);
	for(i = 0; i < getn(g) ;i++) {
		//levelwise(g, i);
		//depthwise(g, i);
		//prims(g, i);
		results = sssp(g, i);
		printf("Distances: %d \n", i);
		for(j = 0; j < getn(g); j++) {
			printf("%d -> %d, %d\n", i, j, results->distances[j]);
			printf("Path: %d ", j);
			k = j;
			while(k != i) {
				printf("%d ", results->parents[k]);
				k = results->parents[k];
			}
			printf("\n");
		}
		printf("\n");
	}
	return 0;
}
