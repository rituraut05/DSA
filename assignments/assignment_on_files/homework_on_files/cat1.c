#include<stdio.h>
#include<error.h>
#include<errno.h>
#include<fcntl.h>
#include <unistd.h> // for close
#include<sys/types.h>
#include<sys/stat.h>
#include<stdlib.h>
int main(int argc, char *argv[]){
	int f1, f2;
	char c;
	if(argc != 3){
		errno = EINVAL;
		perror("usage: ./a.out <sourcefile> <targetfile>\n");
		return errno;
	}
	if((f1 = open(argv[1], O_RDONLY | S_IRUSR | S_IWUSR)) == -1){
		perror("open failed\n");
		exit(errno);
	}
	if((f2 = open(argv[2], O_RDONLY | S_IRUSR | S_IWUSR)) == -1){
		perror("open failed\n");
		exit(errno);
	}
	while(read(f1, &c, 1))
		;
	close(f1);
	if((f1 = open(argv[1], O_WRONLY | S_IRUSR | S_IWUSR)) == -1){
		perror("open failed\n");
		exit(errno);
	}
	while(read(f2, &c, 1))
		write(f1, &c, 1);
	close(f1);
	close(f2);
	return 0;
}
