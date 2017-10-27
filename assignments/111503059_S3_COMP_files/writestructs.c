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
	struct info *ptr, *temp;
	int i = 0, size = 0;
	ptr = (struct info *)malloc(sizeof(struct info));
	temp = ptr;
	while((scanf("%d%s%lf", &(ptr + size)->id, (ptr + size)->name, &(ptr + size)->score)) != -1){
		size++;
		ptr = (struct info *)realloc(ptr, ((size + 1)*(sizeof(struct info))));
	}
	if(argc !=2){
		errno = EINVAl;
		printf("usage: ./writestructs <filename>\n");
		return errno;
	}
	int fdw;
	fdw = open(argv[1], O_WRONLY | O_CREAT, S_IRUSR | S_IWUSR);
	if(fdw == -1){
		perror("open failed\n");
		exit(errno);
	
	}
	write(fdw, &size, sizeof(int));
	write(fdw, ptr, size*sizeof(struct info));
	close(fdw);
	return 0;
}
