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
	while(read(fdr, &arr[++i], sizeof(int)) && i < n){
		printf("%d\n", arr[i]);
	}
	read(fdr, &m, sizeof(int));
	//struct data info[m];
	struct data *ptr;
	ptr = (struct data *)malloc(m*sizeof(struct data));
	int j = -1;	
	/*while((++j < m) && read(fdr, &info[j], sizeof(struct data))){
printf("1\n");
		printf("%d	%s\n", info[j].age, info[j].name);
	}*/
	while((++j < m) && read(fdr, (ptr + j), sizeof(struct data))){
printf("1\n");
		printf("%d	%s\n", (ptr + j)->age, (ptr + j)->name);
	}
	//free(ptr);

	read(fdr, &p, sizeof(int));
	char str[p][50];
	int k = -1;
	while(read(fdr, str, strlen(str[++k])) && k < p){
		printf("%s\n", str[k]);	
	}
	close(fdr);
	return 0;
}
