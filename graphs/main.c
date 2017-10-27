#include <stdio.h>
#include <stdlib.h>
#include <limits.h>
#include <string.h>
#include <errno.h>
#include "graph.h"
int getindex(char *name, char **cities, int n) {
	int i;
	for(i = 0; i < n; i++)
		if(strcmp(cities[i], name) == 0)
			return i;
	return -1;
}
int readline(FILE *fp, char *line, int count) {
	int i = 0, ch;
	while((i < count) && ((ch = fgetc(fp)) != '\n') && (ch != EOF))
		line[i++] = ch;
	line[i] = '\0';
	return i;	
}
void printpath(char **citynames, result *results, int k, int v) {
	if(k == -1)
		return;
	if(k == v)
		printf("%s ", citynames[k]);
	else {
		printpath(citynames, results, results->parents[k], v);
		printf("%s ", citynames[k]);
	}
}
void findallpaths(char *filename, char *from) {
	/*  read the file and create the graph.
	    find all shortest paths from "from" sssp()
	    print the shortest paths with city-names
	 */
	FILE *fp;
	graph g;
	char line[128];
	result *results;
	char **citynames;
	citynames = (char **)malloc(sizeof(char *) * 100);
	int ci = 0, count,  j, n, k;
	
	fp = fopen(filename, "r");
	if(fp == NULL) {
		perror("can't open file:");
		exit(errno);
	}
	/* read every line, get the city name, and count #cities */
	while(!feof(fp)) {
		count = readline(fp, line, 128);
		//printf("%s \n", line);
		if(count == 0)
			break;
		char *tokenf = strtok(line, " \t");		
		char *tokent = strtok(NULL, " \t");		
		char *tokend = strtok(NULL, " \t");		
		if(!tokenf || !tokent || !tokend)
			break;
		j = getindex(tokenf, citynames, ci);
		if(j == -1) {
			citynames[ci] = malloc(strlen(tokenf) + 1);
			strcpy(citynames[ci], tokenf);
			ci++;
		}
		j = getindex(tokent, citynames, ci);
		if(j == -1) {
			citynames[ci] = malloc(strlen(tokent) + 1);
			strcpy(citynames[ci], tokent);
			ci++;
		}
	}
	n = ci;
	/* create a graph with n nodes */
	ginit(&g, n);
	/* fill the graph */
	print(&g);
	fseek(fp, SEEK_SET, 0);
	while(!feof(fp)) {
		count = readline(fp, line, 128);
		//printf("%s \n", line);
		if(count == 0)
			break;
		char *tokenf = strtok(line, " \t");		
		char *tokent = strtok(NULL, " \t");		
		char *tokend = strtok(NULL, " \t");		
		j = getindex(tokenf, citynames, ci);
		k = getindex(tokent, citynames, ci);
		g.a[j][k] = atoi(tokend);
		g.a[k][j] = atoi(tokend);
	}
	print(&g);
	int i = getindex(from, citynames, n);
	results = sssp(&g, i);
	printf("Distances: %d \n", i);
	for(j = 0; j < getn(&g); j++) {
		//printf("%s -> %s, %d\n", citynames[i], citynames[j], results->distances[j]);
		//printf("Path: %s ", citynames[j]);
		printpath(citynames, results, j, i);
		if(results->distances[j] == INT_MAX)
			printf("NO PATH");
		else {
			printf("%d ", results->distances[j]);
			/*k = j;   // This will print the path in reverse order, so the recursive function printpath() is written.
			while(k != i) {
				printf("%s ", citynames[results->parents[k]]);
				k = results->parents[k];
			} */ 
		}
		printf("\n");
	}
	printf("\n");
}
int main(int argc, char *argv[]) {
	//graph *g;
	//int i, j, k;
	//result *results;
	if(argc < 2)  {
		errno = EINVAL;
		perror("usage: ./program filename");
		return errno;
	}
	findallpaths(argv[1], argv[2]);
	return 0;
}
