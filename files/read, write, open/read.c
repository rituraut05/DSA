#include <stdio.h>
#include <sys/types.h> /* for open() */
#include <sys/stat.h> /* for open() */
#include <fcntl.h> /* for open() */
#include <stdlib.h> /* for exit() */
#include <unistd.h> /* for read() */
#include <errno.h> /* for using errno and perror */

/* This and write.c are related to each other */

/* Use this program to read the contents of the file created
 * by the write.c file.
 * This program reads an integer as a 4 byte integer and so 
 * the bit pattern of 32 bits is stored back properly  in
 * the integer. 
 *
 * We are using printf to print the 32 bits. 
 * NOTE: printf converts a number into a 
 * char-sequence when you say "%d" or "%f". The data
 * in the int i after call to read() is the 32 bit number
 * 00000000 00000000 00000000 00001010
 */
int main(int argc, char *argv[]) {
	int rfd, i;

	rfd = open(argv[1], O_RDONLY);
	if(rfd == -1) {
		perror("cp: can't open file");
		exit(errno);
	}

	read(rfd, &i, sizeof(i));
	printf("%d\n", i);
	close(rfd);
	return 0;
}
