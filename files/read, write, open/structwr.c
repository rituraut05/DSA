#include <stdio.h>
#include <stdio.h>
#include <sys/types.h> /* for open() */
#include <sys/stat.h> /* for open() */
#include <fcntl.h> /* for open() */
#include <stdlib.h> /* for exit() */
#include <unistd.h> /* for read() */
#include <errno.h> /* for using errno and perror */

/* This program and structrd.c are in a pair */
int main(int argc, char *argv[]) {
	int wfd, i;
	struct student {
		char name[16];
		int age;
	}t;

	wfd = open(argv[1], O_WRONLY | O_CREAT, S_IRUSR|S_IWUSR);
	if(wfd == -1) {
		perror("cp: can't open file ");
		exit(errno);
	}

	scanf("%s%d", t.name, &t.age);	
	/* This write will sure create a binary file (ofcourse having 
	 * some readable chars in array 'name' also)
	 * because it will write all 16 chars in the array (not only upto the '\0')
	 * and also the integer */
	write(wfd, &t, sizeof(t));
	close(wfd);
	return 0;
}
