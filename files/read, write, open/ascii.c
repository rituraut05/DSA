#include <stdio.h>
#include <stdio.h>
#include <sys/types.h> /* for open() */
#include <sys/stat.h> /* for open() */
#include <fcntl.h> /* for open() */
#include <stdlib.h> /* for exit() */
#include <unistd.h> /* for read() */

/* This program prints the ASCII values of all "BYTE"s. 
 * One BYTE can contain 0..255 values
 * Printing the character representation given by ASCII
 * for each of the valeus 0..255
 */
int main(int argc, char *argv[]) {
	int i;
	for(i = 0; i < 256; i++) {
		/* %3d means print number in 3 columns */
		printf("%3d %3c ", i, i);
		if(i % 8 == 0)
			printf("\n");
	}
	printf("\n");
	return 0;
}
