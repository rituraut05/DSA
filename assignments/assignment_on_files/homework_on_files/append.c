#include<stdio.h>
#include<errno.h>
#include<fcntl.h>
#include<stdlib.h>
#include<sys/stat.h>
#include<sys/types.h>
#include<unistd.h>
#include<error.h>
#include<string.h>
int main(int argc, char *argv[]){
	int fd1, fd2;
	char c;
	fd1 = open(argv[1], O_APPEND, S_IRUSR | S_IWUSR);
	fd2 = open(argv[2], O_RDONLY, S_IRUSR | S_IWUSR);
	if((fd1 == -1) || (fd2 == -1)){
		perror("open failed\n");
		exit(errno);
	}
	if(argc != 3){
		errno = EINVAL;
		perror("usage: ./a.out <file1> <file2>\n");
		return errno;
	}
	while((read(fd2, &c, 1)) != -1){
		lseek(fd1, 0, SEEK_END);
		write(fd1, &c, 1);
	}
	return 0;
}
