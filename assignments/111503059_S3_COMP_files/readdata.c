#include<stdio.h>
#include<error.h>
#include<errno.h>
#include<fcntl.h>
#include <unistd.h> 
#include<sys/types.h>
#include<sys/stat.h>
#include<stdlib.h>
#include<string.h>
struct data {         
	int age;        
	char name[16]; 
}a;
int main(int argc, char *argv[]){
	int fdr, n, i = 0, num;
	char s;
	if((fdr = open(argv[1], O_RDONLY)) == -1){
		perror("open failed\n");
		exit(errno);
	}
	if(argc != 2){
		errno = EINVAL;
		perror("usage: ./readdata <filename>\n");
		return errno;
	}
	read(fdr, &n, sizeof(int));
	while((i < n) && (read(fdr, &num, sizeof(num)))){
		printf("%d\n", num);
		i++;
	}
	i = 0;
	read(fdr, &n, sizeof(int));
	while((i < n) && (read(fdr, &a, sizeof(a)))){
		printf("%d	%s\n", a.age, a.name);
		i++;
	}
	i = 0;
	read(fdr, &n, sizeof(int));
	while(read(fdr, &s, sizeof(char))){
		putchar(s);
		if(s=='\0')
			printf("\n");
	}
	close(fdr);
	return 0;
}




