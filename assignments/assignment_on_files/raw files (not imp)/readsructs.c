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
};

int main(int argc, char *argv[]){
	int fdr;
	char c;
	fdr = open(argv[1], O_RDONLY);
	if(fdr == -1){
		perror("open failed");
		exit(errno);

	}


	while(read(fdr, &c, 1) /*&& (c = getchar()) != EOF)*/){
		
	}
	return 0;
}
