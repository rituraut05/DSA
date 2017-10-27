#include <stdio.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <unistd.h>
#include <errno.h>
int main(int argc, char *argv[]) {
	int fd, i;
	fd = open(argv[1], O_RDONLY);
	read(fd, &i, sizeof(int));
	printf("%d\n", i);
	return 0;
}
