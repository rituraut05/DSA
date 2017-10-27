#include<stdio.h>
#include<error.h>
#include<errno.h>
#include<fcntl.h>
#include <unistd.h> // for close
#include<sys/types.h>
#include<sys/stat.h>
#include<stdlib.h>
int main(int argc, char *argv[]){	
	int fdr, x;
	char ch;
	fdr = open(argv[1], O_RDONLY | O_CREAT, S_IRUSR | S_IWUSR );
	if(fdr == -1){
		perror("open failed");
		exit(errno);
//printf("usage....");	
	}
	while(x = read(fdr, &ch, 1))
		printf("%d\n", x);
	close(fdr);
	return 0;
}
