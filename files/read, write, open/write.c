#include <stdio.h>
#include <stdio.h>
#include <sys/types.h> /* for open() */
#include <sys/stat.h> /* for open() */
#include <fcntl.h> /* for open() */
#include <stdlib.h> /* for exit() */
#include <unistd.h> /* for read() */
#include <errno.h> /* for using errno and perror */

/* READ The pair of program read.c and write.c together */

/* This program writes an integer as 4 byte data to the file 
 * As a result, the file becomes 'binary' file. 
 * The data actually stored (in bits) is this:
 * 00000000 00000000 00000000 00001010
 * i.e. bytes with values
 * 0  0  0 10
 * 
 * If you use vi/cat/gedit to see the file created, you won't see
 * Any 'readable' data in it. As the BYTES 0 and 10 have
 * no visible ASCII representation
 */
int main(int argc, char *argv[]) {
	int wfd, i;

	wfd = open(argv[1], O_WRONLY | O_CREAT, S_IRUSR|S_IWUSR);
	if(wfd == -1) {
		perror("cp: can't open file ");
		exit(errno);
	}
	
	i = 10;
	write(wfd, &i, sizeof(i));	 
	close(wfd);
	return 0;
}
