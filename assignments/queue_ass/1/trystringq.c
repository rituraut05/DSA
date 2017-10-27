#include <stdio.h>
#include <stdlib.h>
#include "stringq.h"
void printmenu() {
	printf("1. New patient\n");
	printf("2. Send patient to doctor\n");
	printf("3. Exit\n");
}
int main() {
	char name[16], *n;
	int choice;
	queue q;
	qinit(&q);
	while(1) {
		qprint(&q);
		printmenu();
		scanf("%d", &choice);
		switch(choice) {
			case 1:
				if(!qfull(&q)) {
					scanf("%s", name);
					enqueue(&q, name);
				} else {
					printf("Patient go home, business in full swing\n");
					continue;
				}
				break;
			case 2:
				if(!qempty(&q)) {
					n= dequeue(&q);
					printf("Send %s to doctor\n", n);
					free(n);
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
	}
	return 0;
}
