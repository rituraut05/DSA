#include<stdio.h>
#include<error.h>
#include<errno.h>
#include<fcntl.h>
#include <unistd.h> 
#include<sys/types.h>
#include<sys/stat.h>
#include<stdlib.h>
struct info {
	int id;
	char name[16];
	double score;
};

int main(int argc, char *argv[]){
	struct info *ptr;
	int fdr, i =0, size;
	if(argc != 3){
		errno = EINVAL;
		printf("usage: ./readstructs <filename> <score>\n");
		return errno;	
	}
	fdr = open(argv[1], O_RDONLY);
	if(fdr == -1){
		perror("open failed\n");
		exit(errno);
	}
	read(fdr, &size, sizeof(int));
	struct info details[size];
	while(read(fdr, &details[i], sizeof(struct info)) && i < size){
		if(atof(argv[2]) == details[i].score)
			printf("%d	%s	%lf\n", details[i].id, details[i].name, details[i].score);
		i++;
	}
	close(fdr);
	return 0;
}
