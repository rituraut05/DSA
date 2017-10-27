#include <stdio.h>
int main(int argc, char *argv[]) {
	FILE *fp;
	fp = fopen(argv[1], "w");
	struct data {
		int x;	
		char n[16];
	}a;
	scanf("%d%s", &a.x, a.n);
	fwrite(&a,sizeof(struct data), 1, fp);
	fclose(fp);
}
