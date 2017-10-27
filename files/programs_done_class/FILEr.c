#include <stdio.h>
int main(int argc, char *argv[]) {
	FILE *fp;
	fp = fopen(argv[1], "r");
	struct data {
		int x;	
		char n[16];
	}a;
	fread(&a,sizeof(struct data), 1, fp);
	printf("%d %s\n", a.x, a.n);
	fclose(fp);
}
