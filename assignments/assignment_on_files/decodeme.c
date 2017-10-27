#include<stdio.h>
#include<error.h>
#include<errno.h>
#include<fcntl.h>
#include <unistd.h> // for close
#include<sys/types.h>
#include<sys/stat.h>
#include<stdlib.h>
#include<ctype.h>
int main(int argc, char *argv[]){
	int fd;
	char c;
	if((fd  = open(argv[1], O_RDONLY, S_IRUSR | S_IWUSR)) == -1){
		perror("open failed\n");
		exit(errno);
	}
	while(read(fd, &c, 1) != -1){
		//if(!isprint(c) && (c != ' ')){
		//	float num = atof(c);
		//	printf("%f", num);
		//}
		//else{
			printf("%c", c);
		//}
	}
	return 0;
}
