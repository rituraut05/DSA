#include<stdio.h>
#include<error.h>
#include<errno.h>
#include<fcntl.h>
#include <unistd.h> // for close
#include<sys/types.h>
#include<sys/stat.h>
#include<stdlib.h>
#include<string.h>
struct data {         
	int age;        
	char name[16]; 
};
int main(int argc, char *argv[]){
	int fdr, n, m, p;
	fdr = open(argv[1], O_RDONLY);
	if(fdr == -1){
		perror("open failed\n");
		exit(errno);
	}
	if(argc != 2){
		printf("Enter only one filename\n");
		return 1;
	}
	read(fdr, &n, sizeof(int));
	int arr[n], i = -1;
	while(read(fdr, &arr[++i], sizeof(int)) && i < n - 1){
		printf("%d\n", arr[i]);
	}
	read(fdr, &m, sizeof(int));
	//printf("whats wrong with your code %d\n",m);
	//struct data info[m];
	struct data *ptr;
	ptr = (struct data *)malloc(m*sizeof(struct data));
	int j = 0;	
	read(fdr, ptr, m * sizeof(struct data));
	for(j = 0;j < m; j++)
		printf("%d %s\n", ptr[j].age, ptr[j].name);
	read(fdr, &p, sizeof(int));
	char s;
	int k = -1;
	while(read(fdr, &s,sizeof(char))){
		putchar(s);
		if(s=='\0')
			printf("\n");
	}
	close(fdr);
	return 0;
}
