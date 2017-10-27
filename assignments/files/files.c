#include<stdio.h>
#include<error.h>
#include<errno.h>
#include<fcntl.h>
#include <unistd.h> // for close
#include<sys/types.h>
#include<sys/stat.h>
#include<stdlib.h>
struct info {
	int id;
	char name[16];
	double score;
};

int main(int argc, char *argv[]){
	int n, i;
	printf("Enter the size of array of the structure\n");
	scanf("%d", &n);
	struct info details[n];
	for(i = 0 ; i < n; i++){
		printf("Enter your id\nenter your name\nEnter your score\n");
		scanf("%d", &details[i].id);
		scanf("%s", details[i].name );
		scanf("%lf", &details[i].score);
	}
	if(argc != 1){
		printf("%d")
	}
	int fdw;
	fdw = open(argv[1], O_WRONLY | O_CREAT);
	if(fdw == -1){
		perror("open failed");
		exit(errno);

	}
	write(fdw, &n, sizeof(int));
	for(i = 0; i < n; i++){
		int j =0;
		write(fdw, &details[i].id, sizeof(int));
		while(details[i].name[j++] != '\0'){
			write(fdw, &details[i].name[j], sizeof(char));
		}
		write(fdw, &details[i].score, sizeof(double));
	}
	close(fdw);
	return 0;
