#include <stdio.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <unistd.h>
#include <errno.h>
int main(int argc, char *argv[]) {
	int fd, x;
	char ch;

	if(argc <2) {
		errno = EINVAL;
		perror("bad arguments:");
		return errno;
	}
	fd = open(argv[1], O_RDONLY); 
	if(fd == -1) {
		perror("open failed: ");
		return errno;		
	}
	while((x = read(fd, &ch, 1)))
		putchar(ch);
	close(fd);
	
	return 0;
}
