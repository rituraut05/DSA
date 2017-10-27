#include<stdio.h>
#include<error.h>
#include<errno.h>
#include<fcntl.h>
#include <unistd.h> 
#include<sys/types.h>
#include<sys/stat.h>
#include<stdlib.h>
#include<ctype.h>
int main(int argc, char *argv[]){
	int fd, flag = 1;
	char c;
	if(argc != 2){
		errno = EINVAL;
		perror("usage: ./textorbinary <filename>\n");
		return errno;
	}
	fd = open(argv[1], O_RDONLY, S_IRUSR | S_IWUSR);
		if(fd == -1){
		perror("open failed\n");
		exit(errno);
	}
	while(read(fd, &c, 1)){
		if(!isprint(c) && (c != '\t') && (c != '\n')){
			flag = 0;
			printf("%s is a binary file\n", argv[1]);
			break;
		}
	}
	if(flag)
		printf("%s is a text file\n", argv[1]);
	close(fd);
	return 0;
}
