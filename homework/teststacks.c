#include <stdio.h>
#include <stdlib.h>
#include "stackandlist.h"
void printmenu() {
	printf("1. New patient\n");
	printf("2. Send patient to doctor\n");
	printf("3. Exit\n");
}
int main() {
	int name, n;
	int choice;
	stack q;
printf("hey\n");
	sinit(&q);
printf("hey\n");
	while(1) {
		printmenu();
		scanf("%d", &choice);
		switch(choice) {
			case 1:
				if(!full(&q)) {
					scanf("%d", &name);
					push(&q, name);
				} else {
					printf("Patient go home, business in full swing\n");
					continue;
				}
				break;
			case 2:
				if(!empty(&q)) {
					n= pop(&q);
					//printf("Send %d to doctor\n", n);
					//free(n);
				} else {
					printf("No patients. Doctor, close the dukaan\n");
					continue;
				}
				break;
			case 3:
				return 0;
			default:
				break;
		}
		printstack(&q);
	}
	return 0;
}
