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
	struct info *ptr, *temp;
	int i = 0, size = 1;
	char ch = 'y';
	ptr = (struct info *)malloc(sizeof(struct info));
	temp = ptr;
	while((ch == 'y' || ch == 'Y') && (scanf("%d%s%lf", &(ptr + size)->id, (ptr + size)->name, &(ptr + size)->score))){
		size++;
		ptr = (struct info *)realloc(&details, (size*(sizeof(struct info))));
		printf("Enter the letter 'Y' or 'y' if you want to continue\n");
		scanf("%c", &ch);
	}
	int fdw;
	fdw = open(argv[1], O_WRONLY | O_CREAT);
	if(fdw == -1){
		perror("open failed");
		exit(errno);
//printf("usage....");	
	}
	write(fdw, &size, sizeof(int));
	for(i = 0; i < size; i++){
		write(fdw, (temp + i ), sizeof(struct info));
	}
	close(fdw);
	return 0;
}
