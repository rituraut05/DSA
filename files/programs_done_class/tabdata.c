#include <stdio.h>
#include <string.h>
#include <unistd.h>
#include <errno.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>
int usage(int err) {
	printf("usage: ./program -a | -t <studentname> <filename>\n");
	return err;
}
int main(int argc, char *argv[]) {
	FILE *fp;
	int avgflag = 0, totflag = 0;
	char *studname;
	char stud[16];
	int m1, m2, m3;

	if(argc != 4) 
		return usage(EINVAL);
	if(strcmp(argv[1], "-a") == 0)
		avgflag = 1;
	else if(strcmp(argv[1], "-t") == 0)
		totflag = 1;
	else 
		return usage(EINVAL);
	/* either avgflag is set ot totflag is set */
	studname = argv[2];		

	fp = fopen(argv[3], "r");
	if(fp == NULL) {
		perror("fopen failed:");
		return usage(errno);
	}
	/* Opened the file, got studen't name, and set the flags avg/tot */
	while(fscanf(fp, "%s%d%d%d", stud, &m1, &m2, &m3) != -1) {
		if(strcmp(studname, stud) == 0) {
			if(avgflag == 1)
				printf("%d\n", (m1 + m2 + m3) / 3);
			else
				printf("%d\n", (m1 + m2 + m3));
			break;
		}
	}
		
	return 0;
}
