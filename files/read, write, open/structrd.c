#include <stdio.h>
#include <sys/types.h> /* for open() */
#include <sys/stat.h> /* for open() */
#include <fcntl.h> /* for open() */
#include <stdlib.h> /* for exit() */
#include <unistd.h> /* for read() */
#include <errno.h> /* for using errno and perror */

/* Run this program on the output file created by structwr.c */
int main(int argc, char *argv[]) {
	int rfd, i;
	struct student {
		char name[16];
		int age;
	}t;


	rfd = open(argv[1], O_RDONLY);
	if(rfd == -1) {
		perror("cp: can't open file");
		exit(errno);
	}

	read(rfd, &t, sizeof(t));
	printf("%s %d\n", t.name, t.age);
	close(rfd);
	return 0;
}
