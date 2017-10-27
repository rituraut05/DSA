#include <stdio.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <unistd.h>
#include <errno.h>
int main(int argc, char *argv[]) {
	int fdr, fdw, x;
	char ch;

	if(argc < 3) {
		errno = EINVAL;
		perror("usage: ./mycp <source file> <dest file>");
		return errno;
	}
	fdr = open(argv[1], O_RDONLY); 
	if(fdr == -1) {
		perror("open failed: ");
		return errno;		
	}

	fdw = open(argv[2], O_WRONLY | O_CREAT, S_IRUSR | S_IWUSR); 
	if(fdw == -1) {
		perror("open failed: ");
		return errno;		
	}
	while((x = read(fdr, &ch, 1)))
		write(fdw, &ch, 1);
		// write to the destination file
	close(fdr);
	close(fdw);
	
	return 0;
}
