#include <stdio.h>
#include <stdio.h>
#include <sys/types.h> /* for open() */
#include <sys/stat.h> /* for open() */
#include <fcntl.h> /* for open() */
#include <stdlib.h> /* for exit() */
#include <unistd.h> /* for read() */
#include <errno.h> /* for using errno and perror */

int main(int argc, char *argv[]) {
	int wfd, i;

	wfd = open(argv[1], O_WRONLY | O_CREAT, S_IRUSR|S_IWUSR);
	if(wfd == -1) {
		perror("cp: can't open file ");
		exit(errno);
	}
	
	write(wfd, "abhijit\n", 9);	 
	write(wfd, "10\n", 3);	
	i = 1785425037;
	/* 1785425037 in Decimal = 01101010011010110110110010001101 in 32-bit binary
	 * When we write this number to the file, the above 32-bit binary is written.
	 * What will be the output if we try to read this file, "BYTE by BYTE" and print
	 * Each byte on screen?
	 * 
         * Cutting into 8 bits each Above number is 
	 * 01101010 01101011 01101100 10001101
	 * That is, considering the decimal values of each "BYTE" 
         * 106   107	108	141
	 * Now, because of "little endian" representation the byte order is 3-2-1-0 for 4 bytes.
	 * the values are actually stored as (in 4 bytes)
	 * 141 108 107 106 
	 * Now ASCII value for 106..108 are j,k,l and 141 is not printable.
	 * 
	 * So if you try to 'cat' the file which was created, it will print
	   abhijit
	   10
	   @lkj  
	 * where @will be non-printable character
	 */
	write(wfd, &i, sizeof(i));	 
	close(wfd);
	return 0;
}
