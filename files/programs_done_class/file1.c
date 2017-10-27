#include <stdio.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <unistd.h>
int main(int argc, char *argv[]) {
	int fd;
	int x, i;
	char a[4];
	fd = open(argv[1], O_RDONLY); 
	if(fd == -1) {
		printf("open failed\n");
		return 1;
	}
	x = read(fd, a, 4);
	for(i = 0; i < x; i++)
		putchar(a[i]);
	
	close(fd);
	return 0;
}
