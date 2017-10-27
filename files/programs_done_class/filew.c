#include <stdio.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <unistd.h>
int main(int argc, char *argv[]) {
	int fd;
	int x, i = 1234;
	double f = 3.14;
	char a[4];
	fd = open(argv[1], O_WRONLY | O_CREAT, S_IRUSR|S_IWUSR); 
	if(fd == -1) {
		printf("open failed\n");
		return 1;
	}
	x = write(fd, &i, sizeof(i));
	x = write(fd, &f, sizeof(f));
	
	close(fd);
	return 0;
}
