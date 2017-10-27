#include<stdio.h>
#include<error.h>
#include<errno.h>
#include<fcntl.h>
#include <unistd.h> // for close
#include<sys/types.h>
#include<sys/stat.h>
#include<stdlib.h>
int main(int argc, char *argv[]){
	char c;
	if(argc != 3){
		errno = EINVAL;
		perror("usage: ./a.out <sourcefile> <targetfile>\n");
		return errno;
	}
	FILE *f1;
	FILE *f2;
	if(((f1 = fopen(argv[1], "a")) == NULL) || ((f2 = fopen(argv[1], "r")) == NULL)){
		printf("cat: Can't open %s\n", argv[1]);
		return 1;
	}
	else{
		int x = 1;
		while(fread(&c, 1, 1, f2) && (x != -1)){
			x = fwrite(&c, 1, 1, f1);
		}
	}
	fclose(f1);
	fclose(f2);
	return 0;
}
