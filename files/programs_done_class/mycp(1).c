#include <stdio.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <unistd.h>
int main(int argc, char *argv[]) {
	int fdr, fdw;
	int x;
	char a[4];
	fdr = open(argv[1], O_RDONLY); 
	if(fdr == -1) {
		printf("open failed\n");
		return 1;
	}
	fdw = open(argv[2], O_WRONLY | O_CREAT, S_IRUSR | S_IWUSR); 
	if(fdw == -1) {
		printf("open for write failed\n");
		return 1;
	}
	while((x = read(fdr, a, 4)))
		write(fdw, a, x);
	close(fdr);
	close(fdw);
	return 0;
}
