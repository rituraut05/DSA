#include <stdio.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <unistd.h>
#include <errno.h>
int main(int argc, char *argv[]) {
	int i = 58217971, fd;
	fd = open(argv[1], O_WRONLY| O_CREAT, S_IRUSR | S_IWUSR);
	write(fd, &i, sizeof(int));
	close(fd);	
	return 0;
}
