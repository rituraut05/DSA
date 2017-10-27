#include<stdio.h>
struct info {
	int id;
	char name[16];
	double score;
};
int main(int argc, char *argv[] ){
	FILE *fdw;
	struct info details[3];
	for(i = 0 ; i < 3 ; i++){
		scanf("%d", &details[i].id);
		scanf("%s", details[i].name );
		scanf("%s", details[i].score);
	}
	fdw = open(argv[1],"w");
	return 0;
}
