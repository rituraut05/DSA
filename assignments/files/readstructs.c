#include<stdio.h>
#include<error.h>
#include<errno.h>
#include<fcntl.h>
#include <unistd.h> // for close
#include<sys/types.h>
#include<sys/stat.h>
#include<stdlib.h>
struct info {
	int id;
	char name[16];
	double score;
}details;

int main(int argc, char *argv[]){
	struct info *ptr;
	int fdw;
	fdr = open(argv[1], O_RDONLY);
	if(fdr == -1){
		perror("open failed");
		exit(errno);
//printf("usage....");	
	}
	read(fdr, &size, sizeof(int));
	while(read(fdr, &details[i], sizeof(details[i])) && i < size){
		i++;
		if(atoi(argv[3] == details[i].score))
			prinf("%d	%s	%lf\n", details[i].id, details[i].name, details[i].score);
	}
	return 0;
}
